import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client.js';
import { useAuth } from '../components/AuthContext.jsx';
import { formatDate, formatTime } from '../utils/date.js';
import { buildMediaUrl } from '../utils/media.js';

export default function DetallePelicula() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      setLoading(true);

      try {
        const response = await apiClient.get(`/peliculas/${id}`);
        setPelicula(response.data);
      } catch (_error) {
        alert('No se pudo cargar el detalle de la pelicula.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [id]);

  const seleccionarFuncion = (funcion) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesion para reservar entradas.');
      navigate('/login');
      return;
    }

    sessionStorage.setItem('movieSelection', JSON.stringify({ movie: pelicula, showtime: funcion }));
    navigate('/asientos');
  };

  if (loading) {
    return <p className="text-white">Cargando detalles...</p>;
  }

  if (!pelicula) {
    return <p className="text-white">No se encontro la pelicula.</p>;
  }

  return (
    <div className="row g-4 text-white">
      <div className="col-lg-4">
        <img
          src={buildMediaUrl(pelicula.imagenPoster)}
          alt={pelicula.titulo}
          className="img-fluid rounded shadow"
        />
      </div>

      <div className="col-lg-8">
        <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
          <h1 className="mb-0">{pelicula.titulo}</h1>
          <span className="badge text-bg-danger">{pelicula.clasificacion}</span>
        </div>

        <p className="mb-2">Duracion: {pelicula.duracion} min</p>
        <p className="mb-3">Genero: {pelicula.genero}</p>
        <p className="text-light">{pelicula.sinopsis}</p>

        <hr className="border-secondary" />

        <h2 className="h4 text-danger mb-3">Funciones disponibles</h2>

        {pelicula.funciones?.length ? (
          <div className="d-flex flex-column gap-3">
            {pelicula.funciones.map((funcion) => (
              <div key={funcion.id} className="border border-secondary rounded p-3 bg-dark">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <div>
                    <div className="fw-bold">{funcion.sala?.nombre}</div>
                    <div className="text-secondary small">{formatDate(funcion.fechaHora)}</div>
                  </div>
                  <div className="text-end">
                    <div className="text-danger fw-bold">Bs. {funcion.precioEntrada}</div>
                    <div className="text-secondary small">Entrada general</div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={() => seleccionarFuncion(funcion)}
                    style={{ minWidth: '110px', fontWeight: 'bold' }}
                  >
                    {formatTime(funcion.fechaHora)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay funciones disponibles para esta pelicula.</p>
        )}
      </div>
    </div>
  );
}
