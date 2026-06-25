import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UsuarioAutenticado } from '../../common/app.types';
import { Reserva } from './entities/reserva.entity';
import { Funcion } from '../funciones/entities/funcione.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservasRepository: Repository<Reserva>,
    @InjectRepository(Funcion)
    private readonly funcionesRepository: Repository<Funcion>,
  ) {}

  async create(createReservaDto: CreateReservaDto, usuario: UsuarioAutenticado) {
    const { funcionId, asientos } = createReservaDto;
    const funcion = await this.funcionesRepository.findOne({
      where: { id: funcionId },
      relations: { sala: true },
    });

    if (!funcion) {
      throw new BadRequestException('La funcion seleccionada no existe.');
    }

    const sala = funcion.sala;

    if (!sala) {
      throw new BadRequestException('La sala de la funcion no existe.');
    }

    const asientosUnicos = new Set<string>();

    for (const asiento of asientos) {
      if (!Number.isInteger(asiento.fila) || !Number.isInteger(asiento.columna)) {
        throw new BadRequestException('Cada asiento debe tener fila y columna numericas.');
      }

      if (asiento.fila < 1 || asiento.fila > sala.filas || asiento.columna < 1 || asiento.columna > sala.columnas) {
        throw new BadRequestException(`El asiento F${asiento.fila} C${asiento.columna} no existe en la sala.`);
      }

      const key = `${asiento.fila}-${asiento.columna}`;

      if (asientosUnicos.has(key)) {
        throw new BadRequestException('No puedes reservar el mismo asiento dos veces en la misma operacion.');
      }

      asientosUnicos.add(key);

      const yaReservado = await this.reservasRepository.findOne({
        where: { funcionId, fila: asiento.fila, columna: asiento.columna },
      });

      if (yaReservado) {
        throw new BadRequestException(
          `El asiento F${asiento.fila} C${asiento.columna} ya se encuentra reservado para esta funcion.`,
        );
      }
    }

    let nuevasReservas: Reserva[];

    try {
      nuevasReservas = await this.reservasRepository.manager.transaction(async (manager) => {
        const reservas = asientos.map((asiento) =>
          manager.create(Reserva, {
            funcionId,
            usuarioId: usuario.id,
            fila: asiento.fila,
            columna: asiento.columna,
            fechaReserva: new Date(),
          }),
        );

        return manager.save(Reserva, reservas);
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Uno o mas asientos ya fueron reservados para esta funcion.');
      }

      throw error;
    }

    return {
      mensaje: 'Reserva confirmada con exito.',
      totalAsientosReservados: nuevasReservas.length,
      detalles: nuevasReservas,
    };
  }

  async findPorUsuario(usuario: UsuarioAutenticado) {
    const reservas = await this.reservasRepository.find({
      where: { usuarioId: usuario.id },
      relations: { funcion: { pelicula: true, sala: true } },
    });

    return reservas.map((reserva) => this.enriquecerReserva(reserva));
  }

  async findAsientosOcupados(funcionId: number) {
    const reservas = await this.reservasRepository.find({ where: { funcionId } });
    return reservas.map((reserva) => ({ fila: reserva.fila, columna: reserva.columna }));
  }

  async remove(id: number, usuario: UsuarioAutenticado) {
    const reserva = await this.reservasRepository.findOne({ where: { id } });

    if (!reserva) throw new NotFoundException('La reserva no existe.');

    if (usuario.rol !== 'administrador' && reserva.usuarioId !== usuario.id) {
      throw new BadRequestException('Solo puedes cancelar tus propias reservas.');
    }

    await this.reservasRepository.remove(reserva);
    return { mensaje: `Reserva #${id} cancelada correctamente.` };
  }

  private enriquecerReserva(reserva: Reserva) {
    const funcion = reserva.funcion;
    const pelicula = funcion?.pelicula;
    const sala = funcion?.sala;

    return {
      ...reserva,
      funcion,
      pelicula,
      sala,
    };
  }
}
