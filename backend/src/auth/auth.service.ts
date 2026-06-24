import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { DataStoreService } from '../common/data-store.service';
import { UsuarioAutenticado } from '../common/app.types';
import { hashContrasena, verificarContrasena } from '../common/auth.utils';

@Injectable()
export class AuthService {
  constructor(private readonly dataStore: DataStoreService) {}

  async register(createAuthDto: CreateAuthDto) {
    const emailNormalizado = createAuthDto.email.trim().toLowerCase();
    const existe = this.dataStore.getUsuarios().find((u) => u.email === emailNormalizado);

    if (existe) {
      throw new BadRequestException('El correo ya existe.');
    }

    const nuevoUsuario = {
      id: this.dataStore.nextId(this.dataStore.getUsuarios()),
      nombre: createAuthDto.nombre.trim(),
      email: emailNormalizado,
      contrasenaHash: hashContrasena(createAuthDto.contrasena),
      rol: 'cliente' as const,
    };

    this.dataStore.getUsuarios().push(nuevoUsuario);

    return {
      mensaje: 'Usuario registrado correctamente.',
      usuario: this.dataStore.sanitizarUsuario(nuevoUsuario),
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const emailNormalizado = loginAuthDto.email.trim().toLowerCase();
    const usuario = this.dataStore.getUsuarios().find((u) => u.email === emailNormalizado);

    if (!usuario || !verificarContrasena(loginAuthDto.contrasena, usuario.contrasenaHash)) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const token = this.dataStore.crearSesion(usuario.id);

    return {
      token,
      usuario: this.dataStore.sanitizarUsuario(usuario),
    };
  }

  me(usuario: UsuarioAutenticado) {
    return usuario;
  }

  logout(token: string) {
    this.dataStore.eliminarSesion(token);
    return { mensaje: 'Sesion cerrada correctamente.' };
  }
}
