/**
 * SharePoint Integration Routes
 * ────────────────────────────────────────────────────────────────────────────
 * Implementa comunicação bidirecional entre o EstoqueEPI e a planilha
 * "ESTOQUE - SPO" no SharePoint via Power Automate + Office Scripts.
 *
 * Fluxos:
 *  PUSH  → POST /api/sharepoint/sync    → App envia dados ao Power Automate → Planilha
 *  PULL  → POST /api/sharepoint/ingest  → Power Automate envia planilha → App
 *  GET   → GET  /api/sharepoint/status  → Retorna último status de sincronização
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const sharepointRouter = Router();

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SpreadsheetItem {
  descricao: string;
  tamanho: string;
  valorItem: number;
  quantidade: number;
}

interface LocationPayload {
  location: string;    // Nome da coluna na planilha, ex: "CAIUBI"
  locationCode: string; // Code no app, ex: "SPO-CAIUBI"
  items: SpreadsheetItem[];
  lastInventoryDate?: string; // Data da última contagem (linha 5 da planilha)
}

interface IngestPayload {
  sheet: string;
  syncedAt: string;
  locations: LocationPayload[];
}

interface SyncPayload {
  locationCodes: string[]; // Codes das locations SPO a sincronizar, ex: ["SPO-CAIUBI"]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WEBHOOK_SECRET = process.env.SHAREPOINT_WEBHOOK_SECRET;

/**
 * Verifica o Bearer token do cabeçalho Authorization.
 * Usado tanto nas chamadas vindas do Power Automate quanto nas chamadas internas.
 */
function verifySecret(req: Request, res: Response): boolean {
  if (!WEBHOOK_SECRET) {
    res.status(500).json({ message: 'SHAREPOINT_WEBHOOK_SECRET não configurado no servidor.' });
    return false;
  }
  const auth = req.headers['authorization'];
  if (auth !== `Bearer ${WEBHOOK_SECRET}`) {
    res.status(401).json({ message: 'Não autorizado. Token inválido ou ausente.' });
    return false;
  }
  return true;
}

/**
 * Normaliza texto para comparação: remove acentos, maiúsculas e espaços extras.
 */
