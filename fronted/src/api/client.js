import axios from 'axios';

const apiClient = axios.create({
  // Conexión directa a la API global de tu NestJS
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, 
});

// Adjunta automáticamente el token si el usuario inició sesión
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;