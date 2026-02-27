import { pgTable, uuid, varchar, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { dataSources } from './data-sources.js';

export const etlRuns = pgTable('etl_runs', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceId: uuid('source_id')
    .notNull()
    .references(() => dataSources.id),
  status: varchar('status', { length: 20 }).notNull().default('PENDING'),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  recordsProcessed: integer('records_processed').default(0),
  errors: jsonb('errors'),
});
