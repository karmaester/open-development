import { pgTable, uuid, varchar, integer, doublePrecision, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { indicators } from './indicators.js';

export const indicatorData = pgTable('indicator_data', {
  id: uuid('id').defaultRandom().primaryKey(),
  indicatorId: uuid('indicator_id')
    .notNull()
    .references(() => indicators.id),
  countryCode: varchar('country_code', { length: 3 }).notNull(),
  year: integer('year').notNull(),
  value: doublePrecision('value').notNull(),
  metadata: jsonb('metadata'),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
});
