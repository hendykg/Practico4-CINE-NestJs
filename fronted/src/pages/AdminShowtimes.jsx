import { useEffect, useState } from 'react';
import { Button, Container, Form, Table } from 'react-bootstrap';
import apiClient from '../api/client.js';

const initialForm = { peliculaId: '', salaId: '', fechaHora: '', precioEntrada: '' };

export default function AdminShowtimes() {
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const [moviesResponse, roomsResponse, showtimesResponse] = await Promise.all([
      apiClient.get('/peliculas'),
      apiClient.get('/salas'),
      apiClient.get('/funciones'),
    ]);

    setMovies(moviesResponse.data);
    setRooms(roomsResponse.data);
    setShowtimes(showtimesResponse.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      peliculaId: Number(formData.peliculaId),
      salaId: Number(formData.salaId),
      fechaHora: new Date(formData.fechaHora).toISOString(),
      precioEntrada: Number(formData.precioEntrada),
    };

    try {
      if (editingId) {
        await apiClient.patch(`/funciones/${editingId}`, payload);
        alert('Funcion actualizada correctamente.');
      } else {
        await apiClient.post('/funciones', payload);
        alert('Funcion creada correctamente.');
      }

      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo guardar la funcion.');
    }
  };

  const handleEdit = (showtime) => {
    setEditingId(showtime.id);
    setFormData({
      peliculaId: String(showtime.peliculaId),
      salaId: String(showtime.salaId),
      fechaHora: new Date(showtime.fechaHora).toISOString().slice(0, 16),
      precioEntrada: String(showtime.precioEntrada),
    });
  };

  const handleDelete = async (showtimeId) => {
    if (!window.confirm('¿Eliminar esta funcion y sus reservas asociadas?')) {
      return;
    }

    try {
      await apiClient.delete(`/funciones/${showtimeId}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo eliminar la funcion.');
    }
  };

  return (
    <Container className="mt-4 text-white">
      <h2>Gestion de Funciones</h2>

      <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light text-dark mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Pelicula</Form.Label>
          <Form.Select value={formData.peliculaId} onChange={(event) => setFormData({ ...formData, peliculaId: event.target.value })} required>
            <option value="">Selecciona una pelicula...</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.titulo}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sala</Form.Label>
          <Form.Select value={formData.salaId} onChange={(event) => setFormData({ ...formData, salaId: event.target.value })} required>
            <option value="">Selecciona una sala...</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.nombre} - capacidad {room.capacidadTotal}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha y hora</Form.Label>
          <Form.Control type="datetime-local" value={formData.fechaHora} onChange={(event) => setFormData({ ...formData, fechaHora: event.target.value })} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio de entrada</Form.Label>
          <Form.Control type="number" min="1" step="0.01" value={formData.precioEntrada} onChange={(event) => setFormData({ ...formData, precioEntrada: event.target.value })} required />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" variant="danger">
            {editingId ? 'Guardar cambios' : 'Crear funcion'}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancelar edicion
            </Button>
          )}
        </div>
      </Form>

      <Table striped bordered hover variant="dark" responsive>
        <thead>
          <tr>
            <th>Pelicula</th>
            <th>Sala</th>
            <th>Fecha y hora</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {showtimes.map((showtime) => (
            <tr key={showtime.id}>
              <td>{showtime.pelicula?.titulo}</td>
              <td>{showtime.sala?.nombre}</td>
              <td>{new Date(showtime.fechaHora).toLocaleString()}</td>
              <td>Bs. {showtime.precioEntrada}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="warning" onClick={() => handleEdit(showtime)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(showtime.id)}>
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
