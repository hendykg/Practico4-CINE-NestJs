import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFuncioneDto {
  @IsNumber()
  @IsNotEmpty()
  peliculaId!: number;

  @IsNumber()
  @IsNotEmpty()
  salaId!: number;

  @IsString()
  @IsNotEmpty({ message: 'La fecha y hora son obligatorias' })
  fechaHora!: string; // ISO String enviada por el frontend: "2026-06-22T19:30:00.000Z"

  @IsNumber()
  @IsNotEmpty({ message: 'El precio de la entrada es obligatorio' })
  precioEntrada!: number;
}