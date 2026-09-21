export type EstadoComision = 'atrasado' | 'demorado' | 'completado';

export interface Comision {
  _id: string;
  descripcion: string;
  estado: EstadoComision;
  imagenes: string[];
  creador: string;
  createdAt: string;
  updatedAt: string;
}

export interface Usuario {
  _id?: string;
  id?: string;
  nombre: string;
  email: string;
  fotoPerfil?: string;
}

export interface ApiMensaje { mensaje?: string; error?: string; }
