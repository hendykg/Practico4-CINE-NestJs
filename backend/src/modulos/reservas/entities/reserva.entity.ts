import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Funcion } from '../../funciones/entities/funcione.entity';
import { Usuario } from '../../../auth/entities/auth.entity';

@Entity('reservas')
// Regla de negocio: Un asiento no puede reservarse dos veces para la misma función
@Unique(['funcion', 'filaAsiento', 'columnaAsiento'])
export class Reserva {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  filaAsiento!: number;

  @Column('int')
  columnaAsiento!: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  fechaReserva!: Date;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  usuario!: Usuario; // Usuario logueado que hizo la reserva

  @ManyToOne(() => Funcion, (funcion) => funcion.reservas, { onDelete: 'CASCADE' })
  funcion!: Funcion;
}