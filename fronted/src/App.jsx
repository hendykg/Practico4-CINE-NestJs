import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Registro.jsx';
import Cartelera from './pages/Cartelera.jsx';
import DetallePelicula from './pages/DetallePelicula.jsx';
import Asientos from './pages/Asientos.jsx';
import Confirmacion from './pages/Confirmacion.jsx';
import MisReservas from './pages/MisReservas.jsx';
import AdminMovies from './pages/AdminMovies.jsx';
import AdminRooms from './pages/AdminRooms.jsx';
import AdminShowtimes from './pages/AdminShowtimes.jsx';
import './App.css';

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center text-white py-5">Cargando aplicacion...</div>;
  }

  return (
    <div className="app-shell">
      <AppNavbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Cartelera />} />
          <Route path="/pelicula/:id" element={<DetallePelicula />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/registro" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />

          <Route element={<ProtectedRoute requiredRole="administrador" />}>
            <Route path="/admin/movies" element={<AdminMovies />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/showtimes" element={<AdminShowtimes />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/asientos" element={<Asientos />} />
            <Route path="/confirmacion" element={<Confirmacion />} />
            <Route path="/mis-reservas" element={<MisReservas />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
