import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatDate,
  formatPValue,
  formatRValue,
  formatCorrelationStrength,
} from '@/lib/format';

describe('formatNumber', () => {
  it('formats billions', () => {
    expect(formatNumber(1_500_000_000)).toBe('1.50B');
  });

  it('formats millions', () => {
    expect(formatNumber(2_300_000)).toBe('2.30M');
  });

  it('formats thousands', () => {
    expect(formatNumber(45_600)).toBe('45.60K');
  });

  it('formats small numbers', () => {
    expect(formatNumber(123.456)).toBe('123.46');
  });

  it('respects custom decimals', () => {
    expect(formatNumber(1_500_000_000, 1)).toBe('1.5B');
  });

  it('handles negative numbers', () => {
    expect(formatNumber(-2_300_000)).toBe('-2.30M');
  });
});

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('2024');
    expect(result).toContain('Jan');
  });

  it('formats Date object', () => {
    const result = formatDate(new Date('2024-06-01'));
    expect(result).toContain('2024');
  });
});

describe('formatPValue', () => {
  it('shows < 0.001 for very small values', () => {
    expect(formatPValue(0.0001)).toBe('< 0.001');
  });

  it('formats normal p-values to 3 decimals', () => {
    expect(formatPValue(0.05)).toBe('0.050');
  });
});

describe('formatRValue', () => {
  it('formats to 3 decimals', () => {
    expect(formatRValue(0.85432)).toBe('0.854');
  });

  it('handles negative values', () => {
    expect(formatRValue(-0.5)).toBe('-0.500');
  });
});

describe('formatCorrelationStrength', () => {
  it('returns Very Strong for r >= 0.8', () => {
    expect(formatCorrelationStrength(0.85)).toBe('Very Strong');
  });

  it('returns Strong for r >= 0.6', () => {
    expect(formatCorrelationStrength(0.65)).toBe('Strong');
  });

  it('returns Moderate for r >= 0.4', () => {
    expect(formatCorrelationStrength(0.45)).toBe('Moderate');
  });

  it('returns Weak for r >= 0.2', () => {
    expect(formatCorrelationStrength(0.25)).toBe('Weak');
  });

  it('returns Very Weak for r < 0.2', () => {
    expect(formatCorrelationStrength(0.1)).toBe('Very Weak');
  });

  it('uses absolute value for negative r', () => {
    expect(formatCorrelationStrength(-0.9)).toBe('Very Strong');
  });
});
