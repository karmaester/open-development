import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { proposals } from './proposals.js';
import { users } from './users.js';

export const proposalComments = pgTable('proposal_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  proposalId: uuid('proposal_id')
    .notNull()
    .references(() => proposals.id),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
