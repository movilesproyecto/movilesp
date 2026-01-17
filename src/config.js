// Load API_URL from environment or use default localhost
// For development: use your PC's local IP (e.g., 192.168.1.100)
// For Android emulator: http://10.0.2.2:8000/api
// For iOS simulator: http://127.0.0.1:8000/api
// Default for local development web (use 127.0.0.1).
// For Android emulator: use 10.0.2.2. For iOS simulator: use 127.0.0.1. For physical device: use your PC LAN IP.
export const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.137.162:8000/api';
