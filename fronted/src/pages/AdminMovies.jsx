import { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Row, Col } from 'react-bootstrap';
import apiClient from '../api/client.js';

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '', sinopsis: '', genero: '', duracion: '', clasificacion: '+14'
  });
  const [imagenPoster, setImagenPoster] = useState(''); // Manejo simple por string de momento

  const fetchMovies = async () => {
    const res = await apiClient.get('/peliculas');
    setMovies(res.data);
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        duracion: Number(formData.duracion),
        imagenPoster: imagenPoster || 'uploads/default.jpg'
      };

      await apiClient.post('/peliculas', payload);
      alert('Película creada con éxito');
      
      setFormData({ titulo: '', sinopsis: '', genero: '', duracion: '', clasificacion: '+14' });
      setImagenPoster('');
      fetchMovies();
    } catch (error) {
      alert('Error al guardar la película');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Gestión de Películas (NestJS)</h2>
      <Form onSubmit={handleSubmit} className="mb-5 p-3 border rounded bg-light text-dark">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Género</Form.Label>
              <Form.Control type="text" value={formData.genero} onChange={e => setFormData({...formData, genero: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duración (minutos)</Form.Label>
              <Form.Control type="number" value={formData.duracion} onChange={e => setFormData({...formData, duracion: e.target.value})} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Clasificación</Form.Label>
              <Form.Select value={formData.clasificacion} onChange={e => setFormData({...formData, clasificacion: e.target.value})}>
                <option value="+14">+14</option>
                <option value="R">R</option>
                <option value="Todo público">Todo público</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL / Ruta del Póster</Form.Label>
              <Form.Control type="text" value={imagenPoster} onChange={e => setImagenPoster(e.target.value)} placeholder="Ej: uploads/peli.jpg" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sinopsis</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.sinopsis} onChange={e => setFormData({...formData, sinopsis: e.target.value})} required />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" variant="primary">Crear Película</Button>
      </Form>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Título</th>
            <th>Género</th>
            <th>Duración</th>
            <th>Clasificación</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie.id}>
              <td>{movie.titulo}</td>
              <td>{movie.genero}</td>
              <td>{movie.duracion} min</td>
              <td>{movie.clasificacion}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}