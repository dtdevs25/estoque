import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

export const movementsRouter = Router();
movementsRouter.use(authenticate);

// Helper to get or create ItemStock for a location
async function getOrCreateItemStock(tx: any, itemId: string, locationId: string) {
  const stock = await tx.itemStock.findUnique({
    where: { itemId_locationId: { itemId, locationId } }
  });
  if (stock) return stock;
  
  const newItemStock = await tx.itemStock.create({
    data: {
      itemId,
      locationId,
      quantity: 0,
      minQuantity: 0
    }
  });
  return newItemStock;
}

// GET /api/movements
movementsRouter.get('/', async (_req, res) => {
  try {
    const movs = await prisma.stockMovement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1500,
    });
    res.json(movs);
  } catch {
    res.status(500).json({ message: 'Erro ao listar movimentações.' });
  }
});

// POST /api/movements/single
movementsRouter.post('/single', async (req, res) => {
  try {
    const { itemId, type, quantity, reason, employeeName, employeeRole, employeeRegistration, notes } = req.body;
    
    // Determine location from context of stock? Wait, req body must have locationId if not provided.
    // Actually, in the frontend, itemId is passed, and we need the locationId where the movement happens.
    // If the frontend didn't pass locationId, we might need to get it. 
    // Wait, the frontend might just pass itemId. In the new UI, they will pass locationId because itemId is generic.
    const { locationId } = req.body;

    if (!locationId) {
      return res.status(400).json({ message: 'Obrigatório informar a localidade (locationId).' });
    }

    const qty = Number(quantity);
    if (qty <= 0) return res.status(400).json({ message: 'Quantidade deve ser maior que zero.' });

    await prisma.$transaction(async (tx) => {
      const item = await tx.epiItem.findUnique({ where: { id: itemId } });
      if (!item) throw new Error('Item não encontrado.');
      const location = await tx.location.findUnique({ where: { id: locationId } });
      if (!location) throw new Error('Localidade não encontrada.');

      const stock = await getOrCreateItemStock(tx, itemId, locationId);
      const prev = stock.quantity;
      let newQty = prev;

      if (type === 'SAIDA') {
        if (prev < qty) throw new Error(`Saldo insuficiente. Saldo atual: ${prev}`);
        newQty = prev - qty;
      } else if (type === 'ENTRADA') {
        newQty = prev + qty;
      }

      await tx.itemStock.update({ where: { id: stock.id }, data: { quantity: newQty } });

      await tx.stockMovement.create({
        data: {
          type, quantity: qty, previousQuantity: prev, newQuantity: newQty,
          itemId: item.id, itemName: item.name, locationId, locationName: location.name,
          employeeName, employeeRole, employeeRegistration, reason, notes,
          userId: req.user!.id,
        },
      });
    });

    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Erro ao registrar movimentação.' });
  }
});

// POST /api/movements/batch
movementsRouter.post('/batch', async (req, res) => {
  try {
    const { locationId, entries, reason, employeeName, employeeRole, employeeRegistration, isDailyClosing, notes, customDate } = req.body;
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: 'Lote vazio.' });
    }

    let count = 0;
    await prisma.$transaction(async (tx) => {
      const location = await tx.location.findUnique({ where: { id: locationId } });
      if (!location) throw new Error('Localidade não encontrada.');

      for (const entry of entries) {
        const item = await tx.epiItem.findUnique({ where: { id: entry.itemId } });
        if (!item) continue;

        const stock = await getOrCreateItemStock(tx, item.id, locationId);
        
        const type = entry.type;
        const eQty = Number(entry.quantity);
        let qtyToMove = eQty;
        const prev = stock.quantity;
        let newQty = prev;

        if (type === 'AJUSTE') {
          newQty = Number(entry.newQuantity);
          qtyToMove = Math.abs(newQty - prev);
          if (qtyToMove === 0) continue; 
        } else if (type === 'SAIDA') {
          if (prev < eQty) throw new Error(`Saldo insuficiente para "${item.name}".`);
          newQty = prev - eQty;
        } else if (type === 'ENTRADA') {
          newQty = prev + eQty;
        }

        await tx.itemStock.update({ where: { id: stock.id }, data: { quantity: newQty } });

        const createdAt = customDate ? new Date(customDate) : new Date();

        await tx.stockMovement.create({
          data: {
            type, quantity: qtyToMove, previousQuantity: prev, newQuantity: newQty,
            itemId: item.id, itemName: item.name, locationId, locationName: location.name,
            employeeName, employeeRole, employeeRegistration, reason,
            notes: entry.notes || notes, userId: req.user!.id,
            createdAt
          },
        });
        count++;
      }
    });

    res.json({ success: true, count });
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Erro ao registrar lote.' });
  }
});

