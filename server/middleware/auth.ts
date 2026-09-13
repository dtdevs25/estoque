import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string; locationIds: string[] };
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ message: 'Não autenticado.' });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Fetch latest user from DB to get up-to-date roles and locationIds
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || user.status === 'INATIVO') {
      res.status(401).json({ message: 'Usuário inválido ou inativo.' });
      return;
    }
    
    req.user = { 
      id: user.id, 
      role: user.role, 
      email: user.email, 
      locationIds: user.locationIds || []
    };
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
