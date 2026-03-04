import { api } from './client';

export function getCorrelations(params?: {
  status?: string;
  indicatorId?: string;
  method?: string;
  page?: number;
  pageSize?: number;
}) {
  return api.get<any>('/correlations', params as any);
}

export function getCorrelation(id: string) {
  return api.get<any>(`/correlations/${id}`);
}

export function createCorrelation(data: {
  indicatorAId: string;
  indicatorBId: string;
  method: string;
  countryCode?: string;
  timeRangeStart?: number;
  timeRangeEnd?: number;
}) {
  return api.post<any>('/correlations', data);
}