function normalize(text: string): string {
  return text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Registra o resultado de uma sincronização no log interno (tabela SyncLog, se existir,
 * ou apenas no console). Permite rastrear histórico no app.
 */
async function logSync(direction: 'PUSH' | 'PULL', summary: object) {
  console.log(`[SharePoint ${direction}]`, JSON.stringify(summary));
  // Futuramente: await prisma.syncLog.create({ data: { direction, summary } });
}

// ─── Rota: Status ────────────────────────────────────────────────────────────

/**
 * GET /api/sharepoint/status
 * Retorna as locations SPO cadastradas e se a integração está configurada.
 * Requer autenticação normal do app.
 */
sharepointRouter.get('/status', authenticate, async (_req: Request, res: Response) => {
  try {
    const paWebhookUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    const paWebhookPullUrl = process.env.POWER_AUTOMATE_WEBHOOK_PULL_URL;
    const secretConfigured = !!WEBHOOK_SECRET;
    const webhookConfigured = !!paWebhookUrl;
    const webhookPullConfigured = !!paWebhookPullUrl;

    // Busca todas as locations cujo code começa com "SPO-"
    const spoLocations = await prisma.location.findMany({
      where: { code: { startsWith: 'SPO-' } },
      orderBy: { name: 'asc' },
    });

    res.json({
      integration: {
        secretConfigured,
        webhookConfigured,
        webhookPullConfigured,
        ready: secretConfigured && (webhookConfigured || webhookPullConfigured),
      },
      spoLocations: spoLocations.map(l => ({
        id: l.id,
        name: l.name,
        code: l.code,
        responsibleName: l.responsibleName,
      })),
    });
  } catch (e) {
    console.error('[sharepoint/status]', e);
    res.status(500).json({ message: 'Erro ao verificar status.' });
  }
});

// ─── Rota: PUSH (App → SharePoint) ───────────────────────────────────────────

/**
 * POST /api/sharepoint/sync
 * Chamado pelo frontend (ou internamente após movimentos) para enviar dados
 * ao Power Automate, que executará o Office Script na planilha.
 *
 * Body: { locationCodes: string[] }
 *   - Se vazio ou omitido, sincroniza TODAS as locations SPO.
 *
 * Requer: autenticação JWT + role ADMIN ou CONTROLLER
 */
sharepointRouter.post('/sync', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const paWebhookUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    if (!paWebhookUrl) {
      res.status(500).json({
        message: 'POWER_AUTOMATE_WEBHOOK_URL não configurada. Adicione ao .env.',
      });
      return;
    }

    const { locationCodes } = req.body as SyncPayload;

    // Busca locations SPO: se não especificado, pega todas com code SPO-*
    const whereClause = locationCodes?.length
      ? { code: { in: locationCodes } }
      : { code: { startsWith: 'SPO-' } };

    const locations = await prisma.location.findMany({ where: whereClause });

    if (!locations.length) {
      res.status(404).json({
        message: 'Nenhuma location SPO encontrada. Verifique os codes (devem começar com "SPO-").',
      });
      return;
    }

    const results: { location: string; sent: number; paStatus: number }[] = [];

    for (const loc of locations) {
      const stocks = await prisma.itemStock.findMany({
        where: { locationId: loc.id },
        include: { item: true }
      });

      // Monta o nome da coluna a partir do code: "SPO-CAIUBI" → "CAIUBI"
      // Também trata casos como "SPO-BARRA-FUNDA" → "BARRA FUNDA"
      const colName = loc.code.replace(/^SPO-/, '').replace(/-/g, ' ');

      const payload = {
        sheet: 'ESTOQUE - SPO',
        // Nome da coluna na planilha — o Office Script usará para localizar a coluna
        location: colName,
        // Data da última contagem no app (para escrever na linha 5)
        lastInventoryDate: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
        }),
        items: stocks.map(s => ({
          descricao: s.item.name,
          // Tamanho/variante fica em `description` no modelo atual
          tamanho: s.item.description || 'UN',
          quantidade: s.quantity,
        })),
        syncedAt: new Date().toISOString(),
      };

      try {
        const paRes = await fetch(paWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(30_000), // 30s timeout
        });

        const paText = await paRes.text();
        console.log(`[sharepoint/sync] Resposta do PA para ${loc.name}:`, paText);
        
        let paBody = null;
        try { paBody = JSON.parse(paText); } catch (e) {}

        results.push({ location: loc.name, sent: items.length, paStatus: paRes.status, paResponse: paBody });
      } catch (fetchErr) {
        console.error(`[sharepoint/sync] Erro enviando ${loc.name}:`, fetchErr);
        results.push({ location: loc.name, sent: 0, paStatus: -1 });
      }
    }

    await logSync('PUSH', { locations: results });

    res.json({
      success: true,
      syncedLocations: results.length,
      results,
    });
  } catch (e) {
    console.error('[sharepoint/sync]', e);
    res.status(500).json({ message: 'Erro ao sincronizar com SharePoint.' });
  }
});

// ─── Rota: PULL (SharePoint → App) — arquitetura gratuita ───────────────────
//
// O app chama o Power Automate via HTTP POST e recebe os dados da planilha
// diretamente na resposta (usando o conector "Resposta" do PA, que é standard).
// Não é necessário nenhum conector premium.
//
// Flow no Power Automate:
//   Trigger: HTTP  →  Executar Script "EPI - Ler Estoque SPO"  →  Resposta (body/result)

