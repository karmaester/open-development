import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import type { Database } from '@opendevelopment/db';
import { newsItems } from '@opendevelopment/db';
import type { CreateNewsItem } from '@opendevelopment/shared-types';
import { DATABASE } from '../database/database.module.js';

@Injectable()
export class NewsService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findAll(filters: { source?: string; page?: number; pageSize?: number }) {
    const { source, page = 1, pageSize = 20 } = filters;
    const where = source ? eq(newsItems.source, source) : undefined;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db
        .select()
        .from(newsItems)
        .where(where)
        .limit(pageSize)
        .offset(offset)
        .orderBy(newsItems.publishedAt),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(newsItems)
        .where(where),
    ]);

    const totalCount = countResult[0]?.count ?? 0;
    return {
      data,
      meta: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
    };
  }

  async findById(id: string) {
    const [item] = await this.db.select().from(newsItems).where(eq(newsItems.id, id)).limit(1);
    if (!item) throw new NotFoundException('News item not found');
    return item;
  }

  async create(data: CreateNewsItem) {
    const [item] = await this.db.insert(newsItems).values(data).returning();
    return item;
  }

  async remove(id: string) {
    const [item] = await this.db.delete(newsItems).where(eq(newsItems.id, id)).returning();
    if (!item) throw new NotFoundException('News item not found');
    return item;
  }
}
