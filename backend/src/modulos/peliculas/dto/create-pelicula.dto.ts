import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePeliculaDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'La sinopsis es obligatoria' })
  sinopsis!: string;

  @IsString()
  @IsNotEmpty({ message: 'El género es obligatorio' })
  genero!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'La duración en minutos es obligatoria' })
  duracion!: number;

  @IsString()
  @IsNotEmpty({ message: 'La clasificación es obligatoria (+14, R, Todo público)' })
  clasificacion!: string;

  @IsString()
  @IsNotEmpty({ message: 'La imagen del póster es obligatoria' })
  imagenPoster!: string; // Guardará la ruta o URL de la imagen cargada
}