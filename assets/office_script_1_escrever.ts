/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  OFFICE SCRIPT 1 — ESCREVER (App → SharePoint)                 ║
 * ║  Cole em: Excel Online → Automatizar → Novo Script              ║
 * ║  Salve como: "EPI - Atualizar Estoque SPO"                      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Recebe do Power Automate:
 *   - location: nome exato da coluna na planilha (ex: "CAIUBI")
 *   - lastInventoryDate: data no formato "DD/MM/AAAA"
 *   - items: array de { descricao, tamanho, quantidade }
 *
 * Comportamento:
 *   - Lê os cabeçalhos da LINHA 4 dinamicamente → suporta novas colunas automaticamente
 *   - Grava a data de inventário na LINHA 5 da coluna correspondente
 *   - Atualiza as quantidades nas linhas de dados (linha 6 em diante)
 *   - Retorna um relatório com contagem de atualizações e itens não encontrados
 */
function main(
  workbook: ExcelScript.Workbook,
  location: string,
  lastInventoryDate: string,
  items: { descricao: string; tamanho: string; quantidade: number }[]
): {
  success: boolean;
  updated: number;
  notFound: string[];
  location: string;
  colIndex: number;
  syncedAt: string;
} {
  const HEADER_ROW = 4;    // Linha 4: cabeçalhos de localidade (1-indexed)
  const DATE_ROW = 5;      // Linha 5: datas da última contagem
  const DATA_START_ROW = 6; // Linha 6: início dos dados de itens

  const COL_DESCRICAO = 2; // Coluna B (1-indexed)
  const COL_TAMANHO = 3;   // Coluna C (1-indexed)

  const sheet = workbook.getWorksheet("ESTOQUE - SPO");
  const usedRange = sheet.getUsedRange();
  const allValues = usedRange.getValues() as (string | number | boolean)[][];

  // ── Localiza dinamicamente a coluna pela leitura do cabeçalho (linha 4) ──
  const headerRowValues = allValues[HEADER_ROW - 1]; // array 0-indexed
  const locationNorm = location.trim().toUpperCase();
  let colIndex = -1;

  for (let c = 0; c < headerRowValues.length; c++) {
    const header = String(headerRowValues[c] ?? "").trim().toUpperCase();
    if (header === locationNorm) {
      colIndex = c + 1; // converte para 1-indexed
      break;
    }
  }

  if (colIndex === -1) {
    console.log(`[EPI Script] Coluna "${location}" não encontrada nos cabeçalhos da linha 4.`);
    return {
      success: false,
      updated: 0,
      notFound: [`Coluna "${location}" não encontrada na planilha.`],
      location,
      colIndex: -1,
      syncedAt: new Date().toISOString(),
    };
  }

  // ── Grava a data da última contagem na linha 5 ─────────────────────────
  const dateCell = sheet.getCell(DATE_ROW - 1, colIndex - 1); // 0-indexed
  dateCell.setValue(lastInventoryDate || new Date().toLocaleDateString("pt-BR"));

  // ── Itera nos dados a partir da linha 6 ────────────────────────────────
  let updatedCount = 0;
  const notFound: string[] = [];

  // Função para limpar e normalizar o nome para comparação (Fuzzy Match)
  const clean = (s: string) => {
    return s
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[-()]/g, " ") // Troca parênteses e traços por espaço
      .replace(/\bUN\b/gi, "") // Remove a palavra UN
      .replace(/\s+/g, " ") // Remove espaços duplos
      .trim()
      .toUpperCase();
  };

  for (const item of items) {
    const itemDesc = String(item.descricao ?? "").trim();
    const itemTam = String(item.tamanho ?? "").trim();
    
    // Combina o que veio do banco e limpa
    const itemCombined = clean(`${itemDesc} ${itemTam}`);
    let found = false;

    for (let rowIdx = DATA_START_ROW - 1; rowIdx < allValues.length; rowIdx++) {
      const row = allValues[rowIdx];

      // Pula linhas de seção (sem número de item na col A)
      const numCell = row[0];
      if (typeof numCell === "string" && isNaN(Number(numCell)) && numCell !== "") continue;

      const rowDesc = String(row[COL_DESCRICAO - 1] ?? "").trim();
      const rowTam = String(row[COL_TAMANHO - 1] ?? "").trim();

      // Combina o que está na planilha e limpa
      const rowCombined = clean(`${rowDesc} ${rowTam}`);

      // Compara as duas strings limpas
      if (itemCombined === rowCombined || itemCombined.includes(rowCombined) || rowCombined.includes(itemCombined)) {
        sheet.getCell(rowIdx, colIndex - 1).setValue(item.quantidade);
        updatedCount++;
        found = true;
        break;
      }
    }

    if (!found) {
      notFound.push(`${item.descricao}${item.tamanho ? ` (${item.tamanho})` : ""}`);
    }
  }

  console.log(`[EPI Script] "${location}" — ${updatedCount} atualizados, ${notFound.length} não encontrados.`);

  return {
    success: true,
    updated: updatedCount,
    notFound,
    location,
    colIndex,
    syncedAt: new Date().toISOString(),
  };
}
