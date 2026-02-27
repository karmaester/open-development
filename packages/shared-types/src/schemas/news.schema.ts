import { z } from 'zod';

export const NewsItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(300),
  url: z.string().url(),
  source: z.string(),
  summary: z.string().optional(),
  publishedAt: z.coerce.date(),
  relatedIndicatorIds: z.array(z.string().uuid()).default([]),
  createdAt: z.coerce.date(),
});
export type NewsItem = z.infer<typeof NewsItemSchema>;

export const CreateNewsItemSchema = z.object({
  title: z.string().min(1).max(300),
  url: z.string().url(),
  source: z.string(),
  summary: z.string().optional(),
  publishedAt: z.coerce.date(),
  relatedIndicatorIds: z.array(z.string().uuid()).default([]),
});
export type CreateNewsItem = z.infer<typeof CreateNewsItemSchema>;
