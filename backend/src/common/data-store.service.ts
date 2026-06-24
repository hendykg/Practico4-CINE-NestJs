import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import {
  Funcion,
  Pelicula,
  Reserva,
  Sala,
  Sesion,
  Usuario,
  UsuarioAutenticado,
} from './app.types';
import { hashContrasena } from './auth.utils';

@Injectable()
export class DataStoreService {
  private readonly usuarios: Usuario[];
  private readonly peliculas: Pelicula[];
  private readonly salas: Sala[];
  private readonly funciones: Funcion[];
  private readonly reservas: Reserva[];
  private readonly sesiones: Sesion[] = [];

  constructor() {
    this.usuarios = [
      {
        id: 1,
        nombre: 'Administrador',
        email: 'admin@cinekalaf.com',
        contrasenaHash: hashContrasena('Admin123!'),
        rol: 'administrador',
      },
      {
        id: 2,
        nombre: 'Cliente Demo',
        email: 'cliente@cinekalaf.com',
        contrasenaHash: hashContrasena('Cliente123!'),
        rol: 'cliente',
      },
    ];

    this.peliculas = [
      {
        id: 1,
        titulo: 'Dune: Parte Dos',
        sinopsis:
          'Paul Atreides se une a Chani y a los Fremen mientras enfrenta a quienes destruyeron a su familia.',
        genero: 'Ciencia Ficcion',
        duracion: 166,
        clasificacion: '+14',
        imagenPoster:
          'https://image.tmdb.org/t/p/w500/cxevDYdeFkiixRShbObdwAHWH0d.jpg',
      },
      {
        id: 2,
        titulo: 'Spider-Man: Across the Spider-Verse',
        sinopsis:
          'Miles Morales viaja por el multiverso y se une a otros heroes aracnidos para proteger su realidad.',
        genero: 'Animacion',
        duracion: 140,
        clasificacion: 'Todo publico',
        imagenPoster:
          'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      },
      {
        id: 3,
        titulo: 'Nada es lo que parece 3',
        sinopsis:
          'Los Cuatro Jinetes vuelven con una nueva generacion de magos y un golpe imposible.',
        genero: 'Suspenso',
        duracion: 115,
        clasificacion: '+14',
        imagenPoster:
          'https://image.tmdb.org/t/p/w500/hUu9zyZmDD8lz7XHkdAdxUn5gse.jpg',
      },
    ];

    this.salas = [
      { id: 1, nombre: 'Sala 1', filas: 8, columnas: 10, capacidadTotal: 80 },
      { id: 2, nombre: 'Sala 2', filas: 10, columnas: 12, capacidadTotal: 120 },
    ];

    this.funciones = [
      {
        id: 1,
        peliculaId: 1,
        salaId: 1,
        fechaHora: '2026-06-24T19:00:00.000Z',
        precioEntrada: 35,
      },
      {
        id: 2,
        peliculaId: 1,
        salaId: 1,
        fechaHora: '2026-06-25T22:30:00.000Z',
        precioEntrada: 35,
      },
      {
        id: 3,
        peliculaId: 2,
        salaId: 2,
        fechaHora: '2026-06-24T18:15:00.000Z',
        precioEntrada: 30,
      },
      {
        id: 4,
        peliculaId: 3,
        salaId: 2,
        fechaHora: '2026-06-24T21:00:00.000Z',
        precioEntrada: 28,
      },
      {
        id: 5,
        peliculaId: 2,
        salaId: 1,
        fechaHora: '2026-06-25T21:50:00.000Z',
        precioEntrada: 32,
      },
      {
        id: 6,
        peliculaId: 3,
        salaId: 1,
        fechaHora: '2026-06-25T23:40:00.000Z',
        precioEntrada: 30,
      },
    ];

    this.reservas = [
      {
        id: 1,
        funcionId: 1,
        usuarioId: 2,
        fila: 2,
        columna: 4,
        fechaReserva: new Date().toISOString(),
      },
      {
        id: 2,
        funcionId: 1,
        usuarioId: 2,
        fila: 2,
        columna: 5,
        fechaReserva: new Date().toISOString(),
      },
    ];
  }

  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  getPeliculas(): Pelicula[] {
    return this.peliculas;
  }

  getSalas(): Sala[] {
    return this.salas;
  }

  getFunciones(): Funcion[] {
    return this.funciones;
  }

  getReservas(): Reserva[] {
    return this.reservas;
  }

  getSesiones(): Sesion[] {
    return this.sesiones;
  }

  nextId<T extends { id: number }>(collection: T[]): number {
    return collection.length === 0 ? 1 : Math.max(...collection.map((item) => item.id)) + 1;
  }

  crearToken(): string {
    return randomBytes(32).toString('hex');
  }

  crearSesion(usuarioId: number): string {
    const token = this.crearToken();
    const expiraEn = new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString();

    this.sesiones.push({ token, usuarioId, expiraEn });

    return token;
  }

  eliminarSesion(token: string): void {
    const index = this.sesiones.findIndex((sesion) => sesion.token === token);
    if (index >= 0) {
      this.sesiones.splice(index, 1);
    }
  }

  buscarUsuarioPorToken(token: string): Usuario | undefined {
    const sesion = this.sesiones.find((item) => item.token === token);

    if (!sesion) {
      return undefined;
    }

    if (new Date(sesion.expiraEn).getTime() <= Date.now()) {
      this.eliminarSesion(token);
      return undefined;
    }

    return this.usuarios.find((usuario) => usuario.id === sesion.usuarioId);
  }

  sanitizarUsuario(usuario: Usuario): UsuarioAutenticado {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };
  }
}
