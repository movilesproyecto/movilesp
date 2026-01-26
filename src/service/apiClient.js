import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// API client centralizado para el proyecto "departamentos"
// `API_URL` ya incluye la ruta `/api` según `src/config.js`
console.log('[API_CLIENT] Base URL:', API_URL, 'Platform:', Platform.OS);

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 segundos de timeout (aumentado para dev lento)
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Adjunta el token almacenado en AsyncStorage (clave: 'token')
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Log para debug (desarrollo)
      config.metadata = { startTime: Date.now() };
      console.log('[API_REQUEST] Attempting:', config.method?.toUpperCase(), API_URL + config.url);
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Opcional: limpiar token local si recibimos 401
apiClient.interceptors.response.use(
  (res) => {
    // Log tiempo de respuesta para debug
    if (res.config.metadata) {
      const duration = Date.now() - res.config.metadata.startTime;
      console.log(`[API] ${res.config.method?.toUpperCase()} ${res.config.url} - ${res.status} (${duration}ms)`);
    }
    return res;
  },
  async (error) => {
    // Log de errores con tiempo
    const url = error.config?.url ? (API_URL + error.config.url) : 'unknown';
    console.error('[API_ERROR] Failed to reach:', url, 'Error:', error.message, 'Code:', error.code);
    if (error.config?.metadata) {
      const duration = Date.now() - error.config.metadata.startTime;
      console.warn(`[API] ${error.config.method?.toUpperCase()} ${error.config.url} - FAILED (${duration}ms): ${error.message}`);
    }
    if (error?.response?.status === 401) {
      try {
        if (Platform.OS !== 'web') {
          await AsyncStorage.removeItem('token');
        }
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

export default apiClient;