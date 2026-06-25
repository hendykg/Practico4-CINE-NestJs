import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Usuario } from './entities/auth.entity';
import { Sesion } from './entities/sesion.entity';
import { UsuarioAutenticado } from '../common/app.types';
import { hashContrasena, verificarContrasena } from '../common/auth.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(Sesion)
    private readonly sesionesRepository: Repository<Sesion>,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const emailNormalizado = createAuthDto.email.trim().toLowerCase();
    const existe = await this.usuariosRepository.findOne({ where: { email: emailNormalizado } });

    if (existe) {
      throw new BadRequestException('El correo ya existe.');
    }

    const nuevoUsuario = this.usuariosRepository.create({
      nombre: createAuthDto.nombre.trim(),
      email: emailNormalizado,
      contrasenaHash: hashContrasena(createAuthDto.contrasena),
      rol: 'cliente',
    });

    const usuarioGuardado = await this.usuariosRepository.save(nuevoUsuario);

    return {
      mensaje: 'Usuario registrado correctamente.',
      usuario: this.sanitizarUsuario(usuarioGuardado),
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const emailNormalizado = loginAuthDto.email.trim().toLowerCase();
    const usuario = await this.usuariosRepository.findOne({ where: { email: emailNormalizado } });

    if (!usuario || !verificarContrasena(loginAuthDto.contrasena, usuario.contrasenaHash)) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const token = randomBytes(32).toString('hex');
    const expiraEn = new Date(Date.now() + 1000 * 60 * 60 * 8);

    await this.sesionesRepository.save(
      this.sesionesRepository.create({
        token,
        usuarioId: usuario.id,
        expiraEn,
      }),
    );

    return {
      token,
      usuario: this.sanitizarUsuario(usuario),
    };
  }

  me(usuario: UsuarioAutenticado) {
    return usuario;
  }

  async logout(token: string) {
    await this.sesionesRepository.delete({ token });
    return { mensaje: 'Sesion cerrada correctamente.' };
  }

  private sanitizarUsuario(usuario: Usuario): UsuarioAutenticado {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol as UsuarioAutenticado['rol'],
    };
  }
}
