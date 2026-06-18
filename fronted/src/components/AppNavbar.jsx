import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx' 

function AppNavbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-danger fw-bold">CINE-KALAF</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Cartelera</Nav.Link>
            
            {/* Vistas solo para Administrador */}
            {user?.rol === 'administrador' && (
              <>
                <Nav.Link as={Link} to="/admin/movies">Gestión Películas</Nav.Link>
                <Nav.Link as={Link} to="/admin/rooms">Salas</Nav.Link>
                <Nav.Link as={Link} to="/admin/showtimes">Funciones</Nav.Link>
              </>
            )}

            {/* Vistas solo para Cliente */}
            {user?.rol === 'cliente' && (
              <Nav.Link as={Link} to="/mis-reservas">Mis Reservas</Nav.Link>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <NavDropdown title={user?.nombre || 'Cuenta'} align="end">
                <NavDropdown.ItemText>{user?.email}</NavDropdown.ItemText>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Ingresar</Nav.Link>
                <Nav.Link as={Link} to="/registro">Registro</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar