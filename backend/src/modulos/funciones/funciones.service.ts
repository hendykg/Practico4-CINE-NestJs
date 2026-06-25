import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFuncioneDto } from './dto/create-funcione.dto';
import { UpdateFuncioneDto } from './dto/update-funcione.dto';
import { Funcion } from './entities/funcione.entity';
import { Pelicula } from '../peliculas/entities/pelicula.entity';
import { Sala } from '../salas/entities/sala.entity';

@Injectable()
export class FuncionesService {
  constructor(
    @InjectRepository(Funcion)
    private readonly funcionesRepository: Repository<Funcion>,
    @InjectRepository(Pelicula)
    private readonly peliculasRepository: Repository<Pelicula>,
    @InjectRepository(Sala)
    private readonly salasRepository: Repository<Sala>,
  ) {}

  async create(createFuncioneDto: CreateFuncioneDto) {
    this.validarDatosBasicos(createFuncioneDto.fechaHora, createFuncioneDto.precioEntrada);
    await this.validarReferencias(createFuncioneDto.peliculaId, createFuncioneDto.salaId);
    await this.validarSuperposicion(createFuncioneDto);

    const nueva = this.funcionesRepository.create({
      ...createFuncioneDto,
      fechaHora: new Date(createFuncioneDto.fechaHora),
    });

    const guardada = await this.funcionesRepository.save(nueva);
    return this.findOne(guardada.id);
  }

  async findAll(peliculaId?: number) {
    const funciones = await this.funcionesRepository.find({
      where: peliculaId ? { peliculaId } : undefined,
      relations: { pelicula: true, sala: true },
    });

    return funciones
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
      .map((funcion) => this.enriquecerFuncion(funcion));
  }

  async findOne(id: number) {
    const funcion = await this.funcionesRepository.findOne({
      where: { id },
      relations: { pelicula: true, sala: true },
    });
    if (!funcion) throw new NotFoundException('Funcion no encontrada.');
    return this.enriquecerFuncion(funcion);
  }

  async update(id: number, updateFuncioneDto: UpdateFuncioneDto) {
    const funcion = await this.funcionesRepository.findOne({ where: { id } });

    if (!funcion) throw new NotFoundException('Funcion no encontrada.');

    const actualizada = this.funcionesRepository.merge(funcion, {
      ...updateFuncioneDto,
      fechaHora:
        updateFuncioneDto.fechaHora !== undefined
          ? new Date(updateFuncioneDto.fechaHora)
          : funcion.fechaHora,
    });

    this.validarDatosBasicos(actualizada.fechaHora, actualizada.precioEntrada);
    await this.validarReferencias(actualizada.peliculaId, actualizada.salaId);
    await this.validarSuperposicion(actualizada, id);

    await this.funcionesRepository.save(actualizada);
    return this.findOne(id);
  }

  async remove(id: number) {
    const funcion = await this.funcionesRepository.findOne({ where: { id } });
    if (!funcion) throw new NotFoundException('Funcion no encontrada.');

    await this.funcionesRepository.remove(funcion);
    return { mensaje: `Funcion #${id} eliminada correctamente.` };
  }

  private async validarReferencias(peliculaId: number, salaId: number): Promise<void> {
    const [pelicula, sala] = await Promise.all([
      this.peliculasRepository.findOne({ where: { id: peliculaId } }),
      this.salasRepository.findOne({ where: { id: salaId } }),
    ]);

    if (!pelicula) {
      throw new BadRequestException('La pelicula seleccionada no existe.');
    }

    if (!sala) {
      throw new BadRequestException('La sala seleccionada no existe.');
    }
  }

  private validarDatosBasicos(fechaHora: string | Date, precioEntrada: number): void {
    if (Number.isNaN(new Date(fechaHora).getTime())) {
      throw new BadRequestException('La fecha y hora de la funcion no es valida.');
    }

    if (typeof precioEntrada !== 'number' || Number.isNaN(precioEntrada) || precioEntrada <= 0) {
      throw new BadRequestException('El precio de la entrada debe ser mayor a cero.');
    }
  }

  private async validarSuperposicion(
    funcion: CreateFuncioneDto | Funcion,
    funcionId?: number,
  ): Promise<void> {
    const pelicula = await this.peliculasRepository.findOne({ where: { id: funcion.peliculaId } });

    if (!pelicula) {
      throw new BadRequestException('La pelicula seleccionada no existe.');
    }

    const inicioNueva = new Date(funcion.fechaHora);
    const finNueva = new Date(inicioNueva.getTime() + pelicula.duracion * 60000);

    const funcionesEnSala = await this.funcionesRepository.find({
      where: { salaId: funcion.salaId },
      relations: { pelicula: true },
    });

    const cruce = funcionesEnSala.find((item) => {
      if (funcionId && item.id === funcionId) return false;

      const duracionExistente = item.pelicula?.duracion ?? 0;
      const inicioExistente = new Date(item.fechaHora);
      const finExistente = new Date(inicioExistente.getTime() + duracionExistente * 60000);

      return inicioNueva < finExistente && finNueva > inicioExistente;
    });

    if (cruce) {
      throw new BadRequestException('No se puede crear o editar la funcion porque la sala ya esta ocupada en ese horario.');
    }
  }

  private enriquecerFuncion(funcion: Funcion): Funcion {
    return {
      ...funcion,
      pelicula: funcion.pelicula,
      sala: funcion.sala,
    };
  }
}
