import { z } from 'zod';
import { CorrelationMethod, CorrelationStatus } from '../enums/correlation.enum.js';

export const CorrelationSchema = z.object({
  id: z.string().uuid(),
  indicatorAId: z.string().uuid(),
  indicatorBId: z.string().uuid(),
  method: z.nativeEnum(CorrelationMethod),
  rValue: z.number().min(-1).max(1).nullable(),
  pValue: z.number().min(0).max(1).nullable(),
  sampleSize: z.number().int().positive().nullable(),
  countryCode: z.string().length(3).optional(),
  timeRangeStart: z.number().int().optional(),
  timeRangeEnd: z.number().int().optional(),
  status: z.nativeEnum(CorrelationStatus),
  createdBy: z.string().uuid().optional(),
  createdAt: z.coerce.date(),
});
export type Correlation = z.infer<typeof CorrelationSchema>;

export const CorrelationResultSchema = z.object({
  rValue: z.number().min(-1).max(1),
  pValue: z.number().min(0).max(1),
  sampleSize: z.number().int().positive(),
  confidenceInterval: z
    .object({
      lower: z.number(),
      upper: z.number(),
    })
    .optional(),
});
export type CorrelationResult = z.infer<typeof CorrelationResultSchema>;
