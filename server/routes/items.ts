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
    const { name, type, caNumber, caExpiry, brand, category, protectionCategory, unit, quantity, minQuantity, imageUrl, description, locationId } = req.body;
    let itemId = req.params.id;

    if (itemId.startsWith('virtual-')) {
      const parts = itemId.split('-');
      const realItemId = parts[1];
      const locId = locationId || parts[parts.length - 1];

      const sourceItem = await prisma.epiItem.findUnique({ where: { id: realItemId } });
      if (sourceItem) {
        let existing = await prisma.epiItem.findFirst({
          where: { name: sourceItem.name, locationId: locId },
        });

        if (!existing) {
          existing = await prisma.epiItem.create({
            data: {
              name: name || sourceItem.name,
              type: type || sourceItem.type,
              caNumber: caNumber || sourceItem.caNumber,
              caExpiry: caExpiry || sourceItem.caExpiry,
              brand: brand || sourceItem.brand,
              category: category || sourceItem.category,
              protectionCategory: protectionCategory || sourceItem.protectionCategory,
              unit: unit || sourceItem.unit,
              quantity: quantity !== undefined ? Number(quantity) : 0,
              minQuantity: minQuantity !== undefined ? Number(minQuantity) : sourceItem.minQuantity,
              imageUrl: imageUrl || sourceItem.imageUrl,
              description: description || sourceItem.description,
              locationId: locId,
            },
          });
        }
        itemId = existing.id;
      }
    }

    // Find current item
    const currentItem = await prisma.epiItem.findUnique({ where: { id: itemId } });
    if (!currentItem) {
      res.status(404).json({ message: 'Item não encontrado.' });
      return;
    }

    // If quantity is updated, track stock movement if changed
    if (quantity !== undefined && Number(quantity) !== currentItem.quantity) {
      const diff = Number(quantity) - currentItem.quantity;
      const movType = diff > 0 ? 'ENTRADA' : 'SAIDA';
      const absDiff = Math.abs(diff);
      const location = await prisma.location.findUnique({ where: { id: currentItem.locationId } });

      await prisma.stockMovement.create({
        data: {
          type: movType,
          quantity: absDiff,
          previousQuantity: currentItem.quantity,
          newQuantity: Number(quantity),
          itemId: currentItem.id,
          itemName: name || currentItem.name,
          locationId: currentItem.locationId,
          locationName: location?.name || currentItem.locationId,
          reason: 'Ajuste manual de estoque via edição de item',
        },
      });
    }

    // Synchronize catalog metadata across all locations with the same item name
    if (name || caNumber || brand || category || unit || imageUrl || description) {
      await prisma.epiItem.updateMany({
        where: { name: currentItem.name },
        data: {
          ...(name ? { name } : {}),
          ...(type ? { type } : {}),
          ...(caNumber ? { caNumber } : {}),
          ...(caExpiry ? { caExpiry } : {}),
          ...(brand ? { brand } : {}),
          ...(category ? { category } : {}),
          ...(protectionCategory ? { protectionCategory } : {}),
          ...(unit ? { unit } : {}),
          ...(minQuantity !== undefined ? { minQuantity: Number(minQuantity) } : {}),
          ...(imageUrl ? { imageUrl } : {}),
          ...(description ? { description } : {}),
        },
      });
    }

    // Update quantity & location for this specific item record
    const updated = await prisma.epiItem.update({
      where: { id: itemId },
      data: {
        ...(quantity !== undefined ? { quantity: Number(quantity) } : {}),
        ...(locationId ? { locationId } : {}),
      },
    });

    res.json(updated);
  } catch (e) {
    console.error('Error updating item:', e);
    res.status(500).json({ message: 'Erro ao atualizar item.' });
  }
});

// DELETE /api/items/:id
itemsRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    let itemId = req.params.id;
    if (itemId.startsWith('virtual-')) {
      const parts = itemId.split('-');
      const realItemId = parts[1];
      const locId = parts[parts.length - 1];
      const sourceItem = await prisma.epiItem.findUnique({ where: { id: realItemId } });
      if (sourceItem) {
        const existing = await prisma.epiItem.findFirst({ where: { name: sourceItem.name, locationId: locId } });
        if (existing) itemId = existing.id;
        else { res.json({ success: true }); return; }
      }
    }

    await prisma.stockMovement.deleteMany({ where: { itemId } });
    await prisma.epiItem.delete({ where: { id: itemId } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Erro ao excluir item.' });
  }
});
