import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { indicators } from './indicators.js';
import { users } from './users.js';

export const proposals = pgTable('proposals', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  indicatorAId: uuid('indicator_a_id')
    .notNull()
    .references(() => indicators.id),
  indicatorBId: uuid('indicator_b_id')
    .notNull()
    .references(() => indicators.id),
  hypothesis: text('hypothesis').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('DRAFT'),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
