import { useNavigate } from 'react-router-dom';

export default function Confirmacion() {
    const navigate = useNavigate();
    const seleccion = JSON.parse(sessionStorage.getItem('seleccionAsientos'));
    // Recuperamos los datos del usuario logueado
    const usuarioLogueado = JSON.parse(sessionStorage.getItem('user') || '{}');

    const confirmarCompra = async () => {
        const token = localStorage.getItem('auth_token');
        if (!seleccion) return alert("No hay una selección activa.");

        try {
            // Para el ejemplo en memoria, procesamos el primer asiento seleccionado en tu grilla
            const res = await fetch('http://localhost:3000/api/reservas', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    funcionId: Number(seleccion.showtime_id),
                    usuarioId: Number(usuarioLogueado.id || 1), // Asegura un ID de usuario activo
                    fila: Number(seleccion.seats[0]?.row || 1),
                    columna: Number(seleccion.seats[0]?.column || 1)
                })
            });

            if (res.ok) {
                alert('¡Reserva confirmada con éxito en NestJS!');
                sessionStorage.removeItem('seleccionAsientos');
                navigate('/mis-reservas');
            } else {
                const error = await res.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) { 
            console.error("Error al confirmar reserva:", error); 
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', background: '#222', padding: '30px', color: 'white', borderRadius: '8px' }}>
            <h2>Resumen de Compra (NestJS)</h2>
            <p>Total a pagar: Bs. {seleccion?.total || 0}</p>
            <p>Asientos seleccionados: {seleccion?.seats?.length || 0}</p>
            <button onClick={confirmarCompra} style={{ width: '100%', padding: '15px', background: '#E50914', color: 'white', border: 'none', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                Confirmar y Finalizar
            </button>
        </div>
    );
}