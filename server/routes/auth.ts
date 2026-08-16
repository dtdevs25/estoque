import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { prisma } from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { sendPasswordResetEmail } from '../lib/email.js';

export const authRouter = Router();

// ─── Rate Limiters ─────────────────────────────────────────────────────────
// Max 10 login attempts per IP per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  skipSuccessfulRequests: true,
});

// Max 5 password-reset requests per IP per hour
const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Muitas solicitações. Tente novamente mais tarde.' },
});

// ─── Helpers ───────────────────────────────────────────────────────────────
function issueToken(userId: string, role: string, email: string): string {
  return jwt.sign(
    { id: userId, role, email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d', algorithm: 'HS256' }
  );
}

function setAuthCookie(res: any, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

// ─── POST /api/auth/login ──────────────────────────────────────────────────
authRouter.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
      return;
    }
    if (email.length > 255 || password.length > 256) {
      res.status(400).json({ message: 'Dados inválidos.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Always query DB and compare (prevents timing-based user enumeration)
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Use a dummy hash if user not found so timing is consistent
    const hashToCompare = user?.password ?? '$2a$12$invalidhashfortiminguniformity..padded';
    const valid = await bcrypt.compare(password, hashToCompare);

    if (!user || !valid) {
      // Generic message — don't reveal whether email exists
      res.status(401).json({ message: 'E-mail ou senha inválidos.' });
      return;
    }

    if (user.status === 'INATIVO') {
      res.status(403).json({ message: 'Conta suspensa. Contate o administrador.' });
      return;
    }

    const token = issueToken(user.id, user.role, user.email);
    setAuthCookie(res, token);

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (e) {
    console.error('[auth/login]', e);
    res.status(500).json({ message: 'Erro interno. Tente novamente.' });
  }
});

// ─── POST /api/auth/logout ─────────────────────────────────────────────────
authRouter.post('/logout', (_req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ success: true });
});

// ─── GET /api/auth/me ──────────────────────────────────────────────────────
authRouter.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, name: true, email: true, role: true,
        locationIds: true, status: true, department: true,
        notes: true, createdAt: true,
      },
    });
    if (!user || user.status === 'INATIVO') {
      res.clearCookie('token', { path: '/' });
      res.status(401).json({ message: 'Sessão inválida.' });
      return;
    }
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Erro interno.' });
  }
});

// ─── POST /api/auth/forgot-password ───────────────────────────────────────
authRouter.post('/forgot-password', forgotLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || email.length > 255) {
      res.status(400).json({ message: 'E-mail inválido.' });
      return;
    }

    // Always respond success — prevents email enumeration
    res.json({ success: true });

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) return; // Fire-and-forget: respond before this check

    // Invalidate previous tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const token = crypto.randomBytes(48).toString('hex');
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: crypto.createHash('sha256').update(token).digest('hex'), // store hashed
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    // Send the unhashed token in the email link
    await sendPasswordResetEmail(user.email, user.name, token).catch(e =>
      console.error('[forgot-password] email send failed:', e)
    );
  } catch (e) {
    console.error('[auth/forgot-password]', e);
    // Already responded — swallow
  }
});

// ─── POST /api/auth/reset-password ────────────────────────────────────────
authRouter.post('/reset-password', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8 || password.length > 256) {
      res.status(400).json({ message: 'Token inválido ou senha muito curta (mínimo 8 caracteres).' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token: hashedToken } });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      res.status(400).json({ message: 'Link inválido ou expirado. Solicite um novo.' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashed } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { used: true } }),
    ]);

    res.json({ success: true });
  } catch (e) {
    console.error('[auth/reset-password]', e);
    res.status(500).json({ message: 'Erro interno.' });
  }
});
