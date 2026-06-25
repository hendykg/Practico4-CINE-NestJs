import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Funcion } from '../../funciones/entities/funcione.entity';
import { Usuario } from '../../../auth/entities/auth.entity';

@Entity('reservas')
// Regla de negocio: Un asiento no puede reservarse dos veces para la misma función
@Unique(['funcionId', 'fila', 'columna'])
export class Reserva {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  funcionId!: number;

  @Column('int')
  usuarioId!: number;

  @Column('int')
  fila!: number;

  @Column('int')
  columna!: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  fechaReserva!: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: Usuario; // Usuario logueado que hizo la reserva

  @ManyToOne(() => Funcion, (funcion) => funcion.reservas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'funcionId' })
  funcion!: Funcion;
}
