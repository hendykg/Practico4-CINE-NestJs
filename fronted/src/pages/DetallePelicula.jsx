import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client.js';
import '../assets/css/index.css';

export default function DetallePelicula() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pelicula, setPelicula] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState('JUE 18/JUN');

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await apiClient.get(`/peliculas/${id}`);
        setPelicula(res.data);
      } catch (error) {
        console.error("Error al obtener película", error);
      }
    };
    fetchDetalle();
  }, [id]);

  const seleccionarFuncion = (funcion) => {
    if (!localStorage.getItem('auth_token')) {
      alert("Debes iniciar sesión para reservar entradas.");
      navigate('/login');
      return;
    }
    sessionStorage.setItem('movieSelection', JSON.stringify({ movie: pelicula, showtime: funcion }));
    navigate('/asientos');
  };

  if (!pelicula) return <h2 className="text-center mt-5" style={{ color: 'white' }}>Cargando detalles...</h2>;

  const dias = [
    { label: 'JUE', fecha: '18/JUN' },
    { label: 'VIE', fecha: '19/JUN' },
    { label: 'SÁB', fecha: '20/JUN' },
    { label: 'DOM', fecha: '21/JUN' },
    { label: 'LUN', fecha: '22/JUN' }
  ];

  return (
    <div style={{ display: 'flex', gap: '40px', maxWidth: '1100px', margin: '40px auto', padding: '20px', color: 'white' }}>
      {/* Columna Izquierda: Póster */}
      <div style={{ flex: '1', maxWidth: '320px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', textTransform: 'uppercase', fontWeight: 'bold' }}>{pelicula.titulo}</h1>
        <img src={pelicula.imagenPoster} alt={pelicula.titulo} style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.8)' }} />
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <span style={{ background: '#333', padding: '5px 15px', borderRadius: '4px', fontSize: '0.9rem' }}>{pelicula.duracion} min</span>
          <span style={{ background: '#E50914', padding: '5px 15px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>{pelicula.clasificacion}</span>
        </div>
        <span style={{ display: 'inline-block', marginTop: '15px', background: '#222', padding: '5px 10px', borderRadius: '4px', border: '1px solid #444' }}>🎬 {pelicula.genero}</span>
        <p style={{ marginTop: '20px', color: '#ccc', lineHeight: '1.6' }}>{pelicula.sinopsis}</p>
      </div>

      {/* Columna Derecha: Horarios al estilo de tu Imagen */}
      <div style={{ flex: '2' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px', letterSpacing: '1px' }}>HORARIOS</h2>
        
        {/* Selector de Días */}
        <div style={{ display: 'flex', background: '#1c1c1c', borderRadius: '6px', padding: '5px', gap: '5px', marginBottom: '20px' }}>
          {dias.map((d, i) => {
            const key = `${d.label} ${d.fecha}`;
            const activo = diaSeleccionado === key;
            return (
              <button
                key={i}
                onClick={() => setDiaSeleccionado(key)}
                style={{
                  flex: 1, padding: '12px', background: activo ? '#fff' : 'transparent',
                  color: activo ? '#000' : '#fff', border: 'none', borderRadius: '4px',
                  cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', transition: '0.3s'
                }}
              >
                <div style={{ fontSize: '0.8rem', opacity: activo ? 1 : 0.6 }}>{d.label}</div>
                <div style={{ fontSize: '1rem' }}>{d.fecha}</div>
              </button>
            );
          })}
        </div>

        {/* Filtros decorativos */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <select style={{ background: '#222', color: 'white', padding: '10px', border: '1px solid #444', borderRadius: '4px' }}><option>Formatos</option></select>
          <select style={{ background: '#222', color: 'white', padding: '10px', border: '1px solid #444', borderRadius: '4px' }}><option>Idioma</option></select>
        </div>

        <h3 style={{ fontSize: '1.2rem', color: '#E50914', marginBottom: '15px', textTransform: 'uppercase' }}>Horarios en Cinemark Ventura Mall</h3>
        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '20px' }}>📍 Dirección: 4to anillo esq. Av. San Martin, Ventura mall 2do piso.</p>

        {/* Grilla de Funciones cargadas desde tu Backend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
          {pelicula.funciones && pelicula.funciones.length > 0 ? (
            pelicula.funciones.map(funcion => (
              <div
                key={funcion.id}
                onClick={() => seleccionarFuncion(funcion)}
                className="time-slot"
                style={{
                  background: '#222', padding: '15px', borderRadius: '6px', cursor: 'pointer',
                  border: '1px solid #333', textAlign: 'center', transition: '0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#E50914'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                  {new Date(funcion.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}hs
                </div>
                <div style={{ fontSize: '0.85rem', color: '#E50914', marginTop: '5px' }}>Bs. {funcion.precioEntrada}</div>
              </div>
            ))
          ) : (
            <p style={{ color: '#aaa', fontStyle: 'italic' }}>No hay funciones de NestJS para este día.</p>
          )}
        </div>
      </div>
    </div>
  );
}