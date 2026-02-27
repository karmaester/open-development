import { IndicatorDataPointSchema } from '@opendevelopment/shared-types';
import type { z } from 'zod';

type IndicatorDataPoint = z.infer<typeof IndicatorDataPointSchema>;

export interface ValidationResult {
  valid: boolean;
  data?: IndicatorDataPoint;
  errors?: string[];
}

/**
 * Validate a data point against the IndicatorDataPointSchema.
 *
 * @param data - Raw data point to validate
 * @returns Validation result with parsed data or error messages
 */
export function validateDataPoint(data: unknown): ValidationResult {
  const result = IndicatorDataPointSchema.safeParse(data);

  if (result.success) {
    return { valid: true, data: result.data };
  }

  return {
    valid: false,
    errors: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
  };
}

/**
 * Validate an array of data points, returning only valid entries.
 *
 * @param dataPoints - Array of raw data points
 * @returns Object with valid data points and any errors encountered
 */
export function validateDataPoints(dataPoints: unknown[]): {
  valid: IndicatorDataPoint[];
  errors: Array<{ index: number; errors: string[] }>;
} {
  const valid: IndicatorDataPoint[] = [];
  const errors: Array<{ index: number; errors: string[] }> = [];

  for (let i = 0; i < dataPoints.length; i++) {
    const result = validateDataPoint(dataPoints[i]);
    if (result.valid && result.data) {
      valid.push(result.data);
    } else if (result.errors) {
      errors.push({ index: i, errors: result.errors });
    }
  }

  return { valid, errors };
}
