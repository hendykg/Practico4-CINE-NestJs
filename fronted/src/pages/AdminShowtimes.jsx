import { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import apiClient from '../api/client.js';

export default function AdminShowtimes() {
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({ peliculaId: '', salaId: '', fechaHora: '', precioEntrada: '' });

  useEffect(() => {
    const fetchData = async () => {
      const [resMovies, resRooms] = await Promise.all([
        apiClient.get('/peliculas'),
        apiClient.get('/salas')
      ]);
      setMovies(resMovies.data);
      setRooms(resRooms.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        peliculaId: Number(formData.peliculaId),
        salaId: Number(formData.salaId),
        fechaHora: new Date(formData.fechaHora).toISOString(),
        precioEntrada: Number(formData.precioEntrada)
      };
      await apiClient.post('/funciones', payload);
      alert('Función programada con éxito en NestJS');
    } catch (error) {
      if(error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Error al programar la función');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2>Programar Función</h2>
      <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light text-dark">
        <Form.Group className="mb-3">
          <Form.Label>Película</Form.Label>
          <Form.Select onChange={e => setFormData({...formData, peliculaId: e.target.value})} required>
            <option value="">Selecciona una película...</option>
            {movies.map(m => <option key={m.id} value={m.id}>{m.titulo}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sala</Form.Label>
          <Form.Select onChange={e => setFormData({...formData, salaId: e.target.value})} required>
            <option value="">Selecciona una sala...</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.nombre} (Capacidad: {r.capacidadTotal})</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha y Hora</Form.Label>
          <Form.Control type="datetime-local" onChange={e => setFormData({...formData, fechaHora: e.target.value})} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio de Entrada (Bs.)</Form.Label>
          <Form.Control type="number" step="0.01" onChange={e => setFormData({...formData, precioEntrada: e.target.value})} required />
        </Form.Group>

        <Button type="submit" variant="danger">Guardar Función</Button>
      </Form>
    </Container>
  );
}