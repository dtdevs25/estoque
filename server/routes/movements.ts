import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireAdminOrController, AuthRequest } from '../middleware/auth.js';
import { sendLowStockAlert } from '../lib/email.js';

export const movementsRouter = Router();
movementsRouter.use(authenticate);

// Helper to resolve real item or auto-create item for a location from catalog
async function getOrCreateItemForLocation(itemId: string, targetLocationId?: string) {
  if (itemId.startsWith('virtual-')) {
    const parts = itemId.split('-');
    // format: virtual-<realItemId>-<locationId>
    const locationId = targetLocationId || parts[parts.length - 1];
    const realItemId = parts[1];

    const sourceItem = await prisma.epiItem.findUnique({ where: { id: realItemId } });
    if (sourceItem && locationId) {
      let existing = await prisma.epiItem.findFirst({
        where: { name: sourceItem.name, locationId },
      });

      if (!existing) {
        existing = await prisma.epiItem.create({
          data: {
            name: sourceItem.name,
            type: sourceItem.type,
            caNumber: sourceItem.caNumber,
            caExpiry: sourceItem.caExpiry,
            brand: sourceItem.brand,
            category: sourceItem.category,
            protectionCategory: sourceItem.protectionCategory,
            unit: sourceItem.unit,
            quantity: 0,
            minQuantity: sourceItem.minQuantity,
            imageUrl: sourceItem.imageUrl,
            description: sourceItem.description,
            locationId,
          },
        });
      }
      return existing;
    }
  }

  return await prisma.epiItem.findUnique({ where: { id: itemId }, include: { location: true } });
}

async function checkLowStock(itemId: string) {
  const item = await prisma.epiItem.findUnique({
    where: { id: itemId },
    include: { location: true },
  });
  if (item && item.quantity <= item.minQuantity && item.minQuantity > 0) {
    await sendLowStockAlert(item.name, item.location.name, item.quantity, item.minQuantity);
  }
}

