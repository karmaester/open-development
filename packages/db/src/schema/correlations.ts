import { pgTable, uuid, varchar, doublePrecision, integer, timestamp } from 'drizzle-orm/pg-core';
import { indicators } from './indicators.js';
import { users } from './users.js';

export const correlations = pgTable('correlations', {
  id: uuid('id').defaultRandom().primaryKey(),
  indicatorAId: uuid('indicator_a_id')
    .notNull()
    .references(() => indicators.id),
  indicatorBId: uuid('indicator_b_id')
    .notNull()
    .references(() => indicators.id),
  method: varchar('method', { length: 20 }).notNull(),
  rValue: doublePrecision('r_value'),
  pValue: doublePrecision('p_value'),
  sampleSize: integer('sample_size'),
  countryCode: varchar('country_code', { length: 3 }),
  timeRangeStart: integer('time_range_start'),
  timeRangeEnd: integer('time_range_end'),
  status: varchar('status', { length: 20 }).notNull().default('PENDING'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
