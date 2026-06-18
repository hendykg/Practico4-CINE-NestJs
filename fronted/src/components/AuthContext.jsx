// src/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 // Dentro de tu src/components/AuthContext.jsx (Verifica que use user.rol)
useEffect(() => {
  const savedUser = sessionStorage.getItem('user');
  const token = localStorage.getItem('auth_token');
  if (savedUser && token) {
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    setIsAuthenticated(true);
  }
}, []);
  const logout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout, setUser, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}