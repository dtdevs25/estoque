import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireAdmin, requireAdminOrController } from '../middleware/auth.js';

export const itemsRouter = Router();
itemsRouter.use(authenticate);

// GET /api/items
itemsRouter.get('/', async (_req, res) => {
  try {
    const items = await prisma.epiItem.findMany({ orderBy: { name: 'asc' } });
    res.json(items);
  } catch {
    res.status(500).json({ message: 'Erro ao listar itens.' });
  }
});

// GET /api/items/:id
itemsRouter.get('/:id', async (req, res) => {
  try {
    const item = await prisma.epiItem.findUnique({ where: { id: req.params.id } });
    if (!item) { res.status(404).json({ message: 'Item não encontrado.' }); return; }
    res.json(item);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar item.' });
  }
});

// POST /api/items
itemsRouter.post('/', requireAdminOrController, async (req, res) => {
  try {
    const { name, type, caNumber, caExpiry, brand, category, protectionCategory, unit, quantity, minQuantity, imageUrl, description, locationId } = req.body;
    if (!name || !category || !unit || !locationId) {
      res.status(400).json({ message: 'Nome, categoria, unidade e localidade são obrigatórios.' });
      return;
    }

    const item = await prisma.epiItem.create({
      data: { name, type: type || 'EPI', caNumber, caExpiry, brand, category, protectionCategory, unit, quantity: quantity || 0, minQuantity: minQuantity || 0, imageUrl, description, locationId },
    });

    // Initial movement if quantity > 0
    if (quantity > 0) {
      const location = await prisma.location.findUnique({ where: { id: locationId } });
      await prisma.stockMovement.create({
        data: {
          type: 'INICIAL',
          quantity: quantity,
          previousQuantity: 0,
          newQuantity: quantity,
          itemId: item.id,
          itemName: item.name,
          locationId,
          locationName: location?.name || locationId,
          reason: 'Cadastro inicial do item',
        },
      });
    }

    res.status(201).json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erro ao criar item.' });
  }
});

// PUT /api/items/:id
itemsRouter.put('/:id', requireAdminOrController, async (req, res) => {
  try {
    const { name, type, caNumber, caExpiry, brand, category, protectionCategory, unit, minQuantity, imageUrl, description, locationId } = req.body;
    const item = await prisma.epiItem.update({
      where: { id: req.params.id },
      data: { name, type, caNumber, caExpiry, brand, category, protectionCategory, unit, minQuantity, imageUrl, description, locationId },
    });
    res.json(item);
  } catch {
    res.status(500).json({ message: 'Erro ao atualizar item.' });
  }
});

// DELETE /api/items/:id
itemsRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.stockMovement.deleteMany({ where: { itemId: req.params.id } });
    await prisma.epiItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Erro ao excluir item.' });
  }
});
