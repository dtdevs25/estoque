import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireAdmin, requireAdminOrController } from '../middleware/auth.js';

export const itemsRouter = Router();
itemsRouter.use(authenticate);

// GET /api/items
itemsRouter.get('/', async (_req, res) => {
  try {
    const items = await prisma.epiItem.findMany({
      include: { stocks: true },
      orderBy: { name: 'asc' }
    });
    res.json(items);
  } catch {
    res.status(500).json({ message: 'Erro ao listar itens.' });
  }
});

// GET /api/items/:id
itemsRouter.get('/:id', async (req, res) => {
  try {
    const item = await prisma.epiItem.findUnique({
      where: { id: req.params.id },
      include: { stocks: true }
    });
    if (!item) { res.status(404).json({ message: 'Item não encontrado.' }); return; }
    res.json(item);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar item.' });
  }
});

// POST /api/items
itemsRouter.post('/', requireAdminOrController, async (req, res) => {
  try {
    const { name, type, caNumber, caExpiry, brand, category, protectionCategory, unit, imageUrl, description, stocks } = req.body;
    if (!name || !category || !unit) {
      res.status(400).json({ message: 'Nome, categoria e unidade são obrigatórios.' });
      return;
    }

    const item = await prisma.epiItem.create({
      data: { name, type: type || 'EPI', caNumber, caExpiry, brand, category, protectionCategory, unit, imageUrl, description },
    });

    if (stocks && Array.isArray(stocks)) {
      for (const stock of stocks) {
        if (stock.locationId) {
          const qty = Number(stock.quantity) || 0;
          await prisma.itemStock.create({
            data: {
              itemId: item.id,
              locationId: stock.locationId,
              quantity: qty,
              minQuantity: Number(stock.minQuantity) || 0
            }
          });

          if (qty > 0) {
            const location = await prisma.location.findUnique({ where: { id: stock.locationId } });
            await prisma.stockMovement.create({
              data: {
                type: 'INICIAL',
                quantity: qty,
                previousQuantity: 0,
                newQuantity: qty,
                itemId: item.id,
                itemName: item.name,
                locationId: stock.locationId,
                locationName: location?.name || stock.locationId,
                reason: 'Cadastro inicial do item',
              },
            });
          }
        }
      }
    }

    const itemWithStocks = await prisma.epiItem.findUnique({ where: { id: item.id }, include: { stocks: true }});
    res.status(201).json(itemWithStocks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erro ao criar item.' });
  }
});

// PUT /api/items/:id
itemsRouter.put('/:id', requireAdminOrController, async (req, res) => {
  try {
    const { name, type, caNumber, caExpiry, brand, category, protectionCategory, unit, imageUrl, description, stocks } = req.body;
    const itemId = req.params.id;

    const updated = await prisma.epiItem.update({
      where: { id: itemId },
      data: { name, type, caNumber, caExpiry, brand, category, protectionCategory, unit, imageUrl, description },
    });

    if (stocks && Array.isArray(stocks)) {
      for (const stock of stocks) {
        if (stock.locationId) {
          await prisma.itemStock.upsert({
            where: {
              itemId_locationId: {
                itemId: itemId,
                locationId: stock.locationId
              }
            },
            update: {
              minQuantity: Number(stock.minQuantity) || 0
              // we don't update quantity directly via PUT to avoid bypassing stock movements
            },
            create: {
              itemId: itemId,
              locationId: stock.locationId,
              quantity: 0, // must use movements to add quantity
              minQuantity: Number(stock.minQuantity) || 0
            }
          });
        }
      }
    }

    const itemWithStocks = await prisma.epiItem.findUnique({ where: { id: itemId }, include: { stocks: true }});
    res.json(itemWithStocks);
  } catch (e) {
    console.error('Error updating item:', e);
    res.status(500).json({ message: 'Erro ao atualizar item.' });
  }
});

// DELETE /api/items/:id
itemsRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const itemId = req.params.id;
    await prisma.stockMovement.deleteMany({ where: { itemId } });
    await prisma.itemStock.deleteMany({ where: { itemId }});
    await prisma.epiItem.delete({ where: { id: itemId } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Erro ao excluir item.' });
  }
});
