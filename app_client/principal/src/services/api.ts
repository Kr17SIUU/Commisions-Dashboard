import axios, { AxiosError } from 'axios';
import type { ApiMensaje, Comision, Usuario } from '../types';

export const api = axios.create({ baseURL: '/api' });

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiMensaje>;
    return axiosError.response?.data?.mensaje || axiosError.response?.data?.error || 'No se pudo completar la acción.';
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

export async function obtenerUsuario(userid: string): Promise<Usuario> {
  const { data } = await api.get<Usuario>(`/users/${userid}`);
  return data;
}
export async function listarComisiones(userid: string): Promise<Comision[]> {
  const { data } = await api.get<Comision[]>('/comisiones', { params: { creador: userid } });
  return data;
}
export async function crearComision(formData: FormData): Promise<Comision> {
  const { data } = await api.post<Comision>('/comisiones', formData);
  return data;
}
export async function actualizarComision(id: string, formData: FormData): Promise<Comision> {
  const { data } = await api.put<Comision>(`/comisiones/${id}`, formData);
  return data;
}
export async function eliminarComision(id: string, userId: string): Promise<void> {
  await api.delete(`/comisiones/${id}`, { data: { userId } });
}
