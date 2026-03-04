import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import type { Database } from '@opendevelopment/db';
import { dataSources, etlRuns, indicatorData, indicators } from '@opendevelopment/db';
import { connectorRegistry } from '@opendevelopment/data-connectors';
import type { DataSourceType } from '@opendevelopment/shared-types';
import { DATABASE } from '../database/database.module.js';

@Injectable()
export class EtlService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async triggerRun(sourceId: string) {
    const [source] = await this.db
      .select()
      .from(dataSources)
      .where(eq(dataSources.id, sourceId))
      .limit(1);
    if (!source) throw new NotFoundException('Data source not found');

    const connector = connectorRegistry.get(source.type as DataSourceType);
    if (!connector) {
      throw new NotFoundException(`No connector registered for source type: ${source.type}`);
    }

    const [run] = await this.db.insert(etlRuns).values({ sourceId, status: 'RUNNING' }).returning();

    // Run ETL asynchronously (don't await — return the run record immediately)
    this.executeRun(run!.id, connector, source).catch(() => {
      // Error handling happens inside executeRun
    });

    return run;
  }

  private async executeRun(
    runId: string,
    connector: ReturnType<typeof connectorRegistry.get> & object,
    source: { id: string },
  ) {
    try {
      const rawData = await connector.extract({});
      const transformed = connector.transform(rawData);
      const validated = connector.validate(transformed);

      // Look up indicator IDs by code
      const allIndicators = await this.db.select().from(indicators);
      const indicatorMap = new Map(allIndicators.map((i) => [i.code, i.id]));

      const rows = validated
        .map((record) => {
          const indicatorId = indicatorMap.get(record.indicatorCode);
          if (!indicatorId) return null;
          return {
            indicatorId,
            countryCode: record.countryCode,
            year: record.year,
            value: record.value!,
            metadata: record.metadata ?? null,
          };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null);

      if (rows.length > 0) {
        await this.db
          .insert(indicatorData)
          .values(rows)
          .onConflictDoUpdate({
            target: [indicatorData.indicatorId, indicatorData.countryCode, indicatorData.year],
            set: { value: sql`excluded.value`, metadata: sql`excluded.metadata` },
          });
      }

      await this.db
        .update(etlRuns)
        .set({ status: 'COMPLETED', completedAt: new Date(), recordsProcessed: rows.length })
        .where(eq(etlRuns.id, runId));

      await this.db
        .update(dataSources)
        .set({ lastSyncAt: new Date() })
        .where(eq(dataSources.id, source.id));
    } catch (error) {
      await this.db
        .update(etlRuns)
        .set({
          status: 'FAILED',
          completedAt: new Date(),
          errors: { message: (error as Error).message },
        })
        .where(eq(etlRuns.id, runId));
    }
  }

  async findRuns(filters: {
    sourceId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { sourceId, status, page = 1, pageSize = 20 } = filters;
    const conditions = [];
    if (sourceId) conditions.push(eq(etlRuns.sourceId, sourceId));
    if (status) conditions.push(eq(etlRuns.status, status));

    const where = conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db
        .select()
        .from(etlRuns)
        .where(where)
        .limit(pageSize)
        .offset(offset)
        .orderBy(etlRuns.startedAt),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(etlRuns)
        .where(where),
    ]);

    const totalCount = countResult[0]?.count ?? 0;
    return {
      data,
      meta: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
    };
  }

  async findRunById(id: string) {
    const [run] = await this.db.select().from(etlRuns).where(eq(etlRuns.id, id)).limit(1);
    if (!run) throw new NotFoundException('ETL run not found');
    return run;
  }
}
