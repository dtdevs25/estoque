/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  OFFICE SCRIPT 2 — LER (SharePoint → App)                      ║
 * ║  Cole em: Excel Online → Automatizar → Novo Script              ║
 * ║  Salve como: "EPI - Ler Estoque SPO"                            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Lê TODOS os dados da aba "ESTOQUE - SPO" dinamicamente:
 *   - Lê a linha 4 para descobrir quais colunas de localidade existem
 *   - Lê a linha 5 para pegar as datas da última contagem
 *   - Lê os dados da linha 6 em diante
 *
 * Retorna um JSON compatível com POST /api/sharepoint/ingest:
 * {
 *   sheet: "ESTOQUE - SPO",
 *   syncedAt: "...",
 *   locations: [
 *     {
 *       location: "CAIUBI",
 *       locationCode: "SPO-CAIUBI",
 *       lastInventoryDate: "13/08/2026",
 *       items: [{ descricao, tamanho, valorItem, quantidade }]
 *     },
 *     ...
 *   ]
 * }
 *
 * IMPORTANTE: Novas colunas são detectadas automaticamente.
 * O code da location é derivado do cabeçalho: "BARRA FUNDA" → "SPO-BARRA-FUNDA"
 */
function main(workbook: ExcelScript.Workbook): {
  sheet: string;
  syncedAt: string;
  locations: {
    location: string;
    locationCode: string;
    lastInventoryDate: string;
    items: { descricao: string; tamanho: string; valorItem: number; quantidade: number }[];
  }[];
} {
  const HEADER_ROW = 4;     // Linha 4: nomes das colunas de localidade (1-indexed)
  const DATE_ROW = 5;       // Linha 5: datas da última contagem
  const DATA_START_ROW = 6; // Linha 6: início dos dados de itens

  const COL_NUM = 1;        // Coluna A: número do item (1-indexed)
  const COL_DESCRICAO = 2;  // Coluna B: descrição do EPI
  const COL_TAMANHO = 3;    // Coluna C: tamanho/variante
  const COL_VALOR = 4;      // Coluna D: valor unitário

  // Colunas de dados de localidade começam na coluna E (índice 5, 1-indexed)
  const FIRST_LOCATION_COL = 5;

  const sheet = workbook.getWorksheet("ESTOQUE - SPO");
  const usedRange = sheet.getUsedRange();
  const allValues = usedRange.getValues() as (string | number | boolean | null)[][];

  const totalCols = allValues[0]?.length ?? 0;

  // ── Descobre colunas de localidade lendo a linha 4 ────────────────────
  type LocationMeta = {
    location: string;
    locationCode: string;
    colIdx: number;     // 0-indexed para acessar allValues
    lastInventoryDate: string;
    items: { descricao: string; tamanho: string; valorItem: number; quantidade: number }[];
  };

  const locationMetas: LocationMeta[] = [];
  const headerRow = allValues[HEADER_ROW - 1];
  const dateRow = allValues[DATE_ROW - 1];

  for (let c = FIRST_LOCATION_COL - 1; c < totalCols; c++) {
    const header = String(headerRow[c] ?? "").trim();
    if (!header) continue; // pula colunas sem cabeçalho

    // Deriva o code da location: "BARRA FUNDA" → "SPO-BARRA-FUNDA"
    const locationCode = `SPO-${header.replace(/\s+/g, "-").toUpperCase()}`;

    // Lê a data da linha 5
    const rawDate = dateRow[c];
    let dateStr = "";
    if (rawDate instanceof Date) {
      dateStr = rawDate.toLocaleDateString("pt-BR");
    } else if (rawDate) {
      dateStr = String(rawDate).trim();
    }

    locationMetas.push({
      location: header,
      locationCode,
      colIdx: c,
      lastInventoryDate: dateStr,
      items: [],
    });
  }

  // ── Itera nos dados linha a linha ─────────────────────────────────────
  for (let rowIdx = DATA_START_ROW - 1; rowIdx < allValues.length; rowIdx++) {
    const row = allValues[rowIdx];

    const desc = String(row[COL_DESCRICAO - 1] ?? "").trim();
    if (!desc) continue; // linha vazia

    // Pula linhas de seção (ex: "EQUIPAMENTOS PARA TORRISTA", "ITENS ERGONÔMICOS")
    const numCell = row[COL_NUM - 1];
    if (typeof numCell === "string" && isNaN(Number(numCell)) && numCell.trim() !== "") continue;

    const tamanho = String(row[COL_TAMANHO - 1] ?? "").trim();
    const valorItem = Number(row[COL_VALOR - 1]) || 0;

    for (const meta of locationMetas) {
      const quantidade = Number(row[meta.colIdx]) || 0;
      meta.items.push({ descricao: desc, tamanho, valorItem, quantidade });
    }
  }

  const result = {
    sheet: "ESTOQUE - SPO",
    syncedAt: new Date().toISOString(),
    locations: locationMetas.map(m => ({
      location: m.location,
      locationCode: m.locationCode,
      lastInventoryDate: m.lastInventoryDate,
      items: m.items,
    })),
  };

  console.log(
    `[EPI Script] Lido: ${locationMetas.length} colunas de localidade, ` +
    `${locationMetas[0]?.items.length ?? 0} itens por coluna.`
  );

  return result;
}
