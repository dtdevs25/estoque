import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ message: 'Não autenticado.' });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ message: 'Apenas administradores podem realizar esta ação.' });
    return;
  }
  next();
}

export function requireAdminOrController(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role === 'VIEWER') {
    res.status(403).json({ message: 'Visualizadores não podem modificar dados.' });
    return;
  }
  next();
}
