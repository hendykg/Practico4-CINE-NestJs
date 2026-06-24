import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataStoreService } from './data-store.service';
import { ROLES_KEY } from './roles.decorator';
import { RolUsuario } from './app.types';

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(private readonly dataStore: DataStoreService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization || typeof authorization !== 'string') {
      throw new UnauthorizedException('Debes iniciar sesion para acceder.');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token de acceso invalido.');
    }

    const usuario = this.dataStore.buscarUsuarioPorToken(token);

    if (!usuario) {
      throw new UnauthorizedException('La sesion no es valida o expiro.');
    }

    request.user = this.dataStore.sanitizarUsuario(usuario);
    request.authToken = token;

    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataStore: DataStoreService,
  ) {}

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

    const usuario = this.dataStore.getUsuarios().find((item) => item.id === request.user.id);

    if (!usuario || !roles.includes(usuario.rol)) {
      throw new ForbiddenException('No tienes permisos para realizar esta accion.');
    }

    return true;
  }
}
