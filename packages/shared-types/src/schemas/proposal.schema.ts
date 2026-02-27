import { z } from 'zod';
import { ProposalStatus } from '../enums/proposal.enum.js';

export const ProposalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).max(200),
  description: z.string().min(20),
  indicatorAId: z.string().uuid(),
  indicatorBId: z.string().uuid(),
  hypothesis: z.string().min(10),
  status: z.nativeEnum(ProposalStatus),
  authorId: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Proposal = z.infer<typeof ProposalSchema>;

export const CreateProposalSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20),
  indicatorAId: z.string().uuid(),
  indicatorBId: z.string().uuid(),
  hypothesis: z.string().min(10),
});
export type CreateProposal = z.infer<typeof CreateProposalSchema>;
