import xlsx from 'xlsx';
import * as fs from 'fs';

const FILE_PATH = '2. CONTROLE ESTOQUE REGIONAIS_EPIS_EPCS_ERG (1).xlsx';

function main() {
    console.log('Lendo planilha para gerar INSERT...');
    const workbook = xlsx.readFile(FILE_PATH);
    const sheet = workbook.Sheets['ESTOQUE - SPO'];
    
    if (!sheet) return;
    
    const data = xlsx.utils.sheet_to_json<any>(sheet, { header: 1 });
    const headers = data[3] as string[];
    
    const locationColStart = 4;
    const locations: { name: string; code: string; colIndex: number }[] = [];
    
    for (let c = locationColStart; c < headers.length; c++) {
      const locName = String(headers[c] || '').trim();
      if (locName) {
        const locCode = `SPO-${locName.replace(/\s+/g, '-').toUpperCase()}`;
        locations.push({ name: locName, code: locCode, colIndex: c });
      }
    }

    let sql = `-- Script para inserir TODAS as localidades e TODOS os itens no banco de dados\n\n`;

    // 1. Inserir Localidades
    sql += `-- 1. Inserir ou ignorar Localidades\n`;
    for (const loc of locations) {
        // Usa INSERT ON CONFLICT DO NOTHING se possível, mas postgresql usa ON CONFLICT (code)
        // Precisamos do ID gerado, então vamos usar gen_random_uuid()
        sql += `INSERT INTO "locations" (id, name, code, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), '${loc.name}', '${loc.code}', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;\n`;
    }
    sql += `\n`;

    // 2. Inserir Itens
    sql += `-- 2. Inserir Itens\n`;
    let count = 0;
    
    for (let i = 5; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        
        const num = String(row[0] || '').trim();
        if (num === '' || isNaN(Number(num))) continue;
        
        const descricao = String(row[1] || '').trim();
        let tamanho = String(row[2] || '').trim();
        
        if (!descricao) continue;
        
        let finalName = descricao;
        if (tamanho && tamanho !== 'UN' && tamanho !== '-' && tamanho.toUpperCase() !== 'ÚNICO') {
            finalName = `${descricao} (${tamanho})`;
        } else if (tamanho === 'UN' || tamanho.toUpperCase() === 'ÚNICO') {
            finalName = `${descricao} (UN)`;
        }
        
        const safeName = finalName.replace(/'/g, "''");

        for (const loc of locations) {
            const quantidade = Number(row[loc.colIndex]) || 0;
            
            sql += `INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), '${safeName}', 'EPI', 'Importado', 'UN', ${quantidade}, 0, id, NOW(), NOW()
FROM "locations" WHERE code = '${loc.code}';\n`;
            count++;
        }
    }

    fs.writeFileSync('insert_all.sql', sql);
    console.log(`Gerado SQL com ${count} inserções em insert_all.sql`);
}

main();
