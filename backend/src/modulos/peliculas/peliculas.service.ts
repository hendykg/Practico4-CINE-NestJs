import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from './entities/pelicula.entity';

@Injectable()
export class PeliculasService {
  constructor(
    @InjectRepository(Pelicula)
    private readonly peliculasRepository: Repository<Pelicula>,
  ) {}

  async create(nuevaPelicula: Omit<Pelicula, 'id' | 'funciones'>) {
    this.validarPelicula(nuevaPelicula, true);

    const pelicula = this.peliculasRepository.create(nuevaPelicula);
    return this.peliculasRepository.save(pelicula);
  }

  async findAll(nombre?: string, genero?: string) {
    let resultado = await this.peliculasRepository.find();

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

  async findOne(id: number) {
    const pelicula = await this.peliculasRepository.findOne({
      where: { id },
      relations: { funciones: { sala: true } },
    });

    if (!pelicula) {
      throw new NotFoundException('Pelicula no encontrada.');
    }

    const funciones = [...(pelicula.funciones ?? [])].sort(
      (a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime(),
    );

    return { ...pelicula, funciones };
  }

  async update(id: number, updatePeliculaDto: Partial<Omit<Pelicula, 'id' | 'funciones'>>) {
    const pelicula = await this.peliculasRepository.findOne({ where: { id } });

    if (!pelicula) {
      throw new NotFoundException('Pelicula no encontrada.');
    }

    const peliculaActualizada = this.peliculasRepository.merge(pelicula, updatePeliculaDto);
    this.validarPelicula(peliculaActualizada, false);

    return this.peliculasRepository.save(peliculaActualizada);
  }

  async remove(id: number) {
    const pelicula = await this.peliculasRepository.findOne({ where: { id } });

    if (!pelicula) {
      throw new NotFoundException('Pelicula no encontrada.');
    }

    await this.peliculasRepository.remove(pelicula);
    return { mensaje: `Pelicula #${id} eliminada correctamente.` };
  }

  private validarPelicula(
    pelicula: Partial<Omit<Pelicula, 'id' | 'funciones'>>,
    requiereImagen: boolean,
  ): void {
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
