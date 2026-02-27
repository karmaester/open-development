import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { dataSources } from './data-sources.js';

export const indicators = pgTable('indicators', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  unit: varchar('unit', { length: 50 }),
  sourceId: uuid('source_id')
    .notNull()
    .references(() => dataSources.id),
  category: varchar('category', { length: 50 }).notNull(),
  sdgGoal: integer('sdg_goal'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
