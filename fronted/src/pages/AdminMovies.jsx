import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import apiClient from '../api/client.js';
import { buildMediaUrl } from '../utils/media.js';

const initialForm = {
  titulo: '',
  sinopsis: '',
  genero: '',
  duracion: '',
  clasificacion: '+14',
};

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [posterFile, setPosterFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchMovies = async () => {
    const response = await apiClient.get('/peliculas');
    setMovies(response.data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setPosterFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = new FormData();
      payload.append('titulo', formData.titulo);
      payload.append('sinopsis', formData.sinopsis);
      payload.append('genero', formData.genero);
      payload.append('duracion', String(formData.duracion));
      payload.append('clasificacion', formData.clasificacion);

      if (posterFile) {
        payload.append('poster', posterFile);
      }

      if (editingId) {
        await apiClient.patch(`/peliculas/${editingId}`, payload);
        alert('Pelicula actualizada correctamente.');
      } else {
        if (!posterFile) {
          alert('Debes seleccionar un poster.');
          return;
        }

        await apiClient.post('/peliculas', payload);
        alert('Pelicula creada correctamente.');
      }

      resetForm();
      fetchMovies();
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo guardar la pelicula.');
    }
  };

  const handleEdit = async (movieId) => {
    const response = await apiClient.get(`/peliculas/${movieId}`);
    const movie = response.data;

    setEditingId(movie.id);
    setFormData({
      titulo: movie.titulo,
      sinopsis: movie.sinopsis,
      genero: movie.genero,
      duracion: movie.duracion,
      clasificacion: movie.clasificacion,
    });
    setPosterFile(null);
  };

  const handleDelete = async (movieId) => {
    if (!window.confirm('¿Eliminar esta pelicula y sus funciones asociadas?')) {
      return;
    }

    try {
      await apiClient.delete(`/peliculas/${movieId}`);
      fetchMovies();
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo eliminar la pelicula.');
    }
  };

  return (
    <Container className="mt-4 text-white">
      <h2>Gestion de Peliculas</h2>

      <Form onSubmit={handleSubmit} className="mb-5 p-3 border rounded bg-light text-dark">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Titulo</Form.Label>
              <Form.Control value={formData.titulo} onChange={(event) => setFormData({ ...formData, titulo: event.target.value })} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Genero</Form.Label>
              <Form.Control value={formData.genero} onChange={(event) => setFormData({ ...formData, genero: event.target.value })} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duracion (minutos)</Form.Label>
              <Form.Control type="number" min="1" value={formData.duracion} onChange={(event) => setFormData({ ...formData, duracion: event.target.value })} required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Clasificacion</Form.Label>
              <Form.Select value={formData.clasificacion} onChange={(event) => setFormData({ ...formData, clasificacion: event.target.value })}>
                <option value="+14">+14</option>
                <option value="R">R</option>
                <option value="Todo publico">Todo publico</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Poster</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(event) => setPosterFile(event.target.files?.[0] || null)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sinopsis</Form.Label>
              <Form.Control as="textarea" rows={4} value={formData.sinopsis} onChange={(event) => setFormData({ ...formData, sinopsis: event.target.value })} required />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button type="submit" variant="danger">
            {editingId ? 'Guardar cambios' : 'Crear pelicula'}
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
            <th>Poster</th>
            <th>Titulo</th>
            <th>Genero</th>
            <th>Duracion</th>
            <th>Clasificacion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>
                <img src={buildMediaUrl(movie.imagenPoster)} alt={movie.titulo} style={{ width: '72px', height: '100px', objectFit: 'cover' }} />
              </td>
              <td>{movie.titulo}</td>
              <td>{movie.genero}</td>
              <td>{movie.duracion} min</td>
              <td>{movie.clasificacion}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="warning" onClick={() => handleEdit(movie.id)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(movie.id)}>
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
