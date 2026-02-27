export const UserRole = {
  ADMIN: 'ADMIN',
  RESEARCHER: 'RESEARCHER',
  CONTRIBUTOR: 'CONTRIBUTOR',
  VIEWER: 'VIEWER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
