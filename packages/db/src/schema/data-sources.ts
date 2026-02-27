import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const dataSources = pgTable('data_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 30 }).notNull(),
  baseUrl: text('base_url').notNull(),
  apiVersion: varchar('api_version', { length: 20 }),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
