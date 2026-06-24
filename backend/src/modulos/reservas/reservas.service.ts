import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { DataStoreService } from '../../common/data-store.service';
import { UsuarioAutenticado } from '../../common/app.types';

@Injectable()
export class ReservasService {
  constructor(private readonly dataStore: DataStoreService) {}

  create(createReservaDto: CreateReservaDto, usuario: UsuarioAutenticado) {
    const { funcionId, asientos } = createReservaDto;
    const funcion = this.dataStore.getFunciones().find((item) => item.id === funcionId);

    if (!funcion) {
      throw new BadRequestException('La funcion seleccionada no existe.');
    }

    const sala = this.dataStore.getSalas().find((item) => item.id === funcion.salaId);

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

      const yaReservado = this.dataStore
        .getReservas()
        .find((r) => r.funcionId === funcionId && r.fila === asiento.fila && r.columna === asiento.columna);

      if (yaReservado) {
        throw new BadRequestException(
          `El asiento F${asiento.fila} C${asiento.columna} ya se encuentra reservado para esta funcion.`,
        );
      }
    }

    const nuevasReservas = [];
    for (const asiento of asientos) {
      const nuevaReserva = {
        id: this.dataStore.nextId(this.dataStore.getReservas()),
        funcionId,
        usuarioId: usuario.id,
        fila: asiento.fila,
        columna: asiento.columna,
        fechaReserva: new Date().toISOString(),
      };

      this.dataStore.getReservas().push(nuevaReserva);
      nuevasReservas.push(nuevaReserva);
    }

    return {
      mensaje: 'Reserva confirmada con exito.',
      totalAsientosReservados: nuevasReservas.length,
      detalles: nuevasReservas,
    };
  }

  findPorUsuario(usuario: UsuarioAutenticado) {
    return this.dataStore
      .getReservas()
      .filter((reserva) => reserva.usuarioId === usuario.id)
      .map((reserva) => this.enriquecerReserva(reserva));
  }

  findAsientosOcupados(funcionId: number) {
    return this.dataStore
      .getReservas()
      .filter((reserva) => reserva.funcionId === funcionId)
      .map((reserva) => ({ fila: reserva.fila, columna: reserva.columna }));
  }

  remove(id: number, usuario: UsuarioAutenticado) {
    const reservas = this.dataStore.getReservas();
    const index = reservas.findIndex((reserva) => reserva.id === id);

    if (index === -1) throw new NotFoundException('La reserva no existe.');

    if (usuario.rol !== 'administrador' && reservas[index].usuarioId !== usuario.id) {
      throw new BadRequestException('Solo puedes cancelar tus propias reservas.');
    }

    reservas.splice(index, 1);
    return { mensaje: `Reserva #${id} cancelada correctamente.` };
  }

  private enriquecerReserva(reserva: {
    id: number;
    funcionId: number;
    usuarioId: number;
    fila: number;
    columna: number;
    fechaReserva: string;
  }) {
    const funcion = this.dataStore.getFunciones().find((item) => item.id === reserva.funcionId);
    const pelicula = funcion
      ? this.dataStore.getPeliculas().find((item) => item.id === funcion.peliculaId)
      : undefined;
    const sala = funcion ? this.dataStore.getSalas().find((item) => item.id === funcion.salaId) : undefined;

    return {
      ...reserva,
      funcion,
      pelicula,
      sala,
    };
  }
}
