import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AsientoDto {
  @IsNumber()
  fila!: number;

  @IsNumber()
  columna!: number;
}

export class CreateReservaDto {
  @IsNumber()
  @IsNotEmpty()
  funcionId!: number;

  @IsNumber()
  @IsNotEmpty()
  usuarioId!: number; // El ID del usuario logueado que compra

  @IsArray({ message: 'Debe seleccionar al menos un asiento' })
  @IsNotEmpty()
  asientos!: AsientoDto[]; // Permite reservar varios asientos en una sola petición
}