// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', contrasena: '' });

    const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚀 ACCESO DIRECTO DE PRUEBA CORREGIDO PARA ADMINISTRADOR
    if (formData.email.includes('@dmin')) {
        const mockAdminUser = {
            id: 999,
            nombre: 'Administrador Maestro', // Sincronizado con tu modelo Usuario
            email: formData.email,
            rol: 'administrador' // 👈 CORRECCIÓN: 'administrador' en vez de role: 'admin'
        };
        localStorage.setItem('auth_token', 'mock-admin-token-12345');
        sessionStorage.setItem('user', JSON.stringify(mockAdminUser));
        alert('Acceso directo concedido como Administrador');
        navigate('/');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();

        if (res.ok && data.token) {
            localStorage.setItem('auth_token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.usuario));
            navigate('/');
        } else {
            alert(data.message || 'Credenciales inválidas');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo conectar con el servidor backend');
    }
};

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', color: 'white', padding: '20px' }}>
            <h2>Inicio de Sesión (Cine-Kalaf)</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Correo (Prueba: admin@dmin)" 
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
                    Ingresar
                </button>
            </form>
        </div>
    );
}