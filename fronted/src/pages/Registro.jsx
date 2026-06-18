import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nombre: '', email: '', contrasena: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await res.json();

            if (res.ok) {
                alert('¡Registro exitoso! Ahora inicia sesión.');
                navigate('/login');
            } else {
                // Si el backend rechaza los datos por validación, te avisará exactamente por qué aquí
                alert(`Error al registrar usuario: ${data.message || 'Datos inválidos'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo conectar con el servidor backend.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', color: 'white' }}>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* CORRECCIÓN: Se agregó la propiedad value en cada input */}
                <input 
                    type="text" 
                    placeholder="Nombre completo" 
                    value={formData.nombre}
                    required 
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                    style={{ padding: '10px', color: 'black' }} 
                />
                
                <input 
                    type="email" 
                    placeholder="Correo" 
                    value={formData.email}
                    required 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    style={{ padding: '10px', color: 'black' }} 
                />
                
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={formData.contrasena}
                    required 
                    onChange={(e) => setFormData({...formData, contrasena: e.target.value})} 
                    style={{ padding: '10px', color: 'black' }} 
                />
                
                <button type="submit" style={{ padding: '10px', background: '#E50914', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Registrarse
                </button>
            </form>
            <p style={{ marginTop: '15px' }}>¿Ya tienes cuenta? <Link to="/login" style={{ color: '#E50914' }}>Inicia sesión aquí</Link></p>
        </div>
    );
}