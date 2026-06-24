import { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get('/auth/me');
        setUser(response.data);
        setIsAuthenticated(true);
        sessionStorage.setItem('user', JSON.stringify(response.data));
      } catch (_error) {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (email, contrasena) => {
    const response = await apiClient.post('/auth/login', { email, contrasena });
    localStorage.setItem('auth_token', response.data.token);
    sessionStorage.setItem('user', JSON.stringify(response.data.usuario));
    setUser(response.data.usuario);
    setIsAuthenticated(true);
    return response.data.usuario;
  };

  const register = async (payload) => {
    return apiClient.post('/auth/register', payload);
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (_error) {
      // Si la sesion ya no existe, igual limpiamos el cliente.
    }

    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('movieSelection');
    sessionStorage.removeItem('seleccionAsientos');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
