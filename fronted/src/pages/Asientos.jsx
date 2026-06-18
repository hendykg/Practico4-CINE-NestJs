import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client.js'; 
import '../assets/css/haciendo.css';
import '../assets/css/index.css';

export default function Asientos() {
  const navigate = useNavigate();
  const [movieInfo, setMovieInfo] = useState({});
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Datos simulados de la capacidad de la sala si no vienen del backend (Ej: 8 filas x 10 columnas)
  const totalFilas = movieInfo?.showtime?.sala?.filas || 8;
  const totalColumnas = movieInfo?.showtime?.sala?.columnas || 10;

  useEffect(() => {
    const sessionMovie = JSON.parse(sessionStorage.getItem('movieSelection') || '{}');
    setMovieInfo(sessionMovie);

    const fetchOccupiedSeats = async () => {
      if (sessionMovie?.showtime?.id) {
        try {
          // Apunta a /api/reservas del controlador de NestJS
          const res = await apiClient.get('/reservas'); 
          
          // Filtramos las reservas asociadas a esta función exacta
          const reservasFuncion = res.data.filter(r => r.funcionId === sessionMovie.showtime.id);
          
          // Convierte { fila: 5, columna: 6 } al formato string "5-6" para la grilla visual
          const ocupados = reservasFuncion.map(seat => `${seat.fila}-${seat.columna}`);
          setOccupiedSeats(ocupados);
        } catch (error) {
          console.error("Error cargando asientos desde NestJS", error);
        }
      }
    };
    
    fetchOccupiedSeats();

    const savedSelection = JSON.parse(sessionStorage.getItem('seleccionAsientos') || '{}');
    if (savedSelection.asientos) {
      setSelectedSeats(savedSelection.asientos);
    }
  }, []);

  // Lógica para seleccionar/deseleccionar un asiento un clic a la vez
  const handleSeatClick = (fila, columna) => {
    const seatId = `${fila}-${columna}`;
    if (occupiedSeats.includes(seatId)) return; // Si está ocupado, no hace nada

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmar = () => {
    if (selectedSeats.length === 0) {
      alert('Por favor, selecciona al menos un asiento.');
      return;
    }

    // Mapeamos los strings "5-6" de vuelta a objetos { row: 5, column: 6 } para el DTO
    const asientosMapeados = selectedSeats.map(seat => {
      const [fila, columna] = seat.split('-');
      return { row: Number(fila), column: Number(columna) };
    });

    const precioEntrada = Number(movieInfo?.showtime?.precioEntrada || 30);
    const totalPagar = selectedSeats.length * precioEntrada;

    // Guardamos la estructura limpia para la página de Confirmación
    sessionStorage.setItem('seleccionAsientos', JSON.stringify({
      showtime_id: movieInfo.showtime.id,
      seats: asientosMapeados,
      total: totalPagar
    }));

    navigate('/confirmacion');
  };

  // Renderizar la matriz gráfica de asientos basados en la configuración de la sala
  const renderGrid = () => {
    const filasAgrupadas = [];
    for (let f = 1; f <= totalFilas; f++) {
      const asientosFila = [];
      for (let c = 1; c <= totalColumnas; c++) {
        const seatId = `${f}-${c}`;
        let claseAsiento = 'seat';

        if (occupiedSeats.includes(seatId)) {
          claseAsiento += ' occupied';
        } else if (selectedSeats.includes(seatId)) {
          claseAsiento += ' selected';
        }

        asientosFila.push(
          <div
            key={seatId}
            className={claseAsiento}
            onClick={() => handleSeatClick(f, c)}
            title={`Fila ${f}, Asiento ${c}`}
          />
        );
      }
      filasAgrupadas.push(
        <div key={f} className="row">
          <span style={{ width: '20px', color: '#aaa', marginRight: '10px' }}>{f}</span>
          {asientosFila}
        </div>
      );
    }
    return filasAgrupadas;
  };

  return (
    <div className="cinema">
      <h2 className="text-center">{movieInfo?.movie?.titulo || 'Película'}</h2>
      <p className="text-center text-muted">
        Función: {movieInfo?.showtime?.fechaHora ? new Date(movieInfo.showtime.fechaHora).toLocaleString() : ''}
      </p>

      <div className="Screen">PANTALLA</div>

      <div className="map">
        {renderGrid()}
      </div>

      <div className="legend justify-content-center">
        <div className="legend-item"><div className="seat"></div><span>Disponible</span></div>
        <div className="legend-item"><div className="seat selected"></div><span>Tu Selección</span></div>
        <div className="legend-item"><div className="seat occupied"></div><span>Ocupado</span></div>
      </div>

      <div className="text-center mt-4" style={{ color: 'white' }}>
        <p>Asientos seleccionados: <strong>{selectedSeats.length}</strong></p>
        <p>Precio por entrada: <strong>Bs. {movieInfo?.showtime?.precioEntrada || 0}</strong></p>
        <h4 className="text-danger">Total: Bs. {selectedSeats.length * Number(movieInfo?.showtime?.precioEntrada || 0)}</h4>
      </div>

      <button className="btn-confirmar mt-3" onClick={handleConfirmar}>
        Ir al Resumen de Reserva
      </button>
    </div>
  );
}