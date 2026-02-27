export const ProposalStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  IMPLEMENTED: 'IMPLEMENTED',
} as const;

export type ProposalStatus = (typeof ProposalStatus)[keyof typeof ProposalStatus];
