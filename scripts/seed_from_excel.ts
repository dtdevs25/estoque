import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';

const prisma = new PrismaClient();
const FILE_PATH = '2. CONTROLE ESTOQUE REGIONAIS_EPIS_EPCS_ERG (1).xlsx';

async function seedFromExcel() {
  console.log('Lendo planilha do Excel...');
  const workbook = xlsx.readFile(FILE_PATH);
  const sheet = workbook.Sheets['ESTOQUE - SPO'];
  
  if (!sheet) {
    throw new Error('Aba ESTOQUE - SPO não encontrada');
  }

  const data = xlsx.utils.sheet_to_json<any>(sheet, { header: 1 });
  const headers = data[3] as string[]; // Row 4 (0-indexed 3)
  
  // As localidades começam na coluna de índice 4 (E)
  const locationColStart = 4;
  const locations: { name: string; code: string; colIndex: number }[] = [];

  for (let c = locationColStart; c < headers.length; c++) {
    const locName = String(headers[c] || '').trim();
    if (locName) {
      const locCode = `SPO-${locName.replace(/\s+/g, '-').toUpperCase()}`;
      locations.push({ name: locName, code: locCode, colIndex: c });
    }
  }

  console.log(`Encontradas ${locations.length} localidades na planilha:`, locations.map(l => l.name));

  // Garante que as localidades existem no banco
  const dbLocations = [];
  for (const loc of locations) {
    let dbLoc = await prisma.location.findUnique({ where: { code: loc.code } });
    if (!dbLoc) {
      dbLoc = await prisma.location.create({
        data: {
          name: loc.name,
          code: loc.code,
          description: `Importado via planilha`,
        }
      });
      console.log(`Criada nova localidade: ${loc.name}`);
    }
    dbLocations.push({ ...loc, id: dbLoc.id });
  }

  // Agora vamos processar os itens (da linha 6, index 5 em diante)
  let itemsCriados = 0;
  
  for (let i = 5; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    const num = String(row[0] || '').trim();
    if (num === '' || isNaN(Number(num))) continue; // Pula cabeçalhos de seção
    
    const descricao = String(row[1] || '').trim();
    let tamanho = String(row[2] || '').trim();
    
    if (!descricao) continue;
    
    // Constrói o nome final no formato oficial
    let finalName = descricao;
    if (tamanho && tamanho !== 'UN' && tamanho !== '-' && tamanho.toUpperCase() !== 'ÚNICO') {
      finalName = `${descricao} (${tamanho})`;
    } else if (tamanho === 'UN' || tamanho.toUpperCase() === 'ÚNICO') {
      finalName = `${descricao} (UN)`;
    }
    
    // Para CADA localidade, nós criamos o item (se ele não existir) com a quantidade atual da planilha!
    for (const loc of dbLocations) {
      const quantidadeNaPlanilha = Number(row[loc.colIndex]) || 0;
      
      const existingItem = await prisma.epiItem.findFirst({
        where: {
          name: finalName,
          locationId: loc.id
        }
      });

      if (!existingItem) {
        await prisma.epiItem.create({
          data: {
            name: finalName,
            category: 'EPI',
            type: 'EPI',
            unit: 'UN',
            quantity: quantidadeNaPlanilha,
            locationId: loc.id,
          }
        });
        itemsCriados++;
      } else {
         // Se já existir, apenas atualiza a quantidade
         if (existingItem.quantity !== quantidadeNaPlanilha) {
            await prisma.epiItem.update({
               where: { id: existingItem.id },
               data: { quantity: quantidadeNaPlanilha }
            });
         }
      }
    }
  }

  console.log(`\n🎉 Finalizado! Foram criados/processados ${itemsCriados} registros no banco de dados.`);
  console.log(`Seu App agora está idêntico à planilha.`);
}

seedFromExcel()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
