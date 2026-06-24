import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';

export default function Registro() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ nombre: '', email: '', contrasena: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await register(formData);
      alert('Registro exitoso. Ahora inicia sesion.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo registrar el usuario.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', color: 'white' }}>
      <h2>Registro de Usuario</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={formData.nombre}
          required
          onChange={(event) => setFormData({ ...formData, nombre: event.target.value })}
          style={{ padding: '10px', color: 'black' }}
        />

        <input
          type="email"
          placeholder="Correo"
          value={formData.email}
          required
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
          style={{ padding: '10px', color: 'black' }}
        />

        <input
          type="password"
          placeholder="Contrasena"
          value={formData.contrasena}
          required
          onChange={(event) => setFormData({ ...formData, contrasena: event.target.value })}
          style={{ padding: '10px', color: 'black' }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '10px',
            background: '#E50914',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p style={{ marginTop: '15px' }}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" style={{ color: '#E50914' }}>
          Inicia sesion aqui
        </Link>
      </p>
    </div>
  );
}
