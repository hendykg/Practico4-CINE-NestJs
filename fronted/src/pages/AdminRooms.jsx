import { useEffect, useState } from 'react';
import { Button, Container, Form, Table } from 'react-bootstrap';
import apiClient from '../api/client.js';

const initialForm = { nombre: '', filas: '', columnas: '' };

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchRooms = async () => {
    const response = await apiClient.get('/salas');
    setRooms(response.data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      nombre: formData.nombre,
      filas: Number(formData.filas),
      columnas: Number(formData.columnas),
    };

    try {
      if (editingId) {
        await apiClient.patch(`/salas/${editingId}`, payload);
        alert('Sala actualizada correctamente.');
      } else {
        await apiClient.post('/salas', payload);
        alert('Sala creada correctamente.');
      }

      resetForm();
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo guardar la sala.');
    }
  };

  const handleEdit = (room) => {
    setEditingId(room.id);
    setFormData({
      nombre: room.nombre,
      filas: String(room.filas),
      columnas: String(room.columnas),
    });
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('¿Eliminar esta sala y sus funciones asociadas?')) {
      return;
    }

    try {
      await apiClient.delete(`/salas/${roomId}`);
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo eliminar la sala.');
    }
  };

  return (
    <Container className="mt-4 text-white">
      <h2>Gestion de Salas</h2>

      <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light text-dark">
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control value={formData.nombre} onChange={(event) => setFormData({ ...formData, nombre: event.target.value })} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Filas</Form.Label>
          <Form.Control type="number" min="1" value={formData.filas} onChange={(event) => setFormData({ ...formData, filas: event.target.value })} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Columnas</Form.Label>
          <Form.Control type="number" min="1" value={formData.columnas} onChange={(event) => setFormData({ ...formData, columnas: event.target.value })} required />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" variant="danger">
            {editingId ? 'Guardar cambios' : 'Crear sala'}
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
            <th>Nombre</th>
            <th>Filas</th>
            <th>Columnas</th>
            <th>Capacidad total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.nombre}</td>
              <td>{room.filas}</td>
              <td>{room.columnas}</td>
              <td>{room.capacidadTotal}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="warning" onClick={() => handleEdit(room)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(room.id)}>
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