// GET /api/movements
movementsRouter.get('/', async (req, res) => {
  try {
    const { locationId, itemId, limit } = req.query;
    const movements = await prisma.stockMovement.findMany({
      where: {
        ...(locationId && locationId !== 'ALL' ? { locationId: String(locationId) } : {}),
        ...(itemId ? { itemId: String(itemId) } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(String(limit)) : 500,
    });
    res.json(movements.map(m => ({ ...m, timestamp: m.createdAt.toISOString() })));
  } catch {
    res.status(500).json({ message: 'Erro ao listar movimentações.' });
  }
});

// POST /api/movements/entry
movementsRouter.post('/entry', requireAdminOrController, async (req: AuthRequest, res) => {
  try {
    const { itemId, quantity, reason, employeeName, employeeRole, employeeRegistration, notes } = req.body;
    if (!itemId || !quantity || quantity <= 0) {
      res.status(400).json({ message: 'Item e quantidade são obrigatórios.' });
      return;
    }

    const item = await getOrCreateItemForLocation(itemId);
    if (!item) { res.status(404).json({ message: 'Item não encontrado.' }); return; }

    const location = await prisma.location.findUnique({ where: { id: item.locationId } });
    const prev = item.quantity;
    const newQty = prev + quantity;

    const [updated, movement] = await prisma.$transaction([
      prisma.epiItem.update({ where: { id: item.id }, data: { quantity: newQty } }),
      prisma.stockMovement.create({
        data: {
          type: 'ENTRADA', quantity, previousQuantity: prev, newQuantity: newQty,
          itemId: item.id, itemName: item.name,
          locationId: item.locationId, locationName: location?.name || item.locationId,
          employeeName, employeeRole, employeeRegistration, reason, notes,
          userId: req.user!.id,
        },
      }),
    ]);

    res.json({ item: updated, movement: { ...movement, timestamp: movement.createdAt.toISOString() } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erro ao registrar entrada.' });
  }
});

// POST /api/movements/exit
movementsRouter.post('/exit', requireAdminOrController, async (req: AuthRequest, res) => {
  try {
    const { itemId, quantity, reason, employeeName, employeeRole, employeeRegistration, notes } = req.body;
    const item = await getOrCreateItemForLocation(itemId);
    if (!item) { res.status(404).json({ message: 'Item não encontrado.' }); return; }
    if (item.quantity < quantity) {
      res.status(400).json({ message: 'Saldo insuficiente.' });
      return;
    }

    const location = await prisma.location.findUnique({ where: { id: item.locationId } });
    const prev = item.quantity;
    const newQty = prev - quantity;

    const [updated, movement] = await prisma.$transaction([
      prisma.epiItem.update({ where: { id: item.id }, data: { quantity: newQty } }),
      prisma.stockMovement.create({
        data: {
          type: 'SAIDA', quantity, previousQuantity: prev, newQuantity: newQty,
          itemId: item.id, itemName: item.name,
          locationId: item.locationId, locationName: location?.name || item.locationId,
          employeeName, employeeRole, employeeRegistration, reason, notes,
          userId: req.user!.id,
        },
      }),
    ]);

    await checkLowStock(item.id);
    res.json({ item: updated, movement: { ...movement, timestamp: movement.createdAt.toISOString() } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erro ao registrar saída.' });
  }
});

// POST /api/movements/batch
movementsRouter.post('/batch', requireAdminOrController, async (req: AuthRequest, res) => {
  try {
    const { locationId, entries, reason, employeeName, employeeRole, employeeRegistration, isDailyClosing, notes } = req.body;
    let fallbackLocationName = 'Almoxarifado Geral';
    
    if (locationId && locationId !== 'ALL') {
      const location = await prisma.location.findUnique({ where: { id: locationId } });
      if (location) fallbackLocationName = location.name;
    }

    const results = [];
    for (const entry of entries) {
      const targetLoc = (locationId && locationId !== 'ALL') ? locationId : undefined;
      const item = await getOrCreateItemForLocation(entry.itemId, targetLoc);
      if (!item || entry.quantity <= 0) continue;

      const mType: 'ENTRADA' | 'SAIDA' = entry.type === 'ENTRADA' ? 'ENTRADA' : 'SAIDA';
      const prev = item.quantity;
      const newQty = mType === 'ENTRADA' ? prev + entry.quantity : prev - entry.quantity;
      if (mType === 'SAIDA' && newQty < 0) continue;

      const itemLoc = item.locationId ? await prisma.location.findUnique({ where: { id: item.locationId } }) : null;
      const locName = itemLoc?.name || fallbackLocationName;

      const [updated, movement] = await prisma.$transaction([
        prisma.epiItem.update({ where: { id: item.id }, data: { quantity: newQty } }),
        prisma.stockMovement.create({
          data: {
            type: mType, 
            quantity: entry.quantity, 
            previousQuantity: prev, 
            newQuantity: newQty,
            itemId: item.id, 
            itemName: item.name,
            locationId: item.locationId || locationId || 'ALL', 
            locationName: locName,
            employeeName, 
            employeeRole, 
            employeeRegistration,
            reason: isDailyClosing ? `Baixa Diária: ${reason}` : reason,
            notes: entry.notes || notes, 
            userId: req.user!.id,
          },
        }),
      ]);
      await checkLowStock(item.id);
      results.push({ item: updated, movement });
    }

    res.json({ count: results.length, results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erro ao processar baixa em lote.' });
  }
});

// POST /api/movements/transfer
movementsRouter.post('/transfer', requireAdminOrController, async (req: AuthRequest, res) => {
  try {
    const { sourceItemId, targetLocationId, quantity, reason, notes } = req.body;
    const sourceItem = await getOrCreateItemForLocation(sourceItemId);
    if (!sourceItem) { res.status(404).json({ message: 'Item de origem não encontrado.' }); return; }
    if (sourceItem.locationId === targetLocationId) {
      res.status(400).json({ message: 'Origem e destino são iguais.' });
      return;
    }
    if (sourceItem.quantity < quantity) {
      res.status(400).json({ message: 'Saldo insuficiente para transferência.' });
      return;
    }

    const sourceLocation = await prisma.location.findUnique({ where: { id: sourceItem.locationId } });
    const targetLocation = await prisma.location.findUnique({ where: { id: targetLocationId } });
    if (!targetLocation) { res.status(404).json({ message: 'Localidade de destino não encontrada.' }); return; }

    const prevSrc = sourceItem.quantity;
    const newSrc = prevSrc - quantity;

    let targetItem = await prisma.epiItem.findFirst({
      where: { locationId: targetLocationId, name: sourceItem.name },
    });

    if (!targetItem) {
      targetItem = await prisma.epiItem.create({
        data: {
          name: sourceItem.name, type: sourceItem.type, caNumber: sourceItem.caNumber,
          caExpiry: sourceItem.caExpiry, brand: sourceItem.brand, category: sourceItem.category,
          protectionCategory: sourceItem.protectionCategory, unit: sourceItem.unit,
          quantity: 0, minQuantity: sourceItem.minQuantity, imageUrl: sourceItem.imageUrl,
          description: sourceItem.description, locationId: targetLocationId,
        },
      });
    }

    const prevTarget = targetItem.quantity;
    const newTarget = prevTarget + quantity;

    await prisma.$transaction(async (tx) => {
      await tx.epiItem.update({ where: { id: sourceItem.id }, data: { quantity: newSrc } });
      await tx.epiItem.update({ where: { id: targetItem.id }, data: { quantity: newTarget } });

      await tx.stockMovement.createMany({
        data: [
          {
            type: 'TRANSFERENCIA_SAIDA', quantity, previousQuantity: prevSrc, newQuantity: newSrc,
            itemId: sourceItem.id, itemName: sourceItem.name,
            locationId: sourceItem.locationId, locationName: sourceLocation?.name || sourceItem.locationId,
            reason, notes, userId: req.user!.id,
          },
          {
            type: 'TRANSFERENCIA_ENTRADA', quantity, previousQuantity: prevTarget, newQuantity: newTarget,
            itemId: targetItem.id, itemName: targetItem.name,
            locationId: targetLocationId, locationName: targetLocation.name,
            reason, notes, userId: req.user!.id,
          },
        ],
      });
    });

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erro ao realizar transferência.' });
  }
});

// POST /api/movements/deliver-kit
movementsRouter.post('/deliver-kit', requireAdminOrController, async (req: AuthRequest, res) => {
  try {
    const { kitId, locationId, quantityOfKits, employeeName, employeeRole, employeeRegistration, notes } = req.body;
    const kit = await prisma.epiKit.findUnique({ where: { id: kitId }, include: { components: true } });
    const location = await prisma.location.findUnique({ where: { id: locationId } });
    if (!kit || !location) {
      res.status(404).json({ message: 'Kit ou localidade não encontrado.' });
      return;
    }

    // Validate availability
    for (const comp of kit.components) {
      const item = await getOrCreateItemForLocation(comp.itemId, locationId);
      if (!item || item.quantity < comp.quantity * quantityOfKits) {
        res.status(400).json({ message: `Saldo insuficiente para: ${comp.itemName}` });
        return;
      }
    }

    // Deduct
    await prisma.$transaction(async (tx) => {
      for (const comp of kit.components) {
        const item = await getOrCreateItemForLocation(comp.itemId, locationId);
        if (!item) continue;
        const deduct = comp.quantity * quantityOfKits;
        const prev = item.quantity;
        const newQty = prev - deduct;
        await tx.epiItem.update({ where: { id: item.id }, data: { quantity: newQty } });
        await tx.stockMovement.create({
          data: {
            type: 'ENTREGA_KIT', quantity: deduct, previousQuantity: prev, newQuantity: newQty,
            itemId: item.id, itemName: item.name,
            locationId, locationName: location.name,
            employeeName, employeeRole, employeeRegistration,
            reason: `Entrega de Kit: ${kit.name} (${quantityOfKits}x)`,
            notes, userId: req.user!.id,
          },
        });
      }
    });

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erro ao entregar kit.' });
  }
});
