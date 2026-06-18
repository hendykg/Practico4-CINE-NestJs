import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email!: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena!: string;
}