import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { locationsRouter } from './routes/locations.js';
import { itemsRouter } from './routes/items.js';
import { kitsRouter } from './routes/kits.js';
import { movementsRouter } from './routes/movements.js';
import { uploadRouter } from './routes/upload.js';

// ─── Env validation ────────────────────────────────────────────────────────
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET', 'NEXTAUTH_URL'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
}
if (process.env.JWT_SECRET!.length < 32) {
  console.error('❌ JWT_SECRET must be at least 32 characters.');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const isProd = process.env.NODE_ENV === 'production';
const ALLOWED_ORIGIN = isProd ? process.env.NEXTAUTH_URL! : 'http://localhost:3000';

// ─── Trust proxy (for CapRover / Nginx reverse proxy) ─────────────────────
app.set('trust proxy', 1);

// ─── Security headers ──────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
    xFrameOptions: { action: 'deny' },
    noSniff: true,
  })
);

// ─── CORS ──────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

// ─── Global API rate limit (safety net) ───────────────────────────────────
app.use(
  '/api/',
  rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    max: 200,              // 200 req/min per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Muitas requisições. Aguarde um momento.' },
  })
);

// ─── Parsers ───────────────────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));           // Tighter than default
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Remove powered-by header ──────────────────────────────────────────────
app.disable('x-powered-by');

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/items', itemsRouter);
app.use('/api/kits', kitsRouter);
app.use('/api/movements', movementsRouter);
app.use('/api/upload', uploadRouter);

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', ts: new Date().toISOString() })
);

// ─── Serve frontend (production) ──────────────────────────────────────────
if (isProd) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath, { index: false }));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

// ─── Global error handler ──────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[unhandled error]', err);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 EstoqueEPI [${isProd ? 'PROD' : 'DEV'}] → http://0.0.0.0:${PORT}`);
});
