import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client.js';
import '../assets/css/haciendo.css';
import '../assets/css/index.css';
import { formatDateTime } from '../utils/date.js';
import { getSeatRowLabel } from '../utils/seats.js';

export default function Asientos() {
  const navigate = useNavigate();
  const [movieInfo, setMovieInfo] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionMovie = JSON.parse(sessionStorage.getItem('movieSelection') || 'null');

    if (!sessionMovie?.showtime?.id) {
      navigate('/');
      return;
    }

    setMovieInfo(sessionMovie);

    const fetchOccupiedSeats = async () => {
      try {
        const response = await apiClient.get(`/reservas/ocupados/funcion/${sessionMovie.showtime.id}`);
        setOccupiedSeats(response.data.map((seat) => `${seat.fila}-${seat.columna}`));
      } catch (_error) {
        alert('No se pudieron cargar los asientos ocupados.');
      } finally {
        setLoading(false);
      }
    };

    fetchOccupiedSeats();
  }, [navigate]);

  if (!movieInfo) {
    return null;
  }

  const totalFilas = movieInfo.showtime?.sala?.filas || 0;
  const totalColumnas = movieInfo.showtime?.sala?.columnas || 0;

  const handleSeatClick = (fila, columna) => {
    const seatId = `${fila}-${columna}`;

    if (occupiedSeats.includes(seatId)) {
      return;
    }

    setSelectedSeats((current) =>
      current.includes(seatId)
        ? current.filter((seat) => seat !== seatId)
        : [...current, seatId],
    );
  };

  const handleConfirmar = () => {
    if (selectedSeats.length === 0) {
      alert('Debes seleccionar al menos un asiento.');
      return;
    }

    const asientos = selectedSeats.map((seat) => {
      const [fila, columna] = seat.split('-');
      return { fila: Number(fila), columna: Number(columna) };
    });

    sessionStorage.setItem(
      'seleccionAsientos',
      JSON.stringify({
        funcionId: movieInfo.showtime.id,
        asientos,
        total: asientos.length * Number(movieInfo.showtime.precioEntrada),
      }),
    );

    navigate('/confirmacion');
  };

  return (
    <div className="cinema">
      <h2 className="text-center">{movieInfo.movie.titulo}</h2>
      <p className="text-center text-light">Funcion: {formatDateTime(movieInfo.showtime.fechaHora)}</p>
      <p className="text-center text-light">Sala: {movieInfo.showtime.sala?.nombre}</p>

      <div className="Screen">PANTALLA</div>

      {loading ? (
        <p className="text-white text-center">Cargando asientos...</p>
      ) : (
        <div className="map">
          {Array.from({ length: totalFilas }, (_, filaIndex) => {
            const fila = filaIndex + 1;

            return (
              <div key={fila} className="seat-row">
                <span style={{ width: '20px', color: '#aaa', marginRight: '10px' }}>{getSeatRowLabel(fila)}</span>
                {Array.from({ length: totalColumnas }, (_, columnaIndex) => {
                  const columna = columnaIndex + 1;
                  const seatId = `${fila}-${columna}`;
                  const seatClass = occupiedSeats.includes(seatId)
                    ? 'seat occupied'
                    : selectedSeats.includes(seatId)
                      ? 'seat selected'
                      : 'seat';

                  return (
                    <div
                      key={seatId}
                      className={seatClass}
                      onClick={() => handleSeatClick(fila, columna)}
                      title={`Fila ${getSeatRowLabel(fila)}, Butaca ${columna}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      <div className="legend justify-content-center">
        <div className="legend-item"><div className="seat"></div><span>Disponible</span></div>
        <div className="legend-item"><div className="seat selected"></div><span>Seleccionado</span></div>
        <div className="legend-item"><div className="seat occupied"></div><span>Ocupado</span></div>
      </div>

      <div className="text-center mt-4" style={{ color: 'white' }}>
        <p>Asientos seleccionados: <strong>{selectedSeats.length}</strong></p>
        <p>Precio por entrada: <strong>Bs. {movieInfo.showtime.precioEntrada}</strong></p>
        <h4 className="text-danger">Total: Bs. {selectedSeats.length * Number(movieInfo.showtime.precioEntrada)}</h4>
      </div>

      <button className="btn-confirmar mt-3" onClick={handleConfirmar}>
        Ir al resumen de reserva
      </button>
    </div>
  );
}
