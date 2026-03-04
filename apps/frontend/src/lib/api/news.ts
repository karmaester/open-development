import { api } from './client';

export function getNews(params?: { source?: string; page?: number; pageSize?: number }) {
  return api.get<any>('/news', params as any);
}

export function getNewsItem(id: string) {
  return api.get<any>(`/news/${id}`);
}
