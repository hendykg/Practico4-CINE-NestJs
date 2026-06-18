import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  private usuarios: any[] = [];

  async register(createAuthDto: CreateAuthDto) {
    const existe = this.usuarios.find(u => u.email === createAuthDto.email);
    if (existe) throw new BadRequestException('El correo ya existe');

    const nuevoUsuario = {
      id: this.usuarios.length + 1,
      ...createAuthDto,
      rol: createAuthDto.email.includes('admin') ? 'administrador' : 'cliente',
    };
    this.usuarios.push(nuevoUsuario);
    return nuevoUsuario;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, contrasena } = loginAuthDto;
    const usuario = this.usuarios.find(u => u.email === email && u.contrasena === contrasena);
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');
    return { token: 'JWT_ACCESS_TOKEN', usuario };
  }

  logout() {
    return { mensaje: 'Sesión cerrada' };
  }
}