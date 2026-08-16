import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireAdmin, requireAdminOrController } from '../middleware/auth.js';

export const kitsRouter = Router();
kitsRouter.use(authenticate);

function parseQty(c: any): number {
  const val = c.quantity ?? c.requiredQuantity;
  if (val === undefined || val === null) return 1;
  const num = parseInt(String(val), 10);
  return isNaN(num) || num < 1 ? 1 : num;
}

// GET /api/kits
kitsRouter.get('/', async (_req, res) => {
  try {
    const kits = await prisma.epiKit.findMany({
      include: { components: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(kits);
  } catch (e) {
    console.error('Error listing kits:', e);
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
        name: String(name).trim(),
        description: description ? String(description).trim() : '',
        type: type || 'EPI_EPC',
        imageUrl: imageUrl || '',
        components: {
          create: components.map((c: any) => ({
            itemId: String(c.itemId || ''),
            itemName: String(c.itemName || 'Item'),
            quantity: parseQty(c),
          })),
        },
      },
      include: { components: true },
    });
    res.json(kit);
  } catch (e) {
    console.error('Error creating kit:', e);
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
        name: String(name).trim(),
        description: description ? String(description).trim() : '',
        type,
        imageUrl: imageUrl || '',
        components: {
          create: components?.map((c: any) => ({
            itemId: String(c.itemId || ''),
            itemName: String(c.itemName || 'Item'),
            quantity: parseQty(c),
          })) || [],
        },
      },
      include: { components: true },
    });
    res.json(kit);
  } catch (e) {
    console.error('Error updating kit:', e);
    res.status(500).json({ message: 'Erro ao atualizar kit.' });
  }
});

// DELETE /api/kits/:id
kitsRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.epiKit.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    console.error('Error deleting kit:', e);
    res.status(500).json({ message: 'Erro ao excluir kit.' });
  }
});