// ─── Lógica de Inteligência (Fuzzy Match) ─────────────────────────────────
function fuzzyMatch(dbName: string, sheetName: string): boolean {
  // Limpa caracteres especiais, parênteses e traços
  const clean = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, "") // remove acentos
      .toUpperCase()
      .replace(/[-()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const normDb = clean(dbName);
  const normSheet = clean(sheetName);

  if (normDb === normSheet) return true;
  if (normDb.includes(normSheet) || normSheet.includes(normDb)) return true;

  // Extrai números (ex: tamanhos 38, 39, 40) para não misturar luva 9 com luva 10
  const numDb = normDb.match(/\d+/g)?.join(',') || '';
  const numSheet = normSheet.match(/\d+/g)?.join(',') || '';
  if (numDb && numSheet && numDb !== numSheet) {
    return false; // Tamanhos ou números são diferentes (nunca deve dar match)
  }

  // Compara palavras em comum
  const wordsDb = normDb.split(' ').filter(w => w.length > 2 || /\d/.test(w));
  const wordsSheet = normSheet.split(' ').filter(w => w.length > 2 || /\d/.test(w));

  let matches = 0;
  for (const w of wordsDb) {
    if (wordsSheet.some(ws => ws === w || ws.startsWith(w) || w.startsWith(ws))) {
      matches++;
    }
  }

  // Verifica se pelo menos 50% das palavras coincidem
  const ratio = matches / Math.max(wordsDb.length, wordsSheet.length);
  return ratio >= 0.5;
}

/**
 * POST /api/sharepoint/pull
 * Chama o Power Automate, recebe os dados da planilha na resposta
 * e atualiza o banco de dados. Retorna um resumo das alterações.
 *
 * Requer: autenticação JWT + role ADMIN
 */
sharepointRouter.post('/pull', authenticate, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const paUrl = process.env.POWER_AUTOMATE_WEBHOOK_PULL_URL;
    if (!paUrl) {
      res.status(500).json({
        message: 'POWER_AUTOMATE_WEBHOOK_PULL_URL não configurada. Adicione ao .env do CapRover.',
      });
      return;
    }

    // Chama o Power Automate e aguarda a resposta com os dados da planilha
    // O PA executa o Office Script e retorna o resultado no corpo da resposta
    let paData: any;
    try {
      const paRes = await fetch(paUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'pull', requestedAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(60_000), // 60s — scripts podem demorar
      });

      if (!paRes.ok) {
        const errText = await paRes.text().catch(() => `HTTP ${paRes.status}`);
        res.status(502).json({
          message: `Power Automate retornou erro ${paRes.status}: ${errText}`,
        });
        return;
      }

      paData = await paRes.json();
    } catch (fetchErr: any) {
      const isTimeout = fetchErr?.name === 'TimeoutError' || fetchErr?.name === 'AbortError';
      res.status(502).json({
        message: isTimeout
          ? 'Timeout ao aguardar resposta do Power Automate (>60s). Tente novamente.'
          : `Erro de rede ao chamar Power Automate: ${fetchErr?.message}`,
      });
      return;
    }

    // O PA retorna o resultado do Office Script diretamente no body.
    // O script retorna: { sheet, syncedAt, locations: [...] }
    // Mas o PA pode envolver em { result: ... } dependendo da configuração.
    const payload = paData?.locations
      ? paData
      : paData?.result?.locations
        ? paData.result
        : null;

    if (!payload?.locations || !Array.isArray(payload.locations)) {
      console.error('[sharepoint/pull] Payload inesperado do PA:', JSON.stringify(paData).slice(0, 500));
      res.status(502).json({
        message: 'Resposta do Power Automate não tem o formato esperado. Verifique o Office Script.',
        received: paData,
      });
      return;
    }

    // ── Processa os dados e atualiza o banco ──────────────────────────────
    const summary: {
      location: string;
      matched: number;
      updated: number;
      skipped: number;
      notFound: string[];
    }[] = [];

    const syncedAt = payload.syncedAt ?? new Date().toISOString();

    for (const locPayload of payload.locations) {
      const derivedCode = `SPO-${locPayload.location.replace(/\s+/g, '-').toUpperCase()}`;
      const codeToSearch = locPayload.locationCode || derivedCode;

      const dbLocation = await prisma.location.findUnique({ where: { code: codeToSearch } });

      if (!dbLocation) {
        summary.push({
          location: locPayload.location,
          matched: 0, updated: 0, skipped: 0,
          notFound: [`Location com code "${codeToSearch}" não cadastrada no app.`],
        });
        continue;
      }

      const dbStocks = await prisma.itemStock.findMany({ 
        where: { locationId: dbLocation.id },
        include: { item: true }
      });

      let matched = 0, updated = 0, skipped = 0, zeroed = 0;
      const notFound: string[] = [];
      const matchedDbStockIds = new Set<string>();

      for (const spItem of locPayload.items) {
        if (!spItem.descricao) continue;

        const spNorm = normalize(spItem.descricao);
        const spTam  = normalize(spItem.tamanho || '');

        // Tentativa 1: nome exato
        let dbStock = dbStocks.find(s => normalize(s.item.name) === spNorm);
        // Tentativa 2: nome + tamanho concatenado
        if (!dbStock && spTam && spTam !== 'UN') {
          dbStock = dbStocks.find(s => normalize(s.item.name) === `${spNorm} ${spTam}`);
        }
        // Tentativa 3: Inteligência artificial leve (Fuzzy Matching)
        if (!dbStock) {
          dbStock = dbStocks.find(s => fuzzyMatch(s.item.name, `${spItem.descricao} ${spItem.tamanho || ''}`));
        }

        if (!dbStock) {
          const allItems = await prisma.epiItem.findMany();
          let dbItem = allItems.find(i => normalize(i.name) === spNorm || normalize(i.name) === `${spNorm} ${spTam}` || fuzzyMatch(i.name, `${spItem.descricao} ${spItem.tamanho || ''}`));
          
          if (dbItem) {
            dbStock = await prisma.itemStock.create({
              data: { itemId: dbItem.id, locationId: dbLocation.id, quantity: 0, minQuantity: 0 },
              include: { item: true }
            });
            dbStocks.push(dbStock);
          }
        }

        if (!dbStock) {
          notFound.push(`${spItem.descricao}${spItem.tamanho && spItem.tamanho !== 'UN' ? ` (${spItem.tamanho})` : ''}`);
          continue;
        }

        matched++;
        matchedDbStockIds.add(dbStock.id);

        if (dbStock.quantity === spItem.quantidade) { skipped++; continue; }

        const prev = dbStock.quantity;
        const next = spItem.quantidade;

        await prisma.itemStock.update({ where: { id: dbStock.id }, data: { quantity: next } });
        
        const dbItem = dbStock.item;
        await prisma.stockMovement.create({
          data: {
            type: 'AJUSTE',
            quantity: Math.abs(next - prev),
            previousQuantity: prev,
            newQuantity: next,
            itemId: dbItem.id,
            itemName: dbItem.name,
            locationId: dbLocation.id,
            locationName: dbLocation.name,
            reason: `Sincronização automática via SharePoint — ${syncedAt}`,
            notes: `Fonte: Planilha ESTOQUE - SPO | Coluna: ${locPayload.location}`,
          },
        });
        updated++;
      }

      // Regra de Exclusão (Saneamento): Estoques no banco que não vieram da planilha devem ser zerados/deletados
      for (const stock of dbStocks) {
        if (!matchedDbStockIds.has(stock.id)) {
          // Em vez de deletar o EPI, deletamos apenas o vínculo de estoque para este local
          await prisma.itemStock.delete({ where: { id: stock.id } });
          zeroed++;
          updated++;
        }
      }

      summary.push({ location: locPayload.location, matched, updated, skipped, notFound });
    }

    await logSync('PULL', { syncedAt, summary });

    res.json({
      success: true,
      totalUpdated: summary.reduce((a, s) => a + s.updated, 0),
      totalMatched: summary.reduce((a, s) => a + s.matched, 0),
      summary,
    });
  } catch (e) {
    console.error('[sharepoint/pull]', e);
    res.status(500).json({ message: 'Erro interno ao processar pull do SharePoint.' });
  }
});

