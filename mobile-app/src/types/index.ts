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
