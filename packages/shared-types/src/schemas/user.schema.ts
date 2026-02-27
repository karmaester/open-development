import { z } from 'zod';
import { UserRole } from '../enums/user.enum.js';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(2).max(100),
  role: z.nativeEnum(UserRole).default(UserRole.VIEWER),
  avatarUrl: z.string().url().optional(),
});
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string(),
  role: z.nativeEnum(UserRole),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;