// ─── Rota: INGEST (legado — mantida para compatibilidade) ────────────────────
// Usada caso o Power Automate tenha acesso ao conector HTTP premium
// e prefira chamar o app diretamente. Funciona igual ao /pull mas é
// acionada pelo PA em vez do app.

/**
 * POST /api/sharepoint/ingest
 * Chamado PELO Power Automate (requer conector HTTP premium no PA).
 * Se o plano do PA não tiver premium, use /pull em vez desta rota.
 */
sharepointRouter.post('/ingest', async (req: Request, res: Response) => {
  if (!verifySecret(req, res)) return;

  try {
    const { locations, syncedAt } = req.body as IngestPayload;

    if (!Array.isArray(locations) || !locations.length) {
      res.status(400).json({ message: 'Payload inválido: "locations" deve ser um array não vazio.' });
      return;
    }

    const summary: { location: string; matched: number; updated: number; skipped: number; notFound: string[] }[] = [];

    for (const locPayload of locations) {
      const derivedCode = `SPO-${locPayload.location.replace(/\s+/g, '-').toUpperCase()}`;
      const codeToSearch = locPayload.locationCode || derivedCode;

      const dbLocation = await prisma.location.findUnique({ where: { code: codeToSearch } });
      if (!dbLocation) {
        summary.push({ location: locPayload.location, matched: 0, updated: 0, skipped: 0, notFound: [`"${codeToSearch}" não encontrada`] });
        continue;
      }

      const dbItems = await prisma.epiItem.findMany({ where: { locationId: dbLocation.id } });
      let matched = 0, updated = 0, skipped = 0;
      const notFound: string[] = [];

      for (const spItem of locPayload.items) {
        if (!spItem.descricao) continue;
        const spNorm = normalize(spItem.descricao);
        let dbItem = dbItems.find(i => normalize(i.name) === spNorm)
          ?? dbItems.find(i => normalize(i.name).includes(spNorm) || spNorm.includes(normalize(i.name)));

        if (!dbItem) { notFound.push(spItem.descricao); continue; }
        matched++;
        if (dbItem.quantity === spItem.quantidade) { skipped++; continue; }

        const prev = dbItem.quantity;
        await prisma.epiItem.update({ where: { id: dbItem.id }, data: { quantity: spItem.quantidade } });
        await prisma.stockMovement.create({
          data: {
            type: 'AJUSTE', quantity: Math.abs(spItem.quantidade - prev),
            previousQuantity: prev, newQuantity: spItem.quantidade,
            itemId: dbItem.id, itemName: dbItem.name,
            locationId: dbLocation.id, locationName: dbLocation.name,
            reason: `Sincronização SharePoint (ingest) — ${syncedAt ?? new Date().toISOString()}`,
            notes: `Planilha: ESTOQUE - SPO | Coluna: ${locPayload.location}`,
          },
        });
        updated++;
      }
      summary.push({ location: locPayload.location, matched, updated, skipped, notFound });
    }

    await logSync('PULL', { syncedAt, summary });
    res.json({ success: true, totalUpdated: summary.reduce((a, s) => a + s.updated, 0), summary });
  } catch (e) {
    console.error('[sharepoint/ingest]', e);
    res.status(500).json({ message: 'Erro ao processar ingest do SharePoint.' });
  }
});


