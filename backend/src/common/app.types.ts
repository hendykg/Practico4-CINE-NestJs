export type RolUsuario = 'cliente' | 'administrador';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  contrasenaHash: string;
  rol: RolUsuario;
}

export interface Pelicula {
  id: number;
  titulo: string;
  sinopsis: string;
  genero: string;
  duracion: number;
  clasificacion: string;
  imagenPoster: string;
}

export interface Sala {
  id: number;
  nombre: string;
  filas: number;
  columnas: number;
  capacidadTotal: number;
}

export interface Funcion {
  id: number;
  peliculaId: number;
  salaId: number;
  fechaHora: string;
  precioEntrada: number;
}

export interface Reserva {
  id: number;
  funcionId: number;
  usuarioId: number;
  fila: number;
  columna: number;
  fechaReserva: string;
}

export interface Sesion {
  token: string;
  usuarioId: number;
  expiraEn: string;
}

export interface UsuarioAutenticado {
  id: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
}
