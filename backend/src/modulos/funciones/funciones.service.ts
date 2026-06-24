import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateFuncioneDto } from './dto/create-funcione.dto';
import { UpdateFuncioneDto } from './dto/update-funcione.dto';
import { DataStoreService } from '../../common/data-store.service';
import { Funcion } from '../../common/app.types';

@Injectable()
export class FuncionesService {
  constructor(private readonly dataStore: DataStoreService) {}

  create(createFuncioneDto: CreateFuncioneDto) {
    this.validarDatosBasicos(createFuncioneDto.fechaHora, createFuncioneDto.precioEntrada);
    this.validarReferencias(createFuncioneDto.peliculaId, createFuncioneDto.salaId);
    this.validarSuperposicion(createFuncioneDto);

    const nueva: Funcion = {
      id: this.dataStore.nextId(this.dataStore.getFunciones()),
      ...createFuncioneDto,
      fechaHora: new Date(createFuncioneDto.fechaHora).toISOString(),
    };

    this.dataStore.getFunciones().push(nueva);
    return nueva;
  }

  findAll(peliculaId?: number) {
    let funciones = [...this.dataStore.getFunciones()];

    if (peliculaId) {
      funciones = funciones.filter((funcion) => funcion.peliculaId === peliculaId);
    }

    return funciones
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
      .map((funcion) => this.enriquecerFuncion(funcion));
  }

  findOne(id: number) {
    const funcion = this.dataStore.getFunciones().find((item) => item.id === id);
    if (!funcion) throw new NotFoundException('Funcion no encontrada.');
    return this.enriquecerFuncion(funcion);
  }

  update(id: number, updateFuncioneDto: UpdateFuncioneDto) {
    const funciones = this.dataStore.getFunciones();
    const index = funciones.findIndex((item) => item.id === id);

    if (index === -1) throw new NotFoundException('Funcion no encontrada.');

    const actualizada = {
      ...funciones[index],
      ...updateFuncioneDto,
      fechaHora:
        updateFuncioneDto.fechaHora !== undefined
          ? new Date(updateFuncioneDto.fechaHora).toISOString()
          : funciones[index].fechaHora,
    };

    this.validarDatosBasicos(actualizada.fechaHora, actualizada.precioEntrada);
    this.validarReferencias(actualizada.peliculaId, actualizada.salaId);
    this.validarSuperposicion(actualizada, id);

    funciones[index] = actualizada;
    return this.enriquecerFuncion(actualizada);
  }

  remove(id: number) {
    const funciones = this.dataStore.getFunciones();
    const reservas = this.dataStore.getReservas();
    const index = funciones.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException('Funcion no encontrada.');

    for (let i = reservas.length - 1; i >= 0; i -= 1) {
      if (reservas[i].funcionId === id) {
        reservas.splice(i, 1);
      }
    }

    funciones.splice(index, 1);
    return { mensaje: `Funcion #${id} eliminada correctamente.` };
  }

  private validarReferencias(peliculaId: number, salaId: number) {
    const pelicula = this.dataStore.getPeliculas().find((item) => item.id === peliculaId);
    const sala = this.dataStore.getSalas().find((item) => item.id === salaId);

    if (!pelicula) {
      throw new BadRequestException('La pelicula seleccionada no existe.');
    }

    if (!sala) {
      throw new BadRequestException('La sala seleccionada no existe.');
    }
  }

  private validarDatosBasicos(fechaHora: string, precioEntrada: number) {
    if (Number.isNaN(new Date(fechaHora).getTime())) {
      throw new BadRequestException('La fecha y hora de la funcion no es valida.');
    }

    if (typeof precioEntrada !== 'number' || Number.isNaN(precioEntrada) || precioEntrada <= 0) {
      throw new BadRequestException('El precio de la entrada debe ser mayor a cero.');
    }
  }

  private validarSuperposicion(funcion: CreateFuncioneDto | Funcion, funcionId?: number) {
    const pelicula = this.dataStore.getPeliculas().find((item) => item.id === funcion.peliculaId);

    if (!pelicula) {
      throw new BadRequestException('La pelicula seleccionada no existe.');
    }

    const inicioNueva = new Date(funcion.fechaHora);
    const finNueva = new Date(inicioNueva.getTime() + pelicula.duracion * 60000);

    const cruce = this.dataStore.getFunciones().find((item) => {
      if (funcionId && item.id === funcionId) return false;
      if (item.salaId !== funcion.salaId) return false;

      const peliculaExistente = this.dataStore.getPeliculas().find((p) => p.id === item.peliculaId);
      const duracionExistente = peliculaExistente?.duracion ?? 0;
      const inicioExistente = new Date(item.fechaHora);
      const finExistente = new Date(inicioExistente.getTime() + duracionExistente * 60000);

      return inicioNueva < finExistente && finNueva > inicioExistente;
    });

    if (cruce) {
      throw new BadRequestException('No se puede crear o editar la funcion porque la sala ya esta ocupada en ese horario.');
    }
  }

  private enriquecerFuncion(funcion: Funcion) {
    return {
      ...funcion,
      pelicula: this.dataStore.getPeliculas().find((item) => item.id === funcion.peliculaId) ?? null,
      sala: this.dataStore.getSalas().find((item) => item.id === funcion.salaId) ?? null,
    };
  }
}