/**
 * POST /api/sharepoint/ingest
 * Chamado PELO Power Automate após executar o Office Script de leitura.
 * Recebe o payload com todas as locations e itens da planilha e atualiza o banco.
 *
 * Autenticação: Bearer token via SHAREPOINT_WEBHOOK_SECRET (sem JWT de usuário)
 * — o Power Automate não possui sessão de usuário.
 *
 * Body: IngestPayload
 */
sharepointRouter.post('/ingest', async (req: Request, res: Response) => {
  if (!verifySecret(req, res)) return;

  try {
    const { locations, syncedAt } = req.body as IngestPayload;

    if (!Array.isArray(locations) || !locations.length) {
      res.status(400).json({ message: 'Payload inválido: "locations" deve ser um array não vazio.' });
      return;
    }

    const summary: {
      location: string;
      matched: number;
      updated: number;
      skipped: number;
      notFound: string[];
    }[] = [];

    for (const locPayload of locations) {
      // Determina o code da location no banco a partir do nome da coluna
      // Ex: "CAIUBI" → busca location com code "SPO-CAIUBI"
      // Ex: "BARRA FUNDA" → busca location com code "SPO-BARRA-FUNDA"
      const derivedCode = `SPO-${locPayload.location.replace(/\s+/g, '-').toUpperCase()}`;
      const codeToSearch = locPayload.locationCode || derivedCode;

      const dbLocation = await prisma.location.findUnique({ where: { code: codeToSearch } });

      if (!dbLocation) {
        summary.push({
          location: locPayload.location,
          matched: 0,
          updated: 0,
          skipped: 0,
          notFound: [`Location com code "${codeToSearch}" não encontrada no banco.`],
        });
        continue;
      }

      // Busca o estoque daquela localidade
      const dbStocks = await prisma.itemStock.findMany({ 
        where: { locationId: dbLocation.id },
        include: { item: true }
      });

      let matched = 0;
      let updated = 0;
      let skipped = 0;
      const notFound: string[] = [];

      for (const spItem of locPayload.items) {
        if (!spItem.descricao) continue;

        const spNorm = normalize(spItem.descricao);
        const spTam = normalize(spItem.tamanho || '');

        // Tenta encontrar o item no banco por correspondência de nome normalizado
        // Prioridade: nome exato → nome contém
        let dbStock = dbStocks.find(s => normalize(s.item.name) === spNorm);

        // Se não encontrou exato, tenta com nome + tamanho concatenado
        if (!dbStock && spTam && spTam !== 'UN') {
          dbStock = dbStocks.find(s => normalize(s.item.name) === `${spNorm} ${spTam}`);
        }

        // Tentativa mais abrangente: nome contém a descrição
        if (!dbStock) {
          dbStock = dbStocks.find(s => normalize(s.item.name).includes(spNorm) || spNorm.includes(normalize(s.item.name)));
        }

        // Se não achar no estoque, tenta ver se o item existe genericamente para criar o estoque
        if (!dbStock) {
          const allItems = await prisma.epiItem.findMany();
          let dbItem = allItems.find(i => normalize(i.name) === spNorm || normalize(i.name) === `${spNorm} ${spTam}` || normalize(i.name).includes(spNorm) || spNorm.includes(normalize(i.name)));
          
          if (dbItem) {
            dbStock = await prisma.itemStock.create({
              data: { itemId: dbItem.id, locationId: dbLocation.id, quantity: 0, minQuantity: 0 },
              include: { item: true }
            });
            dbStocks.push(dbStock);
          }
        }

        if (!dbStock) {
          notFound.push(`${spItem.descricao}${spItem.tamanho ? ` (${spItem.tamanho})` : ''}`);
          continue;
        }

        matched++;

        // Só atualiza se a quantidade for diferente
        if (dbStock.quantity === spItem.quantidade) {
          skipped++;
          continue;
        }

        const prev = dbStock.quantity;
        const next = spItem.quantidade;

        await prisma.itemStock.update({
          where: { id: dbStock.id },
          data: { quantity: next },
        });

        const dbItem = dbStock.item;

        await prisma.stockMovement.create({
          data: {
            type: 'AJUSTE',
            quantity: Math.abs(next - prev),
            previousQuantity: prev,
            newQuantity: next,
            itemId: dbItem.id,
            itemName: dbItem.name,
            locationId: dbLocation.id,
            locationName: dbLocation.name,
            reason: `Sincronização automática via SharePoint — ${syncedAt ?? new Date().toISOString()}`,
            notes: `Fonte: Planilha ESTOQUE - SPO | Coluna: ${locPayload.location}`,
          },
        });

        updated++;
      }

      summary.push({ location: locPayload.location, matched, updated, skipped, notFound });
    }

    await logSync('PULL', { syncedAt, summary });

    const totalUpdated = summary.reduce((a, s) => a + s.updated, 0);

    res.json({
      success: true,
      totalUpdated,
      summary,
    });
  } catch (e) {
    console.error('[sharepoint/ingest]', e);
    res.status(500).json({ message: 'Erro ao processar dados do SharePoint.' });
  }
});
