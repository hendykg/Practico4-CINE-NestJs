// src/pages/Cartelera.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/index.css'; // Mantiene tus estilos nativos

const apiData = {
  "carousel": [
    { "img": "https://pbs.twimg.com/media/G4WyJUwbwAAxXH9.jpg", "title": "Doctor Who Christmas Special 2026" },
    { "img": "https://www.themoviedb.org/t/p/w1280/qbImUt1d3itXcB81BCItPZlfbyr.jpg", "title": "One Piece Banner" },
    { "img": "https://www.themoviedb.org/t/p/w1280/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg", "title": "Banner Película 1" }
  ],
  "cartelera": [
    {
      "id": "1",
      "titulo": "Nada es lo que parece 3",
      "poster": "https://image.tmdb.org/t/p/w500/hUu9zyZmDD8lz7XHkdAdxUn5gse.jpg",
      "sinopsis": "Los Cuatro Jinetes regresan para una nueva generación de magos, llevando la ilusión a nuevos extremos.",
      "duracion": 115,
      "genero": "Suspenso, Thriller",
      "clasificacion": "TP",
      "funciones": [
        {"id": "1-1", "hora": "14:00"},
        {"id": "1-2", "hora": "17:30"},
        {"id": "1-3", "hora": "21:00"}
      ]
    },
    {
      "id": "2",
      "titulo": "Spider-Man: Across the Spider-Verse",
      "poster": "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      "sinopsis": "Miles Morales se catapulta a través del Multiverso y se encuentra con un equipo de Spider-Gente encargado de proteger su existencia.",
      "duracion": 140,
      "genero": "Animación, Acción",
      "clasificacion": "Todo Público",
      "funciones": [
        {"id": "2-1", "hora": "15:00"},
        {"id": "2-2", "hora": "18:15"},
        {"id": "2-3", "hora": "21:30"}
      ]
    },
    {
      "id": "3",
      "titulo": "Kung Fu Panda 4",
      "poster": "https://image.tmdb.org/t/p/w500/kDp1vUBnMwdztzSDUEgRRjhhRO0.jpg",
      "sinopsis": "Po debe entrenar a un nuevo guerrero mientras se enfrenta a una hechicera malvada que puede cambiar de forma.",
      "duracion": 94,
      "genero": "Infantil, Animación",
      "clasificacion": "Todo Público",
      "funciones": [
        {"id": "3-1", "hora": "11:00"},
        {"id": "3-2", "hora": "13:00"}
      ]
    },
    {
      "id": "4",
      "titulo": "Dune: Parte Dos",
      "poster": "https://image.tmdb.org/t/p/w500/cxevDYdeFkiixRShbObdwAHWH0d.jpg",
      "sinopsis": "Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.",
      "duracion": 166,
      "genero": "Ciencia Ficción, Aventura",
      "clasificacion": "+14",
      "funciones": [
        {"id": "4-1", "hora": "19:00"},
        {"id": "4-2", "hora": "22:00"}
      ]
    }
  ]
};

export default function Cartelera() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Efecto rotativo automático para emular el carrusel CSS de tu index.html
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % apiData.carousel.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSeleccionarFuncion = (movieId, funcion) => {
    // Redirige a la pantalla de selección de asientos pasándole la función seleccionada
    navigate(`/asientos/${funcion.id}`, { state: { movieId, hora: funcion.hora } });
  };

  return (
    <main className="main-content">
      {/* 🎪 SECCIÓN CAROUSEL DINÁMICO */}
      <section className="carousel-section" style={{ overflow: 'hidden', position: 'relative', height: '400px' }}>
        {apiData.carousel.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <img src={slide.img} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '10px 20px', borderRadius: '5px' }}>
              <h3 style={{ color: '#white', margin: 0 }}>{slide.title}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* 🎬 SECCIÓN CARTELERA DE PELÍCULAS */}
      <section className="movie-grid-section" style={{ marginTop: '40px' }}>
        <h2 style={{ color: '#E50914', marginBottom: '20px', letterSpacing: '1px' }}>EN CARTELERA</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {apiData.cartelera.map((movie) => (
            <article key={movie.id} className="movie-card" style={{ background: '#1c1c1c', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              <div className="movie-poster" style={{ position: 'relative' }}>
                <img src={movie.poster} alt={movie.titulo} style={{ width: '100%', height: '380px', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#E50914', padding: '5px 10px', borderRadius: '3px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  {movie.clasificacion}
                </span>
              </div>

              <div className="movie-info" style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: '#fff' }}>{movie.titulo}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '5px 0' }}><strong>Género:</strong> {movie.genero}</p>
                  <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '5px 0' }}><strong>Duración:</strong> {movie.duracion} min</p>
                  <p style={{ fontSize: '0.9rem', color: '#ddd', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: '10px' }}>
                    {movie.sinopsis}
                  </p>
                </div>

                {/* ⏱️ HORARIOS DISPONIBLES */}
                <div style={{ marginTop: '15px' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#E50914', marginBottom: '8px' }}>Funciones:</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {movie.funciones.map((fun) => (
                      <button
                        key={fun.id}
                        onClick={() => handleSeleccionarFuncion(movie.id, fun)}
                        style={{
                          background: '#333',
                          color: '#fff',
                          border: '1px solid #444',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#E50914'}
                        onMouseOut={(e) => e.target.style.background = '#333'}
                      >
                        {fun.hora}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}