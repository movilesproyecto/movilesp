import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// IMPORTANTE: agrega /api
const API_URL = "http://192.168.100.61:8000/api";
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
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
