import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const SortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).default('asc'),
});
export type Sort = z.infer<typeof SortSchema>;

export const DateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});
export type DateRange = z.infer<typeof DateRangeSchema>;

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    meta: z
      .object({
        page: z.number().optional(),
        pageSize: z.number().optional(),
        totalCount: z.number().optional(),
        totalPages: z.number().optional(),
      })
      .optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
      })
      .optional(),
  });
