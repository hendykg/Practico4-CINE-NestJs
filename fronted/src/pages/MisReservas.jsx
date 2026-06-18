import { useState, useEffect } from 'react';

export default function MisReservas() {
    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        const fetchReservas = async () => {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('http://localhost:3000/api/reservas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setReservas(await res.json());
        };
        fetchReservas();
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ color: '#E50914' }}>Mis Reservas</h2>
            {reservas.length === 0 ? <p style={{ color: 'white' }}>No tienes reservas guardadas en el servidor.</p> : (
                reservas.map(res => (
                    <div key={res.id} style={{ background: '#222', padding: '20px', margin: '15px 0', color: 'white' }}>
                        <h3>Reserva de Asiento</h3>
                        <p>Fila: {res.fila}</p>
                        <p>Columna: {res.columna}</p>
                    </div>
                ))
            )}
        </div>
    );
}