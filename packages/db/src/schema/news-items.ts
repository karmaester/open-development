import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const newsItems = pgTable('news_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 300 }).notNull(),
  url: text('url').notNull(),
  source: varchar('source', { length: 100 }).notNull(),
  summary: text('summary'),
  publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
  relatedIndicatorIds: text('related_indicator_ids').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
