import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Usuario } from './auth.entity';

@Entity('sesiones')
export class Sesion {
  @PrimaryColumn()
  token!: string;

  @Column('int')
  usuarioId!: number;

  @Column('datetime')
  expiraEn!: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.sesiones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: Usuario;
}
