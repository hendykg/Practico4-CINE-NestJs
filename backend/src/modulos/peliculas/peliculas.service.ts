import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../common/data-store.service';
import { Pelicula } from '../../common/app.types';

@Injectable()
export class PeliculasService {
  constructor(private readonly dataStore: DataStoreService) {}

  create(nuevaPelicula: Omit<Pelicula, 'id'>) {
    this.validarPelicula(nuevaPelicula, true);

    const pelicula = {
      id: this.dataStore.nextId(this.dataStore.getPeliculas()),
      ...nuevaPelicula,
    };

    this.dataStore.getPeliculas().push(pelicula);
    return pelicula;
  }

  findAll(nombre?: string, genero?: string) {
    let resultado = [...this.dataStore.getPeliculas()];

    if (nombre) {
      const nombreNormalizado = nombre.trim().toLowerCase();
      resultado = resultado.filter((p) => p.titulo.toLowerCase().includes(nombreNormalizado));
    }

    if (genero) {
      const generoNormalizado = genero.trim().toLowerCase();
      resultado = resultado.filter((p) => p.genero.toLowerCase() === generoNormalizado);
    }

    return resultado;
  }

  findOne(id: number) {
    const pelicula = this.dataStore.getPeliculas().find((p) => p.id === id);

    if (!pelicula) {
      throw new NotFoundException('Pelicula no encontrada.');
    }

    const funciones = this.dataStore
      .getFunciones()
      .filter((funcion) => funcion.peliculaId === pelicula.id)
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
      .map((funcion) => ({
        ...funcion,
        sala: this.dataStore.getSalas().find((sala) => sala.id === funcion.salaId) ?? null,
      }));

    return { ...pelicula, funciones };
  }

  update(id: number, updatePeliculaDto: Partial<Omit<Pelicula, 'id'>>) {
    const peliculas = this.dataStore.getPeliculas();
    const index = peliculas.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException('Pelicula no encontrada.');
    }

    const peliculaActualizada = { ...peliculas[index], ...updatePeliculaDto };
    this.validarPelicula(peliculaActualizada, false);

    peliculas[index] = peliculaActualizada;
    return peliculas[index];
  }

  remove(id: number) {
    const peliculas = this.dataStore.getPeliculas();
    const funciones = this.dataStore.getFunciones();
    const reservas = this.dataStore.getReservas();
    const index = peliculas.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException('Pelicula no encontrada.');
    }

    const funcionesDePelicula = funciones.filter((funcion) => funcion.peliculaId === id).map((funcion) => funcion.id);

    for (let i = reservas.length - 1; i >= 0; i -= 1) {
      if (funcionesDePelicula.includes(reservas[i].funcionId)) {
        reservas.splice(i, 1);
      }
    }

    for (let i = funciones.length - 1; i >= 0; i -= 1) {
      if (funciones[i].peliculaId === id) {
        funciones.splice(i, 1);
      }
    }

    peliculas.splice(index, 1);
    return { mensaje: `Pelicula #${id} eliminada correctamente.` };
  }

  private validarPelicula(pelicula: Partial<Omit<Pelicula, 'id'>>, requiereImagen: boolean) {
    if (!pelicula.titulo?.trim()) {
      throw new BadRequestException('El titulo es obligatorio.');
    }

    if (!pelicula.sinopsis?.trim()) {
      throw new BadRequestException('La sinopsis es obligatoria.');
    }

    if (!pelicula.genero?.trim()) {
      throw new BadRequestException('El genero es obligatorio.');
    }

    if (!Number.isInteger(pelicula.duracion) || Number(pelicula.duracion) <= 0) {
      throw new BadRequestException('La duracion debe ser un numero entero mayor a cero.');
    }

    if (!pelicula.clasificacion?.trim()) {
      throw new BadRequestException('La clasificacion es obligatoria.');
    }

    if (requiereImagen && !pelicula.imagenPoster) {
      throw new BadRequestException('Debes subir un poster para la pelicula.');
    }
  }
}
