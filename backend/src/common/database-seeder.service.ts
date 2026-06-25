import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashContrasena } from './auth.utils';
import { Usuario } from '../auth/entities/auth.entity';
import { Pelicula } from '../modulos/peliculas/entities/pelicula.entity';
import { Sala } from '../modulos/salas/entities/sala.entity';
import { Funcion } from '../modulos/funciones/entities/funcione.entity';
import { Reserva } from '../modulos/reservas/entities/reserva.entity';

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(Pelicula)
    private readonly peliculasRepository: Repository<Pelicula>,
    @InjectRepository(Sala)
    private readonly salasRepository: Repository<Sala>,
    @InjectRepository(Funcion)
    private readonly funcionesRepository: Repository<Funcion>,
    @InjectRepository(Reserva)
    private readonly reservasRepository: Repository<Reserva>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const usuariosCount = await this.usuariosRepository.count();
    if (usuariosCount > 0) {
      return;
    }

    const [admin, cliente] = await this.usuariosRepository.save([
      this.usuariosRepository.create({
        nombre: 'Administrador',
        email: 'admin@cinekalaf.com',
        contrasenaHash: hashContrasena('Admin123!'),
        rol: 'administrador',
      }),
      this.usuariosRepository.create({
        nombre: 'Cliente Demo',
        email: 'cliente@cinekalaf.com',
        contrasenaHash: hashContrasena('Cliente123!'),
        rol: 'cliente',
      }),
    ]);

    const peliculas = await this.peliculasRepository.save([
      this.peliculasRepository.create({
        titulo: 'Dune: Parte Dos',
        sinopsis:
          'Paul Atreides se une a Chani y a los Fremen mientras enfrenta a quienes destruyeron a su familia.',
        genero: 'Ciencia Ficcion',
        duracion: 166,
        clasificacion: '+14',
        imagenPoster: 'https://image.tmdb.org/t/p/w500/cxevDYdeFkiixRShbObdwAHWH0d.jpg',
      }),
      this.peliculasRepository.create({
        titulo: 'Spider-Man: Across the Spider-Verse',
        sinopsis:
          'Miles Morales viaja por el multiverso y se une a otros heroes aracnidos para proteger su realidad.',
        genero: 'Animacion',
        duracion: 140,
        clasificacion: 'Todo publico',
        imagenPoster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      }),
      this.peliculasRepository.create({
        titulo: 'Nada es lo que parece 3',
        sinopsis:
          'Los Cuatro Jinetes vuelven con una nueva generacion de magos y un golpe imposible.',
        genero: 'Suspenso',
        duracion: 115,
        clasificacion: '+14',
        imagenPoster: 'https://image.tmdb.org/t/p/w500/hUu9zyZmDD8lz7XHkdAdxUn5gse.jpg',
      }),
    ]);

    const salas = await this.salasRepository.save([
      this.salasRepository.create({ nombre: 'Sala 1', filas: 8, columnas: 10, capacidadTotal: 80 }),
      this.salasRepository.create({ nombre: 'Sala 2', filas: 10, columnas: 12, capacidadTotal: 120 }),
    ]);

    const funciones = await this.funcionesRepository.save([
      this.funcionesRepository.create({
        peliculaId: peliculas[0].id,
        salaId: salas[0].id,
        fechaHora: new Date('2026-06-24T19:00:00.000Z'),
        precioEntrada: 35,
      }),
      this.funcionesRepository.create({
        peliculaId: peliculas[0].id,
        salaId: salas[0].id,
        fechaHora: new Date('2026-06-25T22:30:00.000Z'),
        precioEntrada: 35,
      }),
      this.funcionesRepository.create({
        peliculaId: peliculas[1].id,
        salaId: salas[1].id,
        fechaHora: new Date('2026-06-24T18:15:00.000Z'),
        precioEntrada: 30,
      }),
      this.funcionesRepository.create({
        peliculaId: peliculas[2].id,
        salaId: salas[1].id,
        fechaHora: new Date('2026-06-24T21:00:00.000Z'),
        precioEntrada: 28,
      }),
      this.funcionesRepository.create({
        peliculaId: peliculas[1].id,
        salaId: salas[0].id,
        fechaHora: new Date('2026-06-25T21:50:00.000Z'),
        precioEntrada: 32,
      }),
      this.funcionesRepository.create({
        peliculaId: peliculas[2].id,
        salaId: salas[0].id,
        fechaHora: new Date('2026-06-25T23:40:00.000Z'),
        precioEntrada: 30,
      }),
    ]);

    await this.reservasRepository.save([
      this.reservasRepository.create({
        funcionId: funciones[0].id,
        usuarioId: cliente.id,
        fila: 2,
        columna: 4,
        fechaReserva: new Date(),
      }),
      this.reservasRepository.create({
        funcionId: funciones[0].id,
        usuarioId: cliente.id,
        fila: 2,
        columna: 5,
        fechaReserva: new Date(),
      }),
    ]);
  }
}
