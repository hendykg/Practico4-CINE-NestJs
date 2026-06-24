import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SALT_LENGTH = 16;

export function hashContrasena(contrasena: string): string {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const hash = scryptSync(contrasena, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verificarContrasena(contrasena: string, contrasenaHash: string): boolean {
  const [salt, hashGuardado] = contrasenaHash.split(':');

  if (!salt || !hashGuardado) {
    return false;
  }

  const hashActual = scryptSync(contrasena, salt, 64);
  const hashEsperado = Buffer.from(hashGuardado, 'hex');

  if (hashActual.length !== hashEsperado.length) {
    return false;
  }

  return timingSafeEqual(hashActual, hashEsperado);
}
