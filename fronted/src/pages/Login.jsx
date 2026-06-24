import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', contrasena: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const usuario = await login(formData.email, formData.contrasena);
      navigate(usuario.rol === 'administrador' ? '/admin/movies' : '/');
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo iniciar sesion.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', color: 'white', padding: '20px' }}>
      <h2>Inicio de Sesion</h2>
      <p style={{ color: '#bbb' }}>Admin demo: admin@cinekalaf.com / Admin123!</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
