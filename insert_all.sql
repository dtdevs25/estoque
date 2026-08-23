-- Script para inserir TODAS as localidades e TODOS os itens no banco de dados

-- 1. Inserir ou ignorar Localidades
INSERT INTO "locations" (id, name, code, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'CAIUBI', 'SPO-CAIUBI', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;
INSERT INTO "locations" (id, name, code, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'RIBEIRÃO PRETO', 'SPO-RIBEIRÃO-PRETO', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;
INSERT INTO "locations" (id, name, code, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'BARRA FUNDA', 'SPO-BARRA-FUNDA', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;
INSERT INTO "locations" (id, name, code, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'CAMPINAS', 'SPO-CAMPINAS', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;
INSERT INTO "locations" (id, name, code, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'PIRACICABA', 'SPO-PIRACICABA', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;
INSERT INTO "locations" (id, name, code, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'MOGI DAS CRUZES', 'SPO-MOGI-DAS-CRUZES', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- 2. Inserir Itens
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BALDE DE LONA (UN)', 'EPI', 'Importado', 'UN', 269, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BALDE DE LONA (UN)', 'EPI', 'Importado', 'UN', 46, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BALDE DE LONA (UN)', 'EPI', 'Importado', 'UN', 41, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BALDE DE LONA (UN)', 'EPI', 'Importado', 'UN', 45, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BALDE DE LONA (UN)', 'EPI', 'Importado', 'UN', 8, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BALDE DE LONA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BANDEIROLA DE SINALIZAÇÃO SEM CABO (UN)', 'EPI', 'Importado', 'UN', 99, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BANDEIROLA DE SINALIZAÇÃO SEM CABO (UN)', 'EPI', 'Importado', 'UN', 43, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BANDEIROLA DE SINALIZAÇÃO SEM CABO (UN)', 'EPI', 'Importado', 'UN', 183, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BANDEIROLA DE SINALIZAÇÃO SEM CABO (UN)', 'EPI', 'Importado', 'UN', 63, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BANDEIROLA DE SINALIZAÇÃO SEM CABO (UN)', 'EPI', 'Importado', 'UN', 14, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BANDEIROLA DE SINALIZAÇÃO SEM CABO (UN)', 'EPI', 'Importado', 'UN', 8, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOLSA PARA CORDA LVM (UN)', 'EPI', 'Importado', 'UN', 26, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOLSA PARA CORDA LVM (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOLSA PARA CORDA LVM (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOLSA PARA CORDA LVM (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOLSA PARA CORDA LVM (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOLSA PARA CORDA LVM (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (38)', 'EPI', 'Importado', 'UN', 8, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (38)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (38)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (38)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (38)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (38)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (39)', 'EPI', 'Importado', 'UN', 17, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (39)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (39)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (39)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (39)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (39)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (40)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (40)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (40)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (40)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (40)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (40)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (41)', 'EPI', 'Importado', 'UN', 5, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (41)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (41)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (41)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (41)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (41)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (42)', 'EPI', 'Importado', 'UN', 6, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (42)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (42)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (42)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (42)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (42)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (43)', 'EPI', 'Importado', 'UN', 4, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (43)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (43)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (43)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (43)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (43)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (44)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (44)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (44)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (44)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (44)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'BOTINA DE PVC (44)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (33)', 'EPI', 'Importado', 'UN', 37, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (33)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (33)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (33)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (33)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (33)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (34)', 'EPI', 'Importado', 'UN', 36, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (34)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (34)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (34)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (34)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (34)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (35)', 'EPI', 'Importado', 'UN', 37, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (35)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (35)', 'EPI', 'Importado', 'UN', 5, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (35)', 'EPI', 'Importado', 'UN', 21, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (35)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (35)', 'EPI', 'Importado', 'UN', 14, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (36)', 'EPI', 'Importado', 'UN', 21, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (36)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (36)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (36)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (36)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (36)', 'EPI', 'Importado', 'UN', 16, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (37)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (37)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (37)', 'EPI', 'Importado', 'UN', 5, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (37)', 'EPI', 'Importado', 'UN', 9, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (37)', 'EPI', 'Importado', 'UN', 3, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (37)', 'EPI', 'Importado', 'UN', 18, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (38)', 'EPI', 'Importado', 'UN', 30, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (38)', 'EPI', 'Importado', 'UN', 17, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (38)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (38)', 'EPI', 'Importado', 'UN', 21, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (38)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (38)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (39)', 'EPI', 'Importado', 'UN', 26, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (39)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (39)', 'EPI', 'Importado', 'UN', 12, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (39)', 'EPI', 'Importado', 'UN', 7, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (39)', 'EPI', 'Importado', 'UN', 3, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (39)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (40)', 'EPI', 'Importado', 'UN', 80, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (40)', 'EPI', 'Importado', 'UN', 10, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (40)', 'EPI', 'Importado', 'UN', 11, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (40)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (40)', 'EPI', 'Importado', 'UN', 4, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (40)', 'EPI', 'Importado', 'UN', 30, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (41)', 'EPI', 'Importado', 'UN', 88, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (41)', 'EPI', 'Importado', 'UN', 30, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (41)', 'EPI', 'Importado', 'UN', 8, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (41)', 'EPI', 'Importado', 'UN', 37, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (41)', 'EPI', 'Importado', 'UN', 5, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (41)', 'EPI', 'Importado', 'UN', 35, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (42)', 'EPI', 'Importado', 'UN', 85, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (42)', 'EPI', 'Importado', 'UN', 15, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (42)', 'EPI', 'Importado', 'UN', 8, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (42)', 'EPI', 'Importado', 'UN', 34, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (42)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (42)', 'EPI', 'Importado', 'UN', 6, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (43)', 'EPI', 'Importado', 'UN', 11, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (43)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (43)', 'EPI', 'Importado', 'UN', 11, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (43)', 'EPI', 'Importado', 'UN', 5, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (43)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (43)', 'EPI', 'Importado', 'UN', 6, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (44)', 'EPI', 'Importado', 'UN', 31, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (44)', 'EPI', 'Importado', 'UN', 18, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (44)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (44)', 'EPI', 'Importado', 'UN', 5, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (44)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (44)', 'EPI', 'Importado', 'UN', 10, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (45)', 'EPI', 'Importado', 'UN', 22, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (45)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (45)', 'EPI', 'Importado', 'UN', 3, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (45)', 'EPI', 'Importado', 'UN', 16, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (45)', 'EPI', 'Importado', 'UN', 3, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (45)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (46)', 'EPI', 'Importado', 'UN', 43, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (46)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (46)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (46)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (46)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (46)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (47)', 'EPI', 'Importado', 'UN', 16, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (47)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (47)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (47)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (47)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (47)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (48)', 'EPI', 'Importado', 'UN', 12, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (48)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (48)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (48)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (48)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CALÇADO DE SEGURANÇA - TIPO BOTINA (48)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (P)', 'EPI', 'Importado', 'UN', 126, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (P)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (P)', 'EPI', 'Importado', 'UN', 4, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (P)', 'EPI', 'Importado', 'UN', 10, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (P)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (P)', 'EPI', 'Importado', 'UN', 40, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (M)', 'EPI', 'Importado', 'UN', 91, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (M)', 'EPI', 'Importado', 'UN', 19, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (M)', 'EPI', 'Importado', 'UN', 10, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (M)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (M)', 'EPI', 'Importado', 'UN', 27, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (G)', 'EPI', 'Importado', 'UN', 92, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (G)', 'EPI', 'Importado', 'UN', 17, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (G)', 'EPI', 'Importado', 'UN', 23, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (G)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (G)', 'EPI', 'Importado', 'UN', 11, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (XG)', 'EPI', 'Importado', 'UN', 166, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (XG)', 'EPI', 'Importado', 'UN', 19, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (XG)', 'EPI', 'Importado', 'UN', 5, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (XG)', 'EPI', 'Importado', 'UN', 35, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (XG)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPA DE CHUVA PVC AMARELA (XG)', 'EPI', 'Importado', 'UN', 21, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE CLASSE B - ABA FRONTAL (UN)', 'EPI', 'Importado', 'UN', 240, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE CLASSE B - ABA FRONTAL (UN)', 'EPI', 'Importado', 'UN', 30, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE CLASSE B - ABA FRONTAL (UN)', 'EPI', 'Importado', 'UN', 27, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE CLASSE B - ABA FRONTAL (UN)', 'EPI', 'Importado', 'UN', 8, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE CLASSE B - ABA FRONTAL (UN)', 'EPI', 'Importado', 'UN', 11, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE CLASSE B - ABA FRONTAL (UN)', 'EPI', 'Importado', 'UN', 33, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARNEIRA + CATRACA (UN)', 'EPI', 'Importado', 'UN', 129, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARNEIRA + CATRACA (UN)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARNEIRA + CATRACA (UN)', 'EPI', 'Importado', 'UN', 19, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARNEIRA + CATRACA (UN)', 'EPI', 'Importado', 'UN', 38, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARNEIRA + CATRACA (UN)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARNEIRA + CATRACA (UN)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARTUCHO  VO  HONEYHELL RESPI (UN)', 'EPI', 'Importado', 'UN', 54, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARTUCHO  VO  HONEYHELL RESPI (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARTUCHO  VO  HONEYHELL RESPI (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARTUCHO  VO  HONEYHELL RESPI (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARTUCHO  VO  HONEYHELL RESPI (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CARTUCHO  VO  HONEYHELL RESPI (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CHAVE DETECTORA DE TENSÃO (UN)', 'EPI', 'Importado', 'UN', 64, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CHAVE DETECTORA DE TENSÃO (UN)', 'EPI', 'Importado', 'UN', 56, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CHAVE DETECTORA DE TENSÃO (UN)', 'EPI', 'Importado', 'UN', 74, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CHAVE DETECTORA DE TENSÃO (UN)', 'EPI', 'Importado', 'UN', 19, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CHAVE DETECTORA DE TENSÃO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CHAVE DETECTORA DE TENSÃO (UN)', 'EPI', 'Importado', 'UN', 26, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA TRABALHO EM ALTURA (UN)', 'EPI', 'Importado', 'UN', 292, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA TRABALHO EM ALTURA (UN)', 'EPI', 'Importado', 'UN', 25, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA TRABALHO EM ALTURA (UN)', 'EPI', 'Importado', 'UN', 27, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA TRABALHO EM ALTURA (UN)', 'EPI', 'Importado', 'UN', 90, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA TRABALHO EM ALTURA (UN)', 'EPI', 'Importado', 'UN', 6, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA TRABALHO EM ALTURA (UN)', 'EPI', 'Importado', 'UN', 8, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO ERGONÔMICO (UN)', 'EPI', 'Importado', 'UN', 12, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO ERGONÔMICO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO ERGONÔMICO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO ERGONÔMICO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO ERGONÔMICO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO ERGONÔMICO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'COLETE DE SINALIZAÇÃO REFLETIVO (UN)', 'EPI', 'Importado', 'UN', 63, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'COLETE DE SINALIZAÇÃO REFLETIVO (UN)', 'EPI', 'Importado', 'UN', 15, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'COLETE DE SINALIZAÇÃO REFLETIVO (UN)', 'EPI', 'Importado', 'UN', 23, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'COLETE DE SINALIZAÇÃO REFLETIVO (UN)', 'EPI', 'Importado', 'UN', 16, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'COLETE DE SINALIZAÇÃO REFLETIVO (UN)', 'EPI', 'Importado', 'UN', 10, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'COLETE DE SINALIZAÇÃO REFLETIVO (UN)', 'EPI', 'Importado', 'UN', 11, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (50 cm) (UN)', 'EPI', 'Importado', 'UN', 740, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (50 cm) (UN)', 'EPI', 'Importado', 'UN', 41, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (50 cm) (UN)', 'EPI', 'Importado', 'UN', 86, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (50 cm) (UN)', 'EPI', 'Importado', 'UN', 12, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (50 cm) (UN)', 'EPI', 'Importado', 'UN', 12, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (50 cm) (UN)', 'EPI', 'Importado', 'UN', 130, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (75 cm) (UN)', 'EPI', 'Importado', 'UN', 26, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (75 cm) (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (75 cm) (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (75 cm) (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (75 cm) (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CONE DE SINALIZAÇÃO (75 cm) (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'DISPOSITIVO GARRA MEIO VÃO (UN)', 'EPI', 'Importado', 'UN', 70, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'DISPOSITIVO GARRA MEIO VÃO (UN)', 'EPI', 'Importado', 'UN', 13, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'DISPOSITIVO GARRA MEIO VÃO (UN)', 'EPI', 'Importado', 'UN', 44, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'DISPOSITIVO GARRA MEIO VÃO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'DISPOSITIVO GARRA MEIO VÃO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'DISPOSITIVO GARRA MEIO VÃO (UN)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 3,5 LITROS (UN)', 'EPI', 'Importado', 'UN', 126, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 3,5 LITROS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 3,5 LITROS (UN)', 'EPI', 'Importado', 'UN', 26, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 3,5 LITROS (UN)', 'EPI', 'Importado', 'UN', 3, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 3,5 LITROS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 3,5 LITROS (UN)', 'EPI', 'Importado', 'UN', 11, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 5,0 LITROS (UN)', 'EPI', 'Importado', 'UN', 16, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 5,0 LITROS (UN)', 'EPI', 'Importado', 'UN', 25, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 5,0 LITROS (UN)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 5,0 LITROS (UN)', 'EPI', 'Importado', 'UN', 30, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 5,0 LITROS (UN)', 'EPI', 'Importado', 'UN', 8, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'GARRAFA TÉRMICA 5,0 LITROS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'JUGULAR TECIDO PARA CAPACETE 3M (UN)', 'EPI', 'Importado', 'UN', 40, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'JUGULAR TECIDO PARA CAPACETE 3M (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'JUGULAR TECIDO PARA CAPACETE 3M (UN)', 'EPI', 'Importado', 'UN', 38, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'JUGULAR TECIDO PARA CAPACETE 3M (UN)', 'EPI', 'Importado', 'UN', 12, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'JUGULAR TECIDO PARA CAPACETE 3M (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'JUGULAR TECIDO PARA CAPACETE 3M (UN)', 'EPI', 'Importado', 'UN', 69, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (9)', 'EPI', 'Importado', 'UN', 7, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (9)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (9)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (9)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (9)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (9)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (10)', 'EPI', 'Importado', 'UN', 7, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (10)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (10)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (10)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (10)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (10)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (11)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (11)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (11)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (11)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (11)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUV ALTA TENSÃO  CLASSE 00 TIPO II (11)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (P)', 'EPI', 'Importado', 'UN', 65, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (P)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (P)', 'EPI', 'Importado', 'UN', 11, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (P)', 'EPI', 'Importado', 'UN', 67, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (P)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (P)', 'EPI', 'Importado', 'UN', 67, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (M)', 'EPI', 'Importado', 'UN', 66, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (M)', 'EPI', 'Importado', 'UN', 25, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (M)', 'EPI', 'Importado', 'UN', 29, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (M)', 'EPI', 'Importado', 'UN', 28, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (M)', 'EPI', 'Importado', 'UN', 7, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (M)', 'EPI', 'Importado', 'UN', 83, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (G)', 'EPI', 'Importado', 'UN', 254, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (G)', 'EPI', 'Importado', 'UN', 27, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (G)', 'EPI', 'Importado', 'UN', 17, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (G)', 'EPI', 'Importado', 'UN', 16, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (G)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (G)', 'EPI', 'Importado', 'UN', 43, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (XG)', 'EPI', 'Importado', 'UN', 265, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (XG)', 'EPI', 'Importado', 'UN', 25, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (XG)', 'EPI', 'Importado', 'UN', 16, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (XG)', 'EPI', 'Importado', 'UN', 53, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (XG)', 'EPI', 'Importado', 'UN', 11, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE MALHA PU ANTICORTE (XG)', 'EPI', 'Importado', 'UN', 3, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (9)', 'EPI', 'Importado', 'UN', 83, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (9)', 'EPI', 'Importado', 'UN', 14, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (9)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (9)', 'EPI', 'Importado', 'UN', 11, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (9)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (9)', 'EPI', 'Importado', 'UN', 6, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (10)', 'EPI', 'Importado', 'UN', 90, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (10)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (10)', 'EPI', 'Importado', 'UN', 88, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (10)', 'EPI', 'Importado', 'UN', 23, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (10)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (10)', 'EPI', 'Importado', 'UN', 101, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (11)', 'EPI', 'Importado', 'UN', 100, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (11)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (11)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (11)', 'EPI', 'Importado', 'UN', 33, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (11)', 'EPI', 'Importado', 'UN', 12, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA DE VAQUETA CANO CURTO (11)', 'EPI', 'Importado', 'UN', 75, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (M)', 'EPI', 'Importado', 'UN', 10, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (M)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (G)', 'EPI', 'Importado', 'UN', 15, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (XG)', 'EPI', 'Importado', 'UN', 7, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (XG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (XG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (XG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (XG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA  PVC FORRADA (XG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (M)', 'EPI', 'Importado', 'UN', 10, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (G)', 'EPI', 'Importado', 'UN', 7, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (XG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (XG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (XG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (XG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (XG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'LUVA PETROLEIRA (XG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (M)', 'EPI', 'Importado', 'UN', 4, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (M)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (G)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (G)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (XXG)', 'EPI', 'Importado', 'UN', 4, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (XXG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (XXG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (XXG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (XXG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MACACÃO  QUIMICO DUPONT (XXG)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA ESCURO (UN)', 'EPI', 'Importado', 'UN', 105, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA ESCURO (UN)', 'EPI', 'Importado', 'UN', 26, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA ESCURO (UN)', 'EPI', 'Importado', 'UN', 39, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA ESCURO (UN)', 'EPI', 'Importado', 'UN', 77, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA ESCURO (UN)', 'EPI', 'Importado', 'UN', 4, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA ESCURO (UN)', 'EPI', 'Importado', 'UN', 24, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA INCOLOR (UN)', 'EPI', 'Importado', 'UN', 240, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA INCOLOR (UN)', 'EPI', 'Importado', 'UN', 22, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA INCOLOR (UN)', 'EPI', 'Importado', 'UN', 98, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA INCOLOR (UN)', 'EPI', 'Importado', 'UN', 76, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA INCOLOR (UN)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA INCOLOR (UN)', 'EPI', 'Importado', 'UN', 80, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO ESCURO (UN)', 'EPI', 'Importado', 'UN', 314, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO ESCURO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO ESCURO (UN)', 'EPI', 'Importado', 'UN', 41, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO ESCURO (UN)', 'EPI', 'Importado', 'UN', 87, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO ESCURO (UN)', 'EPI', 'Importado', 'UN', 5, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO ESCURO (UN)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO INCOLOR (UN)', 'EPI', 'Importado', 'UN', 324, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO INCOLOR (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO INCOLOR (UN)', 'EPI', 'Importado', 'UN', 24, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO INCOLOR (UN)', 'EPI', 'Importado', 'UN', 84, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO INCOLOR (UN)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'ÓCULOS DE SEGURANÇA SOBREPOSIÇÃO INCOLOR (UN)', 'EPI', 'Importado', 'UN', 17, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (34)', 'EPI', 'Importado', 'UN', 18, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (34)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (34)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (34)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (34)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (34)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (35)', 'EPI', 'Importado', 'UN', 14, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (35)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (35)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (35)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (35)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (35)', 'EPI', 'Importado', 'UN', 19, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (36)', 'EPI', 'Importado', 'UN', 16, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (36)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (36)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (36)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (36)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (36)', 'EPI', 'Importado', 'UN', 26, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (37)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (37)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (37)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (37)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (37)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (37)', 'EPI', 'Importado', 'UN', 28, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (38)', 'EPI', 'Importado', 'UN', 23, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (38)', 'EPI', 'Importado', 'UN', 19, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (38)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (38)', 'EPI', 'Importado', 'UN', 22, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (38)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (38)', 'EPI', 'Importado', 'UN', 29, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (39)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (39)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (39)', 'EPI', 'Importado', 'UN', 4, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (39)', 'EPI', 'Importado', 'UN', 23, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (39)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (39)', 'EPI', 'Importado', 'UN', 27, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (40)', 'EPI', 'Importado', 'UN', 19, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (40)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (40)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (40)', 'EPI', 'Importado', 'UN', 25, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (40)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (40)', 'EPI', 'Importado', 'UN', 13, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (41)', 'EPI', 'Importado', 'UN', 25, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (41)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (41)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (41)', 'EPI', 'Importado', 'UN', 30, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (41)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (41)', 'EPI', 'Importado', 'UN', 11, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (42)', 'EPI', 'Importado', 'UN', 26, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (42)', 'EPI', 'Importado', 'UN', 16, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (42)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (42)', 'EPI', 'Importado', 'UN', 40, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (42)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (42)', 'EPI', 'Importado', 'UN', 14, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (43)', 'EPI', 'Importado', 'UN', 25, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (43)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (43)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (43)', 'EPI', 'Importado', 'UN', 21, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (43)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (43)', 'EPI', 'Importado', 'UN', 22, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (44)', 'EPI', 'Importado', 'UN', 10, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (44)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (44)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (44)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (44)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (44)', 'EPI', 'Importado', 'UN', 15, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (45)', 'EPI', 'Importado', 'UN', 4, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (45)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (45)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (45)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (45)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (45)', 'EPI', 'Importado', 'UN', 19, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (46)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (46)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (46)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (46)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (46)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PALMILHA (46)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PERNEIRA DE PROTEÇÃO (PAR)', 'EPI', 'Importado', 'UN', 57, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PERNEIRA DE PROTEÇÃO (PAR)', 'EPI', 'Importado', 'UN', 9, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PERNEIRA DE PROTEÇÃO (PAR)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PERNEIRA DE PROTEÇÃO (PAR)', 'EPI', 'Importado', 'UN', 30, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PERNEIRA DE PROTEÇÃO (PAR)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PERNEIRA DE PROTEÇÃO (PAR)', 'EPI', 'Importado', 'UN', 35, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO CONCHA (UN)', 'EPI', 'Importado', 'UN', 14, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO CONCHA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO CONCHA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO CONCHA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO CONCHA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO CONCHA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO PLUG (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO PLUG (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO PLUG (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO PLUG (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO PLUG (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR AURICULAR TIPO PLUG (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR SOLAR FPS 60 C/ REPELENTE  (OBS.: VENCE EM: ??) (UN)', 'EPI', 'Importado', 'UN', 155, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR SOLAR FPS 60 C/ REPELENTE  (OBS.: VENCE EM: ??) (UN)', 'EPI', 'Importado', 'UN', 128, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR SOLAR FPS 60 C/ REPELENTE  (OBS.: VENCE EM: ??) (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR SOLAR FPS 60 C/ REPELENTE  (OBS.: VENCE EM: ??) (UN)', 'EPI', 'Importado', 'UN', 65, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR SOLAR FPS 60 C/ REPELENTE  (OBS.: VENCE EM: ??) (UN)', 'EPI', 'Importado', 'UN', 7, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'PROTETOR SOLAR FPS 60 C/ REPELENTE  (OBS.: VENCE EM: ??) (UN)', 'EPI', 'Importado', 'UN', 40, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'RESPIRADOR SEMIFACIAL  HONEYWELL 2 CARTUCHOS (UN)', 'EPI', 'Importado', 'UN', 18, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'RESPIRADOR SEMIFACIAL  HONEYWELL 2 CARTUCHOS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'RESPIRADOR SEMIFACIAL  HONEYWELL 2 CARTUCHOS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'RESPIRADOR SEMIFACIAL  HONEYWELL 2 CARTUCHOS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'RESPIRADOR SEMIFACIAL  HONEYWELL 2 CARTUCHOS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'RESPIRADOR SEMIFACIAL  HONEYWELL 2 CARTUCHOS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SISTEMA DE RESGATE "KIT LVM" (UN)', 'EPI', 'Importado', 'UN', 154, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SISTEMA DE RESGATE "KIT LVM" (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SISTEMA DE RESGATE "KIT LVM" (UN)', 'EPI', 'Importado', 'UN', 38, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SISTEMA DE RESGATE "KIT LVM" (UN)', 'EPI', 'Importado', 'UN', 50, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SISTEMA DE RESGATE "KIT LVM" (UN)', 'EPI', 'Importado', 'UN', 5, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SISTEMA DE RESGATE "KIT LVM" (UN)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO COM REGULAGEM 2 METROS (UN)', 'EPI', 'Importado', 'UN', 200, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO COM REGULAGEM 2 METROS (UN)', 'EPI', 'Importado', 'UN', 30, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO COM REGULAGEM 2 METROS (UN)', 'EPI', 'Importado', 'UN', 47, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO COM REGULAGEM 2 METROS (UN)', 'EPI', 'Importado', 'UN', 91, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO COM REGULAGEM 2 METROS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO COM REGULAGEM 2 METROS (UN)', 'EPI', 'Importado', 'UN', 14, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE PREVENÇÃO DE QUEDAS "Y" COM ABSORVEDOR (UN)', 'EPI', 'Importado', 'UN', 20, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE PREVENÇÃO DE QUEDAS "Y" COM ABSORVEDOR (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE PREVENÇÃO DE QUEDAS "Y" COM ABSORVEDOR (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE PREVENÇÃO DE QUEDAS "Y" COM ABSORVEDOR (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE PREVENÇÃO DE QUEDAS "Y" COM ABSORVEDOR (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE PREVENÇÃO DE QUEDAS "Y" COM ABSORVEDOR (UN)', 'EPI', 'Importado', 'UN', 5, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TOUCA ÁRABE (UN)', 'EPI', 'Importado', 'UN', 100, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TOUCA ÁRABE (UN)', 'EPI', 'Importado', 'UN', 15, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TOUCA ÁRABE (UN)', 'EPI', 'Importado', 'UN', 54, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TOUCA ÁRABE (UN)', 'EPI', 'Importado', 'UN', 23, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TOUCA ÁRABE (UN)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TOUCA ÁRABE (UN)', 'EPI', 'Importado', 'UN', 26, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CORDA 12MM (UN)', 'EPI', 'Importado', 'UN', 220, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CORDA 12MM (UN)', 'EPI', 'Importado', 'UN', 31, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CORDA 12MM (UN)', 'EPI', 'Importado', 'UN', 17, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CORDA 12MM (UN)', 'EPI', 'Importado', 'UN', 90, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CORDA 12MM (UN)', 'EPI', 'Importado', 'UN', 1, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CORDA 12MM (UN)', 'EPI', 'Importado', 'UN', 21, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAPÉZIO  SUSPENSOR ESPAÇO CONFINADO (UN)', 'EPI', 'Importado', 'UN', 2, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAPÉZIO  SUSPENSOR ESPAÇO CONFINADO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAPÉZIO  SUSPENSOR ESPAÇO CONFINADO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAPÉZIO  SUSPENSOR ESPAÇO CONFINADO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAPÉZIO  SUSPENSOR ESPAÇO CONFINADO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAPÉZIO  SUSPENSOR ESPAÇO CONFINADO (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE MONTANA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE MONTANA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE MONTANA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE MONTANA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE MONTANA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CAPACETE MONTANA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'CINTO DE SEGURANÇA PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE DE POSICIONAMENTO PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE EM "Y" PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE EM "Y" PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE EM "Y" PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE EM "Y" PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE EM "Y" PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TALABARTE EM "Y" PARA TORRISTA (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CABO DE AÇO 8MM (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CABO DE AÇO 8MM (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CABO DE AÇO 8MM (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CABO DE AÇO 8MM (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CABO DE AÇO 8MM (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'TRAVA QUEDAS PARA CABO DE AÇO 8MM (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'APOIO PARA OS PÉS (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'KEY PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'MOUSE PAD (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAIUBI';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-RIBEIRÃO-PRETO';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-BARRA-FUNDA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-CAMPINAS';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-PIRACICABA';
INSERT INTO "epi_items" (id, name, type, category, unit, quantity, "minQuantity", "locationId", "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'SUPORTE PARA NOTEBOOK (UN)', 'EPI', 'Importado', 'UN', 0, 0, id, NOW(), NOW()
FROM "locations" WHERE code = 'SPO-MOGI-DAS-CRUZES';
