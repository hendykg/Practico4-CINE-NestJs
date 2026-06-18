import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateSalaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la sala es obligatorio' })
  nombre: string;

  @IsNumber()
  @Min(1, { message: 'Debe haber al menos 1 fila' })
  filas: number;

  @IsNumber()
  @Min(1, { message: 'Debe haber al menos 1 columna' })
  columnas: number;
}