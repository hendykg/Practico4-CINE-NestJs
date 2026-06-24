import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client.js';

export default function Confirmacion() {
  const navigate = useNavigate();
  const seleccion = JSON.parse(sessionStorage.getItem('seleccionAsientos') || 'null');
  const [movieSelection] = [JSON.parse(sessionStorage.getItem('movieSelection') || 'null')];

  const confirmarCompra = async () => {
    if (!seleccion) {
      alert('No hay una seleccion activa.');
      return;
    }

    try {
      await apiClient.post('/reservas', {
        funcionId: Number(seleccion.funcionId),
        asientos: seleccion.asientos,
      });

      alert('Reserva confirmada con exito.');
      sessionStorage.removeItem('seleccionAsientos');
      sessionStorage.removeItem('movieSelection');
      navigate('/mis-reservas');
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo confirmar la reserva.');
    }
  };

  if (!seleccion) {
    return <p className="text-white">No hay una reserva pendiente.</p>;
  }

  return (
    <div style={{ maxWidth: '540px', margin: '40px auto', background: '#222', padding: '30px', color: 'white', borderRadius: '8px' }}>
      <h2>Resumen de Compra</h2>
      <p>Pelicula: {movieSelection?.movie?.titulo || 'Sin pelicula'}</p>
      <p>Funcion: {movieSelection?.showtime?.fechaHora ? new Date(movieSelection.showtime.fechaHora).toLocaleString() : 'Sin funcion'}</p>
      <p>Total a pagar: Bs. {seleccion.total || 0}</p>
      <p>Asientos seleccionados: {seleccion.asientos.length}</p>
      <ul>
        {seleccion.asientos.map((seat) => (
          <li key={`${seat.fila}-${seat.columna}`}>Fila {seat.fila}, Columna {seat.columna}</li>
        ))}
      </ul>
      <button onClick={confirmarCompra} style={{ width: '100%', padding: '15px', background: '#E50914', color: 'white', border: 'none', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
        Confirmar y finalizar
      </button>
    </div>
  );
}
