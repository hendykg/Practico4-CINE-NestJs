import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Funcion } from '../../funciones/entities/funcione.entity';

@Entity('peliculas')
export class Pelicula {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column('text')
  sinopsis!: string;

  @Column()
  genero!: string;

  @Column('int')
  duracion!: number; // En minutos

  @Column()
  clasificacion!: string; // '+14', 'R', 'Todo público'

  @Column()
  imagenPoster!: string; // Ruta del archivo guardado

  @OneToMany(() => Funcion, (funcion) => funcion.pelicula)
  funciones!: Funcion[];
}
