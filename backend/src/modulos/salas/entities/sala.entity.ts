import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Funcion } from '../../funciones/entities/funcione.entity';

@Entity('salas')
export class Sala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string; // Ej: "Sala 1", "Sala VIP"

  @Column('int')
  filas: number;

  @Column('int')
  columnas: number;

  // Propiedad calculada/virtual o guardada para la capacidad total
  @Column('int')
  capacidadTotal: number; 

  @OneToMany(() => Funcion, (funcion) => funcion.sala)
  funciones: Funcion[];
}