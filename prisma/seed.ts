import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPass = process.env.ADMIN_INITIAL_PASSWORD;
  if (!adminPass) {
    throw new Error('ADMIN_INITIAL_PASSWORD env var is required to run the seed.');
  }

  const adminPassword = await bcrypt.hash(adminPass, 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@estoque.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@estoque.com',
      password: adminPassword,
      role: 'ADMIN',
      locationIds: ['ALL'],
      status: 'ATIVO',
      department: 'TI / Administração do Sistema',
      notes: 'Usuário administrador padrão do sistema.',
    },
  });
  console.log('✅ Admin user:', admin.email);

  // Locations
  const loc1 = await prisma.location.upsert({
    where: { code: 'DEP-CENTRAL' },
    update: {},
    create: {
      name: 'Depósito Central SP',
      code: 'DEP-CENTRAL',
      address: 'Av. Industrial, 1000 — São Paulo, SP',
      description: 'Almoxarifado principal com todo o estoque de EPIs e EPCs da operação nacional.',
      responsibleName: 'Carlos Eduardo Silveira',
      responsibleContact: '(11) 99999-0001',
    },
  });

  const loc2 = await prisma.location.upsert({
    where: { code: 'BASE-ALPHA' },
    update: {},
    create: {
      name: 'Base Operacional Alpha',
      code: 'BASE-ALPHA',
      address: 'Rua das Obras, 450 — Campinas, SP',
      description: 'Base de apoio para equipes de campo da região metropolitana de Campinas.',
      responsibleName: 'Mariana Souza Santos',
      responsibleContact: '(19) 98888-0002',
    },
  });

  const loc3 = await prisma.location.upsert({
    where: { code: 'FAB-UNID2' },
    update: {},
    create: {
      name: 'Fábrica Unidade 2',
      code: 'FAB-UNID2',
      address: 'Rodovia Anhanguera, km 120 — Limeira, SP',
      description: 'Unidade fabril com estoque dedicado para linha de produção e manutenção.',
      responsibleName: 'Roberto Alves',
      responsibleContact: '(19) 97777-0003',
    },
  });

  console.log('✅ Locations created:', loc1.code, loc2.code, loc3.code);

  // Items (EPIs)
  const items = [
    { name: 'Capacete de Segurança Classe B', type: 'EPI' as const, caNumber: '12345', caExpiry: '2027-12-31', brand: 'MSA', category: 'Proteção da Cabeça', protectionCategory: 'Classe B', unit: 'UN', quantity: 50, minQuantity: 10, locationId: loc1.id, description: 'Capacete com isolamento elétrico para 20.000V.' },
    { name: 'Luva de Vaqueta', type: 'EPI' as const, caNumber: '23456', caExpiry: '2027-06-30', brand: 'Ledan', category: 'Proteção das Mãos', protectionCategory: 'Mecânico', unit: 'PAR', quantity: 200, minQuantity: 30, locationId: loc1.id, description: 'Luva de couro para proteção mecânica.' },
    { name: 'Óculos de Proteção Ampla Visão', type: 'EPI' as const, caNumber: '34567', caExpiry: '2028-01-01', brand: '3M', category: 'Proteção dos Olhos', protectionCategory: 'Impacto', unit: 'UN', quantity: 80, minQuantity: 15, locationId: loc1.id },
    { name: 'Botina de Segurança Composite', type: 'EPI' as const, caNumber: '45678', caExpiry: '2028-06-01', brand: 'Marluvas', category: 'Proteção dos Pés', protectionCategory: 'Biqueira Composite', unit: 'PAR', quantity: 35, minQuantity: 10, locationId: loc1.id },
    { name: 'Protetor Auricular Tipo Plug', type: 'EPI' as const, caNumber: '56789', caExpiry: '2027-09-01', brand: 'Moldex', category: 'Proteção Auditiva', unit: 'UN', quantity: 500, minQuantity: 50, locationId: loc1.id },
    { name: 'Capacete Classe A', type: 'EPI' as const, caNumber: '11111', brand: 'Vonder', category: 'Proteção da Cabeça', unit: 'UN', quantity: 20, minQuantity: 5, locationId: loc2.id },
    { name: 'Luva Nitrílica Descartável', type: 'EPI' as const, caNumber: '22222', brand: 'Supermax', category: 'Proteção das Mãos', unit: 'CX', quantity: 10, minQuantity: 3, locationId: loc2.id },
    { name: 'Extintor de Incêndio ABC 6kg', type: 'EPC' as const, category: 'Combate a Incêndio', unit: 'UN', quantity: 8, minQuantity: 2, locationId: loc3.id, description: 'Extintor multipropósito para uso em ambientes fechados.' },
    { name: 'Suporte de Notebook', type: 'ERGONOMICO' as const, category: 'Ergonomia', unit: 'UN', quantity: 25, minQuantity: 5, locationId: loc1.id, description: 'Suporte ajustável de alumínio para notebook, melhora postura e ventilação.' },
    { name: 'Teclado Ergonômico', type: 'ERGONOMICO' as const, category: 'Ergonomia', unit: 'UN', quantity: 15, minQuantity: 3, locationId: loc1.id, description: 'Teclado com layout em arco para redução de tensão nos pulsos.' },
  ];

  for (const item of items) {
    await prisma.epiItem.create({ data: item });
  }
  console.log('✅ Items created:', items.length);

  // Kit
  const allItems = await prisma.epiItem.findMany({ take: 3 });
  if (allItems.length >= 2) {
    await prisma.epiKit.create({
      data: {
        name: 'Kit EPI Campo Padrão',
        description: 'Kit completo de EPIs para atividades de campo.',
        type: 'EPI_EPC',
        components: {
          create: [
            { itemId: allItems[0].id, itemName: allItems[0].name, quantity: 1 },
            { itemId: allItems[1].id, itemName: allItems[1].name, quantity: 2 },
          ],
        },
      },
    });
    console.log('✅ Kit created');
  }

  console.log('\n🎉 Seed completed!');
  console.log('📧 Admin login: admin@estoque.com');
  console.log('🔑 Admin password: admin@2026');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
