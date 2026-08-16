import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireAdminOrController, AuthRequest } from '../middleware/auth.js';
import { sendLowStockAlert } from '../lib/email.js';

export const movementsRouter = Router();
movementsRouter.use(authenticate);

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

async function checkLowStock(itemId: string) {
  const item = await prisma.epiItem.findUnique({
    where: { id: itemId },
    include: { location: true },
  });
  if (item && item.quantity <= item.minQuantity && item.minQuantity > 0) {
    await sendLowStockAlert(item.name, item.location.name, item.quantity, item.minQuantity);
  }
}

// POST /api/movements/entry
movementsRouter.post('/entry', requireAdminOrController, async (req: AuthRequest, res) => {
  try {
    const { itemId, quantity, reason, employeeName, employeeRole, employeeRegistration, notes } = req.body;
    if (!itemId || !quantity || quantity <= 0) {
      res.status(400).json({ message: 'Item e quantidade são obrigatórios.' });
      return;
    }

    const item = await prisma.epiItem.findUnique({ where: { id: itemId }, include: { location: true } });
    if (!item) { res.status(404).json({ message: 'Item não encontrado.' }); return; }

    const prev = item.quantity;
    const newQty = prev + quantity;

    const [updated, movement] = await prisma.$transaction([
      prisma.epiItem.update({ where: { id: itemId }, data: { quantity: newQty } }),
      prisma.stockMovement.create({
        data: {
          type: 'ENTRADA', quantity, previousQuantity: prev, newQuantity: newQty,
          itemId, itemName: item.name,
          locationId: item.locationId, locationName: item.location.name,
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
    const item = await prisma.epiItem.findUnique({ where: { id: itemId }, include: { location: true } });
    if (!item) { res.status(404).json({ message: 'Item não encontrado.' }); return; }
    if (item.quantity < quantity) {
      res.status(400).json({ message: 'Saldo insuficiente.' });
      return;
    }

    const prev = item.quantity;
    const newQty = prev - quantity;

    const [updated, movement] = await prisma.$transaction([
      prisma.epiItem.update({ where: { id: itemId }, data: { quantity: newQty } }),
      prisma.stockMovement.create({
        data: {
          type: 'SAIDA', quantity, previousQuantity: prev, newQuantity: newQty,
          itemId, itemName: item.name,
          locationId: item.locationId, locationName: item.location.name,
          employeeName, employeeRole, employeeRegistration, reason, notes,
          userId: req.user!.id,
        },
      }),
    ]);

    await checkLowStock(itemId);
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
    const location = await prisma.location.findUnique({ where: { id: locationId } });
    if (!location) { res.status(404).json({ message: 'Localidade não encontrada.' }); return; }

    const results = [];
    for (const entry of entries) {
      const item = await prisma.epiItem.findFirst({
        where: { id: entry.itemId, locationId },
      });
      if (!item || entry.quantity <= 0) continue;

      const prev = item.quantity;
      const newQty = prev - entry.quantity;
      if (newQty < 0) continue;

      const [updated, movement] = await prisma.$transaction([
        prisma.epiItem.update({ where: { id: item.id }, data: { quantity: newQty } }),
        prisma.stockMovement.create({
          data: {
            type: 'SAIDA', quantity: entry.quantity, previousQuantity: prev, newQuantity: newQty,
            itemId: item.id, itemName: item.name,
            locationId, locationName: location.name,
            employeeName, employeeRole, employeeRegistration,
            reason: isDailyClosing ? `Baixa Diária: ${reason}` : reason,
            notes, userId: req.user!.id,
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
    const sourceItem = await prisma.epiItem.findUnique({ where: { id: sourceItemId }, include: { location: true } });
    if (!sourceItem) { res.status(404).json({ message: 'Item de origem não encontrado.' }); return; }
    if (sourceItem.locationId === targetLocationId) {
      res.status(400).json({ message: 'Origem e destino são iguais.' });
      return;
    }
    if (sourceItem.quantity < quantity) {
      res.status(400).json({ message: 'Saldo insuficiente para transferência.' });
      return;
    }

    const targetLocation = await prisma.location.findUnique({ where: { id: targetLocationId } });
    if (!targetLocation) { res.status(404).json({ message: 'Localidade de destino não encontrada.' }); return; }

    const prevSrc = sourceItem.quantity;
    const newSrc = prevSrc - quantity;

    // Find or create matching item at target
    let targetItem = await prisma.epiItem.findFirst({
      where: { locationId: targetLocationId, name: sourceItem.name },
    });

    const prevTarget = targetItem?.quantity || 0;
    const newTarget = prevTarget + quantity;

    await prisma.$transaction(async (tx) => {
      await tx.epiItem.update({ where: { id: sourceItemId }, data: { quantity: newSrc } });

      if (targetItem) {
        await tx.epiItem.update({ where: { id: targetItem.id }, data: { quantity: newTarget } });
      } else {
        targetItem = await tx.epiItem.create({
          data: { ...sourceItem, id: undefined as any, quantity: newTarget, locationId: targetLocationId, createdAt: undefined as any, updatedAt: undefined as any },
        });
      }

      await tx.stockMovement.createMany({
        data: [
          {
            type: 'TRANSFERENCIA_SAIDA', quantity, previousQuantity: prevSrc, newQuantity: newSrc,
            itemId: sourceItemId, itemName: sourceItem.name,
            locationId: sourceItem.locationId, locationName: sourceItem.location.name,
            reason, notes, userId: req.user!.id,
          },
          {
            type: 'TRANSFERENCIA_ENTRADA', quantity, previousQuantity: prevTarget, newQuantity: newTarget,
            itemId: targetItem!.id, itemName: targetItem!.name,
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
      const item = await prisma.epiItem.findFirst({ where: { id: comp.itemId, locationId } });
      if (!item || item.quantity < comp.quantity * quantityOfKits) {
        res.status(400).json({ message: `Saldo insuficiente para: ${comp.itemName}` });
        return;
      }
    }

    // Deduct
    await prisma.$transaction(async (tx) => {
      for (const comp of kit.components) {
        const item = await tx.epiItem.findFirst({ where: { id: comp.itemId, locationId } });
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
