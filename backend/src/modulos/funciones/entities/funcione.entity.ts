import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';
import { Sala } from '../../salas/entities/sala.entity';
import { Reserva } from '../../reservas/entities/reserva.entity';

@Entity('funciones')
export class Funcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  fechaHora: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  precioEntrada: number;

  @ManyToOne(() => Pelicula, (pelicula) => pelicula.funciones, { onDelete: 'CASCADE' })
  pelicula: Pelicula;

  @ManyToOne(() => Sala, (sala) => sala.funciones, { onDelete: 'CASCADE' })
  sala: Sala;

  @OneToMany(() => Reserva, (reserva) => reserva.funcion)
  reservas: Reserva[];
}