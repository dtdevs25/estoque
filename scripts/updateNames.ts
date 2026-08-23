import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateEpiNames() {
  console.log('Iniciando atualização de nomes de EPIs para o padrão SharePoint...');

  // Mapeamento: 'Nome Antigo no App' -> 'Nome Oficial da Planilha'
  // OBS: Não coloque os tamanhos no nome da planilha se a planilha separa o tamanho na coluna "Tamanho" ou usa (34).
  // Apenas o nome base.
  const nameMappings: Record<string, string> = {
    // BOTAS / BOTINAS
    'BOTINA DE SEGURANÇA - Tam 33': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 33',
    'BOTINA DE SEGURANÇA - Tam 34': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 34',
    'BOTINA DE SEGURANÇA - Tam 35': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 35',
    'BOTINA DE SEGURANÇA - Tam 36': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 36',
    'BOTINA DE SEGURANÇA - Tam 37': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 37',
    'BOTINA DE SEGURANÇA - Tam 38': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 38',
    'BOTINA DE SEGURANÇA - Tam 39': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 39',
    'BOTINA DE SEGURANÇA - Tam 40': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 40',
    'BOTINA DE SEGURANÇA - Tam 41': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 41',
    'BOTINA DE SEGURANÇA - Tam 42': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 42',
    'BOTINA DE SEGURANÇA - Tam 43': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 43',
    'BOTINA DE SEGURANÇA - Tam 44': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 44',
    'BOTINA DE SEGURANÇA - Tam 45': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 45',
    'BOTINA DE SEGURANÇA - Tam 46': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 46',
    'BOTINA DE SEGURANÇA - Tam 47': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 47',
    'BOTINA DE SEGURANÇA - Tam 48': 'CALÇADO DE SEGURANÇA - TIPO BOTINA - Tam 48',
    
    'BOTA DE PVC - Tam 33': 'BOTINA DE PVC - Tam 33',
    'BOTA DE PVC - Tam 34': 'BOTINA DE PVC - Tam 34',
    'BOTA DE PVC - Tam 35': 'BOTINA DE PVC - Tam 35',
    'BOTA DE PVC - Tam 36': 'BOTINA DE PVC - Tam 36',
    'BOTA DE PVC - Tam 37': 'BOTINA DE PVC - Tam 37',
    'BOTA DE PVC - Tam 38': 'BOTINA DE PVC - Tam 38',
    'BOTA DE PVC - Tam 39': 'BOTINA DE PVC - Tam 39',
    'BOTA DE PVC - Tam 40': 'BOTINA DE PVC - Tam 40',
    'BOTA DE PVC - Tam 41': 'BOTINA DE PVC - Tam 41',
    'BOTA DE PVC - Tam 42': 'BOTINA DE PVC - Tam 42',
    'BOTA DE PVC - Tam 43': 'BOTINA DE PVC - Tam 43',
    'BOTA DE PVC - Tam 44': 'BOTINA DE PVC - Tam 44',
    'BOTA DE PVC - Tam 45': 'BOTINA DE PVC - Tam 45',
    'BOTA DE PVC - Tam 46': 'BOTINA DE PVC - Tam 46',
    'BOTA DE PVC - Tam 47': 'BOTINA DE PVC - Tam 47',
    'BOTA DE PVC - Tam 48': 'BOTINA DE PVC - Tam 48',

    // DIVERSOS
    'CAPACETE DE SEGURANÇA': 'CAPACETE CLASSE B - ABA FRONTAL',
    'CARNEIRA COM CATRACA PARA CAPACETE 3M': 'CARNEIRA + CATRACA',
    'MASCARA VO SEMI FACIAL COM FILTRO DUPLO': 'RESPIRADOR SEMIFACIAL HONEYWELL 2 CARTUCHOS',
    'GARRAFA TERMICA 5L': 'GARRAFA TÉRMICA 5,0 LITROS',
    'DISPOSITIVO ANCORAGEM GARRA DE MEIO DE VÃO': 'DISPOSITIVO GARRA MEIO VÃO',
    'PROTETOR AURICULAR DESCARTAVEL TIPO PLUG': 'PROTETOR AURICULAR TIPO PLUG',
    'TOUCA TIPO ARABE EM BRIM': 'TOUCA ÁRABE',
    'SUSPENSOR PARA ESPAÇO CONFINADO': 'TRAPÉZIO SUSPENSOR ESPAÇO CONFINADO',
    'CAPACETE CLASSE B TIPO III TORRISTA': 'CAPACETE MONTANA PARA TORRISTA',
    'SUPORTE NOTEBOOK': 'SUPORTE PARA NOTEBOOK',
    'OCULOS DE SEGURANÇA SOBREPOR INCOLOR': 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO INCOLOR',
    'OCULOS DE SEGURANÇA SOBREPOR ESCURO': 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO ESCURO',
    'BOLSA DE LONA PARA ARMAZENAMENTO DE CORDA (100M)': 'BOLSA PARA CORDA LVM',
    'BANDEIROLA DE SINALIZAÇÃO PARA ESCADA': 'BANDEIROLA DE SINALIZAÇÃO SEM CABO',
    
    // MACACÕES
    'MACACÃO TYVEK - Tam P': 'MACACÃO QUIMICO DUPONT - Tam P',
    'MACACÃO TYVEK - Tam M': 'MACACÃO QUIMICO DUPONT - Tam M',
    'MACACÃO TYVEK - Tam G': 'MACACÃO QUIMICO DUPONT - Tam G',
    'MACACÃO TYVEK - Tam GG': 'MACACÃO QUIMICO DUPONT - Tam GG',
    'MACACÃO TYVEK - Tam XG': 'MACACÃO QUIMICO DUPONT - Tam XG',

    // LUVAS PU
    'LUVA DE SEGURANÇA PU VICSA - Tam P (7)': 'LUVA DE MALHA PU ANTICORTE - Tam P',
    'LUVA DE SEGURANÇA PU VICSA - Tam M (8)': 'LUVA DE MALHA PU ANTICORTE - Tam M',
    'LUVA DE SEGURANÇA PU VICSA - Tam G (9)': 'LUVA DE MALHA PU ANTICORTE - Tam G',
    'LUVA DE SEGURANÇA PU VICSA - Tam XG (10)': 'LUVA DE MALHA PU ANTICORTE - Tam XG',

    // LUVAS PETROLEIRA (se aplicável ao nome atual)
    // Se no app for LUVA DE VAQUETA CANO CURTO, cuidado para não mudar todas, apenas as equivalentes.
    // Adicione mais itens conforme necessário!
  };

  let count = 0;
  for (const [oldName, newName] of Object.entries(nameMappings)) {
    const res = await prisma.epiItem.updateMany({
      where: { name: oldName },
      data: { name: newName },
    });
    if (res.count > 0) {
      console.log(`✅ Renomeado: "${oldName}" -> "${newName}" (${res.count} itens atualizados)`);
      count += res.count;
    }
  }

  // Renomear nomes parcialmente de forma genérica (Substituição)
  const allItems = await prisma.epiItem.findMany();
  for (const item of allItems) {
    let updatedName = item.name;
    
    if (updatedName.includes('CINTA ERGONOMICA LOMBAR')) {
        updatedName = updatedName.replace('CINTA ERGONOMICA LOMBAR', 'CINTO ERGONÔMICO');
    }

    if (updatedName !== item.name) {
       await prisma.epiItem.update({
          where: { id: item.id },
          data: { name: updatedName }
       });
       console.log(`✅ Substituição Parcial: "${item.name}" -> "${updatedName}"`);
       count++;
    }
  }

  console.log(`\n🎉 Concluído! ${count} registros alterados com sucesso.`);
}

updateEpiNames()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
