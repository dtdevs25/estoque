export type CategoryType = 
  | 'Proteção da Cabeça'
  | 'Proteção Visual e Facial'
  | 'Proteção Auditiva'
  | 'Proteção Respiratória'
  | 'Proteção das Mãos e Braços'
  | 'Proteção dos Pés e Pernas'
  | 'Proteção contra Quedas (Altura)'
  | 'Vestimentas e Corpo Inteiro'
  | 'Ergonomia';

export type MovementType = 'SAIDA' | 'ENTRADA' | 'AJUSTE' | 'TRANSFERENCIA_SAIDA' | 'TRANSFERENCIA_ENTRADA' | 'ENTREGA_KIT';

export type UserRole = 'ADMIN' | 'CONTROLLER' | 'VIEWER';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locationIds: string[]; // Array de Estoques / Almoxarifados vinculados (pode conter 'ALL')
  status: 'ATIVO' | 'INATIVO';
  department?: string;
  notes?: string;
  createdAt: string;
}

export type TabType = 'dashboard' | 'items' | 'ergonomics' | 'movements' | 'kits' | 'locations' | 'users';

export interface Location {
  id: string;
  name: string;
  code: string;
  description: string;
  address?: string;
  responsibleName?: string;
  responsibleContact?: string;
  createdAt: string;
}

export interface EpiItem {
  id: string;
  name: string;
  type?: 'EPI' | 'EPC' | 'ERGONOMICO';
  caNumber: string; // Certificado de Aprovação (ex: CA 34567)
  caValidity?: string; // Validade do CA
  category: CategoryType;
  unit: 'un' | 'par' | 'cj' | 'pct' | 'kit';
  imageUrl: string;
  quantity: number;
  minQuantity: number; // Estoque mínimo para alerta
  locationId: string;
  costPrice?: number;
  brand?: string;
  description?: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  itemCa: string;
  locationId: string;
  locationName: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  currentStock: number;
  reason: string;
  employeeName?: string;
  employeeRole?: string;
  employeeRegistration?: string; // Matrícula
  batchSessionId?: string; // ID se fez parte de um lançamento em lote/diário
  notes?: string;
  createdAt: string;
}

export interface KitComponent {
  itemId: string; // ID base ou de referência do item
  itemName: string;
  requiredQuantity: number;
  unit: string;
}

export interface EpiKit {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  type?: 'EPI_EPC' | 'ERGONOMICO';
  components: KitComponent[];
  createdAt: string;
  updatedAt: string;
}

export interface KitLimitingItem {
  itemId: string;
  itemName: string;
  caNumber: string;
  availableStock: number;
  requiredPerKit: number;
  maxKitsPossible: number;
}

export interface KitAvailability {
  kitId: string;
  kitName: string;
  locationId: string;
  locationName: string;
  maxCompleteKits: number;
  limitingItem: KitLimitingItem | null;
  componentDetails: {
    itemId: string;
    itemName: string;
    caNumber: string;
    required: number;
    available: number;
    maxKitsForThisItem: number;
    isLimiting: boolean;
    unit: string;
  }[];
}

export interface BatchMovementEntry {
  itemId: string;
  quantity: number;
  type: MovementType;
  newQuantity?: number;
  notes?: string;
}
