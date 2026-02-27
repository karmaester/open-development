export const CorrelationMethod = {
  PEARSON: 'PEARSON',
  SPEARMAN: 'SPEARMAN',
  KENDALL: 'KENDALL',
} as const;

export type CorrelationMethod = (typeof CorrelationMethod)[keyof typeof CorrelationMethod];

export const CorrelationStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type CorrelationStatus = (typeof CorrelationStatus)[keyof typeof CorrelationStatus];
