import { z } from 'zod';

export const IndicatorSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  unit: z.string().max(50).optional(),
  sourceId: z.string().uuid(),
  category: z.string(),
  sdgGoal: z.number().int().min(1).max(17).optional(),
  createdAt: z.coerce.date(),
});
export type Indicator = z.infer<typeof IndicatorSchema>;

export const IndicatorDataPointSchema = z.object({
  indicatorId: z.string().uuid(),
  countryCode: z.string().length(3),
  year: z.number().int().min(1900).max(2100),
  value: z.number(),
  metadata: z.record(z.unknown()).optional(),
  recordedAt: z.coerce.date(),
});
export type IndicatorDataPoint = z.infer<typeof IndicatorDataPointSchema>;

export const CreateIndicatorSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  unit: z.string().max(50).optional(),
  sourceId: z.string().uuid(),
  category: z.string(),
  sdgGoal: z.number().int().min(1).max(17).optional(),
});
export type CreateIndicator = z.infer<typeof CreateIndicatorSchema>;