// POST /api/movements/transfer
movementsRouter.post('/transfer', async (req, res) => {
  try {
    const { sourceItemId, targetLocationId, quantity, reason, employeeName, notes } = req.body;
    const qty = Number(quantity);
    if (qty <= 0) return res.status(400).json({ message: 'Quantidade inválida.' });
    
    // We expect the frontend to pass the source location ID along with the source item ID
    const { sourceLocationId } = req.body;
    if (!sourceLocationId) return res.status(400).json({ message: 'Obrigatório informar sourceLocationId.' });

    await prisma.$transaction(async (tx) => {
      const item = await tx.epiItem.findUnique({ where: { id: sourceItemId } });
      if (!item) throw new Error('Item origem não encontrado.');

      const sourceStock = await getOrCreateItemStock(tx, sourceItemId, sourceLocationId);
      const targetStock = await getOrCreateItemStock(tx, sourceItemId, targetLocationId);
      
      const sourceLocation = await tx.location.findUnique({ where: { id: sourceLocationId } });
      const targetLocation = await tx.location.findUnique({ where: { id: targetLocationId } });

      if (sourceStock.quantity < qty) throw new Error('Saldo insuficiente na origem.');

      // Saída Origem
      const srcPrev = sourceStock.quantity;
      const srcNew = srcPrev - qty;
      await tx.itemStock.update({ where: { id: sourceStock.id }, data: { quantity: srcNew } });
      await tx.stockMovement.create({
        data: {
          type: 'TRANSFERENCIA_SAIDA', quantity: qty, previousQuantity: srcPrev, newQuantity: srcNew,
          itemId: item.id, itemName: item.name, locationId: sourceLocationId, locationName: sourceLocation!.name,
          employeeName, reason: `Transferência para ${targetLocation!.name}`, notes, userId: req.user!.id,
        },
      });

      // Entrada Destino
      const tgtPrev = targetStock.quantity;
      const tgtNew = tgtPrev + qty;
      await tx.itemStock.update({ where: { id: targetStock.id }, data: { quantity: tgtNew } });
      await tx.stockMovement.create({
        data: {
          type: 'TRANSFERENCIA_ENTRADA', quantity: qty, previousQuantity: tgtPrev, newQuantity: tgtNew,
          itemId: item.id, itemName: item.name, locationId: targetLocationId, locationName: targetLocation!.name,
          employeeName, reason: `Transferência de ${sourceLocation!.name}`, notes, userId: req.user!.id,
        },
      });
    });

    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Erro na transferência.' });
  }
});

// POST /api/movements/adjust
movementsRouter.post('/adjust', async (req, res) => {
  try {
    const { itemId, locationId, newQuantity, reason, notes } = req.body;
    if (newQuantity < 0) return res.status(400).json({ message: 'Quantidade inválida.' });

    await prisma.$transaction(async (tx) => {
      const item = await tx.epiItem.findUnique({ where: { id: itemId } });
      if (!item) throw new Error('Item não encontrado.');
      const location = await tx.location.findUnique({ where: { id: locationId } });
      
      const stock = await getOrCreateItemStock(tx, itemId, locationId);
      const prev = stock.quantity;
      const diff = Math.abs(newQuantity - prev);
      if (diff === 0) return;

      await tx.itemStock.update({ where: { id: stock.id }, data: { quantity: newQuantity } });
      await tx.stockMovement.create({
        data: {
          type: 'AJUSTE', quantity: diff, previousQuantity: prev, newQuantity,
          itemId: item.id, itemName: item.name, locationId, locationName: location!.name,
          reason, notes, userId: req.user!.id,
        },
      });
    });
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Erro no ajuste.' });
  }
});

// POST /api/movements/deliver-kit
movementsRouter.post('/deliver-kit', async (req, res) => {
  try {
    const { kitId, locationId, quantityOfKits, employeeName, employeeRole, employeeRegistration, notes } = req.body;

    await prisma.$transaction(async (tx) => {
      const kit = await tx.epiKit.findUnique({
        where: { id: kitId },
        include: { components: true },
      });
      if (!kit) throw new Error('Kit não encontrado.');
      const location = await tx.location.findUnique({ where: { id: locationId } });

      for (const comp of kit.components) {
        const item = await tx.epiItem.findUnique({ where: { id: comp.itemId } });
        if (!item) continue;
        
        const stock = await getOrCreateItemStock(tx, comp.itemId, locationId);
        
        const deduct = comp.quantity * quantityOfKits;
        const prev = stock.quantity;
        const newQty = prev - deduct;
        
        await tx.itemStock.update({ where: { id: stock.id }, data: { quantity: newQty } });
        
        await tx.stockMovement.create({
          data: {
            type: 'ENTREGA_KIT', quantity: deduct, previousQuantity: prev, newQuantity: newQty,
            itemId: item.id, itemName: item.name,
            locationId, locationName: location!.name,
            employeeName, employeeRole, employeeRegistration,
            reason: `Entrega de Kit: ${kit.name} (${quantityOfKits}x)`,
            notes, userId: req.user!.id,
          },
        });
      }
    });

    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Erro ao entregar kit.' });
  }
});
