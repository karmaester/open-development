import type { CreateUser } from '@opendevelopment/shared-types';
import { api } from './client';

export function register(data: CreateUser) {
  return api.post<{ token: string; user: any }>('/auth/register', data);
}

export function login(email: string) {
  return api.post<{ token: string; user: any }>('/auth/login', { email });
}

export function getMe() {
  return api.get<{ user: any }>('/auth/me');
}
