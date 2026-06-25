import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reserva } from '../../modulos/reservas/entities/reserva.entity';
import { Sesion } from './sesion.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  contrasenaHash!: string;

  @Column({ default: 'cliente' }) // 'cliente' o 'administrador'
  rol!: string;

  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  reservas!: Reserva[];

  @OneToMany(() => Sesion, (sesion) => sesion.usuario)
  sesiones!: Sesion[];
}
