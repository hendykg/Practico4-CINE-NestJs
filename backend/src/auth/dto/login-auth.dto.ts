import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsEmail({}, { message: 'Correo inválido' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  contrasena!: string;
}