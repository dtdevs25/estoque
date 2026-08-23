import xlsx from 'xlsx';
import * as fs from 'fs';

const FILE_PATH = '2. CONTROLE ESTOQUE REGIONAIS_EPIS_EPCS_ERG (1).xlsx';

function main() {
    console.log('Lendo planilha...');
    const workbook = xlsx.readFile(FILE_PATH);
    const sheetName = 'ESTOQUE - SPO';
    const sheet = workbook.Sheets[sheetName];
    
    if (!sheet) {
        console.error('Aba ESTOQUE - SPO não encontrada');
        return;
    }
    
    const data = xlsx.utils.sheet_to_json<any>(sheet, { header: 1 });
    const validNames = new Set<string>();
    
    // Inicia na linha 6 (index 5)
    for (let i = 5; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        
        const num = String(row[0] || '').trim();
        // Ignora linhas de cabeçalho da seção
        if (num === '' || isNaN(Number(num))) continue;
        
        const descricao = String(row[1] || '').trim();
        let tamanho = String(row[2] || '').trim();
        
        if (!descricao) continue;
        
        // Constrói o nome exatamente como o SQL script fez
        let finalName = descricao;
        if (tamanho && tamanho !== 'UN' && tamanho !== '-' && tamanho.toUpperCase() !== 'ÚNICO') {
            finalName = `${descricao} (${tamanho})`;
        } else if (tamanho === 'UN' || tamanho.toUpperCase() === 'ÚNICO') {
            finalName = `${descricao} (UN)`;
        } else {
             // as vezes n tem tamanho
             finalName = descricao;
        }
        
        validNames.add(finalName);
    }
    
    console.log(`Encontrados ${validNames.size} itens válidos na planilha.`);
    
    const sql = `
-- DELETAR TODOS OS ITENS QUE NÃO CONSTAM NA PLANILHA
-- (Execute com cuidado! Isso vai limpar seu banco para espelhar a planilha)
DELETE FROM "epi_items" WHERE "name" NOT IN (
${Array.from(validNames).map(name => `  '${name.replace(/'/g, "''")}'`).join(',\n')}
);
    `;
    
    fs.writeFileSync('delete_unmatched.sql', sql);
    console.log('SQL salvo em delete_unmatched.sql');
}

main();
