import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import type { Database } from '@opendevelopment/db';
import { indicators, indicatorData } from '@opendevelopment/db';
import type { CreateIndicator } from '@opendevelopment/shared-types';
import { DATABASE } from '../database/database.module.js';
import { RedisService } from '../redis/redis.service.js';

@Injectable()
export class IndicatorsService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly redis: RedisService,
  ) {}

  async findAll(filters: {
    page?: number;
    pageSize?: number;
    category?: string;
    sdgGoal?: number;
    sourceId?: string;
  }) {
    const { page = 1, pageSize = 20, category, sdgGoal, sourceId } = filters;
    const cacheKey = `indicators:list:${JSON.stringify(filters)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const conditions = [];
    if (category) conditions.push(eq(indicators.category, category));
    if (sdgGoal) conditions.push(eq(indicators.sdgGoal, sdgGoal));
    if (sourceId) conditions.push(eq(indicators.sourceId, sourceId));

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db
        .select()
        .from(indicators)
        .where(where)
        .limit(pageSize)
        .offset(offset)
        .orderBy(indicators.name),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(indicators)
        .where(where),
    ]);

    const totalCount = countResult[0]?.count ?? 0;
    const result = {
      data,
      meta: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
    };
    await this.redis.set(cacheKey, result);
    return result;
  }

  async findById(id: string) {
    const cacheKey = `indicators:${id}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const [indicator] = await this.db
      .select()
      .from(indicators)
      .where(eq(indicators.id, id))
      .limit(1);
    if (!indicator) throw new NotFoundException('Indicator not found');

    await this.redis.set(cacheKey, indicator);
    return indicator;
  }

  async create(data: CreateIndicator) {
    const [indicator] = await this.db.insert(indicators).values(data).returning();
    await this.redis.flushPattern('indicators:list:*');
    return indicator;
  }

  async update(id: string, data: Partial<CreateIndicator>) {
    const [indicator] = await this.db
      .update(indicators)
      .set(data)
      .where(eq(indicators.id, id))
      .returning();
    if (!indicator) throw new NotFoundException('Indicator not found');
    await this.redis.del(`indicators:${id}`);
    await this.redis.flushPattern('indicators:list:*');
    return indicator;
  }

  async remove(id: string) {
    const [indicator] = await this.db.delete(indicators).where(eq(indicators.id, id)).returning();
    if (!indicator) throw new NotFoundException('Indicator not found');
    await this.redis.del(`indicators:${id}`);
    await this.redis.flushPattern('indicators:list:*');
    return indicator;
  }

  async findData(
    indicatorId: string,
    filters: {
      countryCode?: string;
      startYear?: number;
      endYear?: number;
      page?: number;
      pageSize?: number;
    },
  ) {
    const { countryCode, startYear, endYear, page = 1, pageSize = 100 } = filters;

    const conditions = [eq(indicatorData.indicatorId, indicatorId)];
    if (countryCode) conditions.push(eq(indicatorData.countryCode, countryCode));
    if (startYear) conditions.push(gte(indicatorData.year, startYear));
    if (endYear) conditions.push(lte(indicatorData.year, endYear));

    const where = and(...conditions);
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db
        .select()
        .from(indicatorData)
        .where(where)
        .limit(pageSize)
        .offset(offset)
        .orderBy(indicatorData.year),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(indicatorData)
        .where(where),
    ]);

    const totalCount = countResult[0]?.count ?? 0;
    return {
      data,
      meta: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
    };
  }

  async addData(
    indicatorId: string,
    points: Array<{
      countryCode: string;
      year: number;
      value: number;
      metadata?: Record<string, unknown>;
    }>,
  ) {
    const rows = points.map((p) => ({ ...p, indicatorId }));
    const inserted = await this.db.insert(indicatorData).values(rows).returning();
    return inserted;
  }
}
