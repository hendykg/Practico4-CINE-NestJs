import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function ProtectedRoute({ requiredRole }) {
  const { user, isAuthenticated } = useAuth();

  // Si no está logueado, directo al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol del usuario no coincide con el requerido por la ruta, lo devuelve al inicio
  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Si pasa las validaciones, renderiza la página interna
  return <Outlet />;
}