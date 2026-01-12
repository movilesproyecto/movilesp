import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// IMPORTANTE: agrega /api
const API_URL = "https://overfavorable-romeo-unrightful.ngrok-free.dev/api";
console.log("---------------------------------------------------");
console.log(">>> URL QUE ESTÁ USANDO LA APP:", API_URL); 
console.log("---------------------------------------------------");
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    'ngrok-skip-browser-warning': 'true'
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default apiClient;
