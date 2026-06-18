import { useState, useEffect } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import apiClient from '../api/client.js';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', filas: '', columnas: '' });

  const fetchRooms = async () => {
    try {
      const res = await apiClient.get('/salas');
      setRooms(res.data);
    } catch (error) { 
      console.error("Error al traer salas:", error); 
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: formData.nombre,
        filas: Number(formData.filas),
        columnas: Number(formData.columnas)
      };
      
      await apiClient.post('/salas', payload);
      fetchRooms();
      alert('Sala creada exitosamente en NestJS');
      setFormData({ nombre: '', filas: '', columnas: '' });
    } catch (error) {
      alert('Error al crear sala en el servidor');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Gestión de Salas</h2>

      <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light text-dark">
        <Form.Group className="mb-3">
          <Form.Label>Nombre o Número de Sala</Form.Label>
          <Form.Control 
            type="text" 
            value={formData.nombre} 
            onChange={e => setFormData({...formData, nombre: e.target.value})} 
            required 
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cantidad de Filas</Form.Label>
          <Form.Control 
            type="number" 
            min="1"
            value={formData.filas} 
            onChange={e => setFormData({...formData, filas: e.target.value})} 
            required 
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cantidad de Columnas</Form.Label>
          <Form.Control 
            type="number" 
            min="1"
            value={formData.columnas} 
            onChange={e => setFormData({...formData, columnas: e.target.value})} 
            required 
          />
        </Form.Group>
        <Button type="submit" variant="primary">Crear Sala</Button>
      </Form>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Filas</th>
            <th>Columnas</th>
            <th>Capacidad Total</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id}>
              <td>{room.nombre}</td>
              <td>{room.filas}</td>
              <td>{room.columnas}</td>
              <td>{room.capacidadTotal} Asientos</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}