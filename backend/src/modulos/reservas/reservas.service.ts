import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';

@Injectable()
export class ReservasService {
  // Simulación del almacenamiento de asientos reservados en la base de datos
  private reservasBD = [
    { id: 1, funcionId: 1, usuarioId: 2, fila: 5, columna: 6 }
  ];

  create(createReservaDto: CreateReservaDto) {
    const { funcionId, usuarioId, asientos } = createReservaDto;

    // 1. Validar duplicados ANTES de guardar nada (Regla de negocio)
    for (const asiento of asientos) {
      const yaReservado = this.reservasBD.find(
        r => r.funcionId === funcionId && 
             r.fila === asiento.fila && 
             r.columna === asiento.columna
      );

      if (yaReservado) {
        throw new BadRequestException(
          `El asiento en la Fila ${asiento.fila}, Columna ${asiento.columna} ya se encuentra ocupado para esta función.`
        );
      }
    }

    // 2. Si todos están libres, se procesa la confirmación de la reserva
    const nuevasReservas = [];
    for (const asiento of asientos) {
      const nuevaReserva = {
        id: this.reservasBD.length + 1,
        funcionId,
        usuarioId,
        fila: asiento.fila,
        columna: asiento.columna,
      };
      this.reservasBD.push(nuevaReserva);
      nuevasReservas.push(nuevaReserva);
    }

    return {
      mensaje: '¡Reserva confirmada con éxito!',
      totalAsientosReservados: nuevasReservas.length,
      detalles: nuevasReservas
    };
  }

  // Permite al usuario ver su historial de reservas realizadas
  findAll() {
    return this.reservasBD;
  }

  findPorUsuario(usuarioId: number) {
    return this.reservasBD.filter(r => r.usuarioId === usuarioId);
  }

  findOne(id: number) {
    const reserva = this.reservasBD.find(r => r.id === id);
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    return reserva;
  }

  // Las reservas de cine generalmente no se editan por el mapa gráfico, se eliminan para liberar el asiento
  remove(id: number) {
    const index = this.reservasBD.findIndex(r => r.id === id);
    if (index === -1) throw new NotFoundException('La reserva no existe');
    this.reservasBD.splice(index, 1);
    return { mensaje: `Reserva #${id} cancelada. El asiento ha sido liberado.` };
  }
}