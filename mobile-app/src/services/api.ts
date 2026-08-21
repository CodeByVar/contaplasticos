import axios, { isAxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoginPayload, LoginResponse, User } from '../types';

/**
 * URL base del backend (Persona 1 / NestJS).
 *
 * - Emulador Android Studio: http://10.0.2.2:3000
 * - Dispositivo físico (Expo Go): http://<TU_IP_LOCAL>:3000
 *   (ejecuta `ipconfig` y usa tu IPv4, ej: http://192.168.1.10:3000)
 */
export const API_BASE_URL = 'http://10.0.2.2:3000';

const ACCESS_TOKEN_KEY = '@plastcontrol/access_token';
const REFRESH_TOKEN_KEY = '@plastcontrol/refresh_token';
const USER_KEY = '@plastcontrol/user';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  async login(credentials: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    await Promise.all([
      AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken),
      AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user)),
    ]);
    return data;
  },

  async getStoredSession(): Promise<User | null> {
    try {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);
      if (!token || !storedUser) return null;
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
  },
};

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo y que la IP en src/services/api.ts sea correcta.';
    }
    if (error.response.status === 401 || error.response.status === 403) {
      return 'Correo o contraseña incorrectos.';
    }
    const message = (error.response.data as { message?: string | string[] })?.message;
    if (Array.isArray(message)) return message[0];
    if (typeof message === 'string') return message;
  }
  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}

export default api;
