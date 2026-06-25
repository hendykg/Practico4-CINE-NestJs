import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Sesion } from '../auth/entities/sesion.entity';
import { Usuario } from '../auth/entities/auth.entity';
import { ROLES_KEY } from './roles.decorator';
import { RolUsuario } from './app.types';

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization || typeof authorization !== 'string') {
      throw new UnauthorizedException('Debes iniciar sesion para acceder.');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token de acceso invalido.');
    }

    const sesionesRepository = this.dataSource.getRepository(Sesion);
    const usuariosRepository = this.dataSource.getRepository(Usuario);
    const sesion = await sesionesRepository.findOne({ where: { token } });

    if (!sesion) {
      throw new UnauthorizedException('La sesion no es valida o expiro.');
    }

    if (sesion.expiraEn.getTime() <= Date.now()) {
      await sesionesRepository.delete({ token });
      throw new UnauthorizedException('La sesion no es valida o expiro.');
    }

    const usuario = await usuariosRepository.findOne({ where: { id: sesion.usuarioId } });

    if (!usuario) {
      throw new UnauthorizedException('La sesion no es valida o expiro.');
    }

    request.user = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };
    request.authToken = token;

    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<RolUsuario[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new ForbiddenException('No tienes permisos para acceder.');
    }

    if (!roles.includes(request.user.rol)) {
      throw new ForbiddenException('No tienes permisos para realizar esta accion.');
    }

    return true;
  }
}
