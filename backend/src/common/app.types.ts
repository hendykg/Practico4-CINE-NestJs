export type RolUsuario = 'cliente' | 'administrador';

export interface UsuarioAutenticado {
  id: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
}
