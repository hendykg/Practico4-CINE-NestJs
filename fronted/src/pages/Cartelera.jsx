import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client.js';
import { buildMediaUrl } from '../utils/media.js';

export default function Cartelera() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ nombre: '', genero: '' });

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      setLoading(true);

      try {
        const params = {};

        if (filters.nombre.trim()) {
          params.nombre = filters.nombre.trim();
        }

        if (filters.genero) {
          params.genero = filters.genero;
        }

        const response = await apiClient.get('/peliculas', {
          params,
          signal: controller.signal,
        });
        setMovies(response.data);
      } catch (error) {
        if (error.name !== 'CanceledError') {
          alert('No se pudo cargar la cartelera.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();

    return () => controller.abort();
  }, [filters]);

  const generos = useMemo(() => {
    const uniques = new Set(movies.map((movie) => movie.genero));
    return [...uniques].sort((a, b) => a.localeCompare(b));
  }, [movies]);

  return (
    <div>
      <section className="mb-4 p-4 rounded" style={{ background: '#171717' }}>
        <h1 className="text-danger">Cartelera</h1>
        <p className="text-light mb-4">Consulta peliculas, busca por nombre y filtra por genero.</p>

        <div className="row g-3">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar pelicula por nombre"
              value={filters.nombre}
              onChange={(event) => setFilters({ ...filters, nombre: event.target.value })}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={filters.genero}
              onChange={(event) => setFilters({ ...filters, genero: event.target.value })}
            >
              <option value="">Todos los generos</option>
              {generos.map((genero) => (
                <option key={genero} value={genero}>
                  {genero}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {loading ? (
        <p className="text-white">Cargando cartelera...</p>
      ) : movies.length === 0 ? (
        <p className="text-white">No se encontraron peliculas para ese filtro.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 align-items-stretch">
          {movies.map((movie) => (
            <div className="col" key={movie.id}>
              <article className="card h-100 bg-dark text-white border-secondary">
                <img
                  src={buildMediaUrl(movie.imagenPoster)}
                  alt={movie.titulo}
                  className="card-img-top"
                  style={{ height: '420px', objectFit: 'cover', backgroundColor: '#1f1f1f' }}
                />

                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                    <h3 className="card-title h5 mb-0">{movie.titulo}</h3>
                    <span className="badge text-bg-danger">{movie.clasificacion}</span>
                  </div>

                  <p className="mb-1 text-secondary">Genero: {movie.genero}</p>
                  <p className="mb-3 text-secondary">Duracion: {movie.duracion} min</p>
                  <p className="card-text flex-grow-1">{movie.sinopsis}</p>

                  <Link to={`/pelicula/${movie.id}`} className="btn btn-danger mt-3">
                    Ver detalle y funciones
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
