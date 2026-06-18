// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// CORRECCIÓN: Una sola importación limpia apuntando a la ubicación real
import { AuthProvider, useAuth } from './components/AuthContext.jsx';

// --- IMPORTACIONES DE PÁGINAS (AUTENTICACIÓN) ---
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Registro.jsx';

// --- IMPORTACIONES DE PÁGINAS (CLIENTE/PÚBLICAS) ---
import Cartelera from './pages/Cartelera.jsx';
import DetallePelicula from './pages/DetallePelicula.jsx';
import Asientos from './pages/Asientos.jsx';
import Confirmacion from './pages/Confirmacion.jsx';
import MisReservas from './pages/MisReservas.jsx';

// --- IMPORTACIONES DE PÁGINAS (ADMINISTRADOR) ---
import AdminMovies from './pages/AdminMovies.jsx';
import AdminRooms from './pages/AdminRooms.jsx';
import AdminShowtimes from './pages/AdminShowtimes.jsx';

import './App.css'; 

// Componente interno para manejar las rutas y el estado de autenticación
function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <AppNavbar />
      <main className="container py-4">
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/" element={<Cartelera />} />
          <Route path="/pelicula/:id" element={<DetallePelicula />} />
          
          {/* Evitamos que el usuario logueado vuelva a ver el Login/Registro */}
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/registro" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />

          {/* --- RUTAS PROTEGIDAS: SOLO ADMINISTRADOR --- */}
          <Route element={<ProtectedRoute requiredRole="administrador" />}>
            <Route path="/admin/movies" element={<AdminMovies />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/showtimes" element={<AdminShowtimes />} />
          </Route>

          {/* --- RUTAS PROTEGIDAS: SOLO CLIENTES --- */}
          <Route element={<ProtectedRoute requiredRole="cliente" />}>
            <Route path="/asientos" element={<Asientos />} />
            <Route path="/confirmacion" element={<Confirmacion />} />
            <Route path="/mis-reservas" element={<MisReservas />} />
          </Route>

          {/* Ruta comodín 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// Componente principal exportado
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}