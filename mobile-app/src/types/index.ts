export type UserRole = 'ADMIN' | 'ALMACEN' | 'PRODUCCION' | 'SUPERVISOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  shift: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type MaterialType = 'RESINA' | 'MASTERBATCH' | 'ADITIVO' | 'RECUPERADO';

export type ProcessType = 'EXTRUSION' | 'INYECCION' | 'SOPLADO' | 'TERMOFORMADO';

export type StockStatus = 'OPTIMO' | 'BAJO' | 'CRITICO';

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  type: MaterialType;
  category: ProcessType;
  density: number;
  meltFlowIndex: number;
  unit: string;
  currentStockKg: number;
  minStockKg: number;
  maxCapacityKg: number;
  siloLocation: string;
  status: StockStatus;
  supplierId?: string | null;
  supplier?: {
    id: string;
    code: string;
    name: string;
  } | null;
}

export interface RawMaterialFilters {
  search?: string;
  type?: MaterialType;
  minStockAlert?: boolean;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Inicio: undefined;
  Stock: undefined;
  Alertas: undefined;
  Perfil: undefined;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  ALMACEN: 'Almacén',
  PRODUCCION: 'Producción',
  SUPERVISOR: 'Supervisor',
};

export const SHIFT_LABELS: Record<string, string> = {
  TURNO_MANANA: 'Turno Mañana',
  TURNO_TARDE: 'Turno Tarde',
  TURNO_NOCHE: 'Turno Noche',
};

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  RESINA: 'Resina',
  MASTERBATCH: 'Masterbatch',
  ADITIVO: 'Aditivo',
  RECUPERADO: 'Recuperado',
};

export const PROCESS_LABELS: Record<ProcessType, string> = {
  EXTRUSION: 'Extrusión',
  INYECCION: 'Inyección',
  SOPLADO: 'Soplado',
  TERMOFORMADO: 'Termoformado',
};

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  OPTIMO: 'Óptimo',
  BAJO: 'Bajo',
  CRITICO: 'Crítico',
};
