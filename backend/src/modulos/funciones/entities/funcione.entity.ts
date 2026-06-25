import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';
import { Sala } from '../../salas/entities/sala.entity';
import { Reserva } from '../../reservas/entities/reserva.entity';

@Entity('funciones')
export class Funcion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  peliculaId!: number;

  @Column('int')
  salaId!: number;

  @Column('datetime')
  fechaHora!: Date;

  @Column('float')
  precioEntrada!: number;

  @ManyToOne(() => Pelicula, (pelicula) => pelicula.funciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'peliculaId' })
  pelicula!: Pelicula;

  @ManyToOne(() => Sala, (sala) => sala.funciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salaId' })
  sala!: Sala;

  @OneToMany(() => Reserva, (reserva) => reserva.funcion)
  reservas!: Reserva[];
}
