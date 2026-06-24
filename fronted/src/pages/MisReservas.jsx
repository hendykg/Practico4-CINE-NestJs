import { useEffect, useState } from 'react';
import apiClient from '../api/client.js';
import { formatDateTime } from '../utils/date.js';
import { formatSeat } from '../utils/seats.js';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const reservasAgrupadas = reservas.reduce((acc, reserva) => {
    const key = `${reserva.funcionId}-${reserva.fechaReserva}`;
    const existing = acc.find((item) => item.key === key);

    if (existing) {
      existing.asientos.push({ fila: reserva.fila, columna: reserva.columna });
      return acc;
    }

    acc.push({
      key,
      pelicula: reserva.pelicula,
      sala: reserva.sala,
      funcion: reserva.funcion,
      fechaReserva: reserva.fechaReserva,
      asientos: [{ fila: reserva.fila, columna: reserva.columna }],
    });

    return acc;
  }, []);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await apiClient.get('/reservas');
        setReservas(response.data);
      } catch (_error) {
        alert('No se pudieron cargar tus reservas.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  if (loading) {
    return <p className="text-white">Cargando reservas...</p>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: '#E50914' }}>Mis Reservas</h2>

      {reservasAgrupadas.length === 0 ? (
        <p style={{ color: 'white' }}>Todavia no tienes reservas realizadas.</p>
      ) : (
        reservasAgrupadas.map((reserva) => (
          <div key={reserva.key} style={{ background: '#222', padding: '20px', margin: '15px 0', color: 'white', borderRadius: '8px' }}>
            <h3>{reserva.pelicula?.titulo}</h3>
            <p>Sala: {reserva.sala?.nombre}</p>
            <p>Funcion: {reserva.funcion?.fechaHora ? formatDateTime(reserva.funcion.fechaHora) : '-'}</p>
            <p>
              Asientos:{' '}
              {reserva.asientos
                .map((asiento) => formatSeat(asiento))
                .join(' | ')}
            </p>
            <p>Reservado el: {formatDateTime(reserva.fechaReserva)}</p>
          </div>
        ))
      )}
    </div>
  );
}
