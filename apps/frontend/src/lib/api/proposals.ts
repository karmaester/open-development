import type { CreateProposal } from '@opendevelopment/shared-types';
import { api } from './client';

export function getProposals(params?: {
  status?: string;
  authorId?: string;
  page?: number;
  pageSize?: number;
}) {
  return api.get<any>('/proposals', params as any);
}

export function getProposal(id: string) {
  return api.get<any>(`/proposals/${id}`);
}

export function createProposal(data: CreateProposal) {
  return api.post<any>('/proposals', data);
}

export function updateProposal(id: string, data: Partial<CreateProposal>) {
  return api.patch<any>(`/proposals/${id}`, data);
}

export function updateProposalStatus(id: string, status: string) {
  return api.patch<any>(`/proposals/${id}/status`, { status });
}

export function addComment(proposalId: string, content: string) {
  return api.post<any>(`/proposals/${proposalId}/comments`, { content });
}

export function getComments(proposalId: string, params?: { page?: number; pageSize?: number }) {
  return api.get<any>(`/proposals/${proposalId}/comments`, params as any);
}
