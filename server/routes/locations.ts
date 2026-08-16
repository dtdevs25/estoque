import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const locationsRouter = Router();
locationsRouter.use(authenticate);

// GET /api/locations
locationsRouter.get('/', async (_req, res) => {
  try {
    const locations = await prisma.location.findMany({ orderBy: { name: 'asc' } });
    res.json(locations);
  } catch {
    res.status(500).json({ message: 'Erro ao listar almoxarifados.' });
  }
});

// POST /api/locations
locationsRouter.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, code, address, description, responsibleName, responsibleContact } = req.body;
    if (!name || !code) {
      res.status(400).json({ message: 'Nome e código são obrigatórios.' });
      return;
    }
    const location = await prisma.location.create({
      data: { name, code: code.toUpperCase(), address, description, responsibleName, responsibleContact },
    });
    res.status(201).json(location);
  } catch (e: any) {
    if (e.code === 'P2002') {
      res.status(409).json({ message: 'Código de almoxarifado já existe.' });
      return;
    }
    res.status(500).json({ message: 'Erro ao criar almoxarifado.' });
  }
});

// PUT /api/locations/:id
locationsRouter.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, code, address, description, responsibleName, responsibleContact } = req.body;
    const location = await prisma.location.update({
      where: { id: req.params.id },
      data: { name, code: code?.toUpperCase(), address, description, responsibleName, responsibleContact },
    });
    res.json(location);
  } catch {
    res.status(500).json({ message: 'Erro ao atualizar almoxarifado.' });
  }
});

// DELETE /api/locations/:id
locationsRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const hasItems = await prisma.epiItem.count({ where: { locationId: req.params.id } });
    if (hasItems > 0) {
      res.status(400).json({ message: 'Não é possível excluir: existem itens vinculados a este almoxarifado.' });
      return;
    }
    await prisma.location.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Erro ao excluir almoxarifado.' });
  }
});
