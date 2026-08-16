import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { sendPasswordSetupEmail } from '../lib/email.js';

export const usersRouter = Router();
usersRouter.use(authenticate);

const SAFE_SELECT = {
  id: true, name: true, email: true, role: true, locationIds: true,
  status: true, department: true, notes: true, createdAt: true, updatedAt: true,
};

// GET /api/users
usersRouter.get('/', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({ select: SAFE_SELECT, orderBy: { name: 'asc' } });
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Erro ao listar usuários.' });
  }
});

// POST /api/users
usersRouter.post('/', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, email, role, locationIds, department, notes, status } = req.body;
    if (!name || !email) {
      res.status(400).json({ message: 'Nome e e-mail são obrigatórios.' });
      return;
    }

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) {
      res.status(409).json({ message: 'E-mail já cadastrado.' });
      return;
    }

    // Generate temp password and send setup email
    const tempToken = crypto.randomBytes(32).toString('hex');
    const tempPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: tempPassword,
        role: role || 'VIEWER',
        locationIds: locationIds || ['ALL'],
        department,
        notes,
        status: status || 'ATIVO',
      },
      select: SAFE_SELECT,
    });

    // Save setup token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: tempToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    });

    // Send welcome email
    try {
      await sendPasswordSetupEmail(user.email, user.name, tempToken);
    } catch (e) {
      console.warn('Failed to send welcome email:', e);
    }

    res.status(201).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erro ao criar usuário.' });
  }
});

// PUT /api/users/:id
usersRouter.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, email, role, locationIds, department, notes, status } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email: email?.toLowerCase(), role, locationIds, department, notes, status },
      select: SAFE_SELECT,
    });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
});

// DELETE /api/users/:id
usersRouter.delete('/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    if (req.params.id === req.user!.id) {
      res.status(400).json({ message: 'Você não pode excluir sua própria conta.' });
      return;
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Erro ao excluir usuário.' });
  }
});

// POST /api/users/:id/resend-password
usersRouter.post('/:id/resend-password', requireAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) { res.status(404).json({ message: 'Usuário não encontrado.' }); return; }

    const token = crypto.randomBytes(32).toString('hex');
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    });
    await sendPasswordSetupEmail(user.email, user.name, token);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Erro ao reenviar senha.' });
  }
});
