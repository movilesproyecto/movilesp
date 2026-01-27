import { Platform } from 'react-native';

// Detecta si es Android emulator, iOS simulator o web
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Para Android y iOS: usar IP local
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    // Asegúrate de que 192.168.100.13 es la IP de tu máquina dev
    return 'http://192.168.100.13:8000/api';
  }
  
  // Para web: usar localhost
  return 'http://localhost:8000/api';
};

export const API_URL = getApiUrl();
export const API_URL_WEB = 'http://192.168.100.13:8000'; // URL sin /api para debug
