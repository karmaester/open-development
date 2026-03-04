import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import type { Database } from '@opendevelopment/db';
import { dataSources } from '@opendevelopment/db';
import type { CreateDataSource } from '@opendevelopment/shared-types';
import { DATABASE } from '../database/database.module.js';

@Injectable()
export class DataSourcesService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findAll(filters: { type?: string; isActive?: boolean; page?: number; pageSize?: number }) {
    const { type, isActive, page = 1, pageSize = 20 } = filters;
    const conditions = [];
    if (type) conditions.push(eq(dataSources.type, type));
    if (isActive !== undefined) conditions.push(eq(dataSources.isActive, isActive));

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db
        .select()
        .from(dataSources)
        .where(where)
        .limit(pageSize)
        .offset(offset)
        .orderBy(dataSources.name),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(dataSources)
        .where(where),
    ]);

    const totalCount = countResult[0]?.count ?? 0;
    return {
      data,
      meta: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
    };
  }

  async findById(id: string) {
    const [source] = await this.db
      .select()
      .from(dataSources)
      .where(eq(dataSources.id, id))
      .limit(1);
    if (!source) throw new NotFoundException('Data source not found');
    return source;
  }

  async create(data: CreateDataSource) {
    const [source] = await this.db.insert(dataSources).values(data).returning();
    return source;
  }

  async update(id: string, data: Partial<CreateDataSource>) {
    const [source] = await this.db
      .update(dataSources)
      .set(data)
      .where(eq(dataSources.id, id))
      .returning();
    if (!source) throw new NotFoundException('Data source not found');
    return source;
  }

  async remove(id: string) {
    const [source] = await this.db.delete(dataSources).where(eq(dataSources.id, id)).returning();
    if (!source) throw new NotFoundException('Data source not found');
    return source;
  }
}
