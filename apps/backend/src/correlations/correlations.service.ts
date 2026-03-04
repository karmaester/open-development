import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, or, sql } from 'drizzle-orm';
import type { Database } from '@opendevelopment/db';
import { correlations } from '@opendevelopment/db';
import { DATABASE } from '../database/database.module.js';

@Injectable()
export class CorrelationsService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findAll(filters: {
    status?: string;
    indicatorId?: string;
    method?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { status, indicatorId, method, page = 1, pageSize = 20 } = filters;
    const conditions = [];
    if (status) conditions.push(eq(correlations.status, status));
    if (method) conditions.push(eq(correlations.method, method));
    if (indicatorId) {
      conditions.push(
        or(eq(correlations.indicatorAId, indicatorId), eq(correlations.indicatorBId, indicatorId))!,
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db
        .select()
        .from(correlations)
        .where(where)
        .limit(pageSize)
        .offset(offset)
        .orderBy(correlations.createdAt),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(correlations)
        .where(where),
    ]);

    const totalCount = countResult[0]?.count ?? 0;
    return {
      data,
      meta: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
    };
  }

  async findById(id: string) {
    const [correlation] = await this.db
      .select()
      .from(correlations)
      .where(eq(correlations.id, id))
      .limit(1);
    if (!correlation) throw new NotFoundException('Correlation not found');
    return correlation;
  }

  async create(data: {
    indicatorAId: string;
    indicatorBId: string;
    method: string;
    countryCode?: string;
    timeRangeStart?: number;
    timeRangeEnd?: number;
    createdBy?: string;
  }) {
    const [correlation] = await this.db
      .insert(correlations)
      .values({ ...data, status: 'PENDING' })
      .returning();
    return correlation;
  }

  async remove(id: string) {
    const [correlation] = await this.db
      .delete(correlations)
      .where(eq(correlations.id, id))
      .returning();
    if (!correlation) throw new NotFoundException('Correlation not found');
    return correlation;
  }
}
