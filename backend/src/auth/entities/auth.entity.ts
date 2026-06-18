import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from '../../modulos/reservas/entities/reserva.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  contrasena!: string;

  @Column({ default: 'cliente' }) // 'cliente' o 'administrador'
  rol!: string;

  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  reservas!: Reserva[];
}