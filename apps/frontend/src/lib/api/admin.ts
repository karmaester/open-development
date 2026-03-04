import { api } from './client';

export function getUsers(params?: { page?: number; pageSize?: number }) {
  return api.get<any>('/users', params as any);
}

export function updateUser(id: string, data: { displayName?: string; role?: string }) {
  return api.patch<any>(`/users/${id}`, data);
}

export function triggerEtl(sourceId: string) {
  return api.post<any>(`/etl/run/${sourceId}`);
}

export function getEtlRuns(params?: {
  sourceId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return api.get<any>('/etl/runs', params as any);
}

export function getEtlRun(id: string) {
  return api.get<any>(`/etl/runs/${id}`);
}
