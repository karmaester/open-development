import { api } from './client';

export function getDataSources(params?: {
  type?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}) {
  return api.get<any>('/data-sources', params as any);
}

export function getDataSource(id: string) {
  return api.get<any>(`/data-sources/${id}`);
}

export function createDataSource(data: any) {
  return api.post<any>('/data-sources', data);
}
