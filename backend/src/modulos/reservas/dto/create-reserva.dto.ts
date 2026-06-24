import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

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

  @IsArray({ message: 'Debe seleccionar al menos un asiento' })
  @ArrayMinSize(1, { message: 'Debes seleccionar al menos un asiento' })
  asientos!: AsientoDto[];
}
