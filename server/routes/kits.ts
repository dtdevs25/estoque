import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireAdmin, requireAdminOrController } from '../middleware/auth.js';

export const kitsRouter = Router();
kitsRouter.use(authenticate);

// GET /api/kits
kitsRouter.get('/', async (_req, res) => {
  try {
    const kits = await prisma.epiKit.findMany({
      include: { components: true },
      orderBy: { name: 'asc' },
    });
    res.json(kits);
  } catch {
    res.status(500).json({ message: 'Erro ao listar kits.' });
  }
});

// POST /api/kits
kitsRouter.post('/', requireAdminOrController, async (req, res) => {
  try {
    const { name, description, type, imageUrl, components } = req.body;
    if (!name || !components?.length) {
      res.status(400).json({ message: 'Nome e componentes são obrigatórios.' });
      return;
    }

    const kit = await prisma.epiKit.create({
      data: {
        name, description, type: type || 'EPI_EPC', imageUrl,
        components: {
          create: components.map((c: any) => ({
            itemId: c.itemId,
            itemName: c.itemName,
            quantity: c.quantity,
          })),
        },
      },
      include: { components: true },
    });
    res.status(201).json(kit);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erro ao criar kit.' });
  }
});

// PUT /api/kits/:id
kitsRouter.put('/:id', requireAdminOrController, async (req, res) => {
  try {
    const { name, description, type, imageUrl, components } = req.body;

    // Delete old components and recreate
    await prisma.kitComponent.deleteMany({ where: { kitId: req.params.id } });

    const kit = await prisma.epiKit.update({
      where: { id: req.params.id },
      data: {
        name, description, type, imageUrl,
        components: {
          create: components?.map((c: any) => ({
            itemId: c.itemId,
            itemName: c.itemName,
            quantity: c.quantity,
          })) || [],
        },
      },
      include: { components: true },
    });
    res.json(kit);
  } catch {
    res.status(500).json({ message: 'Erro ao atualizar kit.' });
  }
});

// DELETE /api/kits/:id
kitsRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.epiKit.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Erro ao excluir kit.' });
  }
});
