import { api } from './client';

interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; pageSize: number; totalCount: number; totalPages: number };
}

export function getIndicators(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  sdgGoal?: number;
  sourceId?: string;
}) {
  return api.get<PaginatedResponse<any>>('/indicators', params as any);
}

export function getIndicator(id: string) {
  return api.get<any>(`/indicators/${id}`);
}

export function getIndicatorData(
  id: string,
  params?: {
    countryCode?: string;
    startYear?: number;
    endYear?: number;
    page?: number;
    pageSize?: number;
  },
) {
  return api.get<PaginatedResponse<any>>(`/indicators/${id}/data`, params as any);
}

export function createIndicator(data: any) {
  return api.post<any>('/indicators', data);
}
