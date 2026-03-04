import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { RedisModule } from './redis/redis.module.js';
import { AuthModule } from './auth/auth.module.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { IndicatorsModule } from './indicators/indicators.module.js';
import { DataSourcesModule } from './data-sources/data-sources.module.js';
import { ProposalsModule } from './proposals/proposals.module.js';
import { CorrelationsModule } from './correlations/correlations.module.js';
import { NewsModule } from './news/news.module.js';
import { EtlModule } from './etl/etl.module.js';

@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    AuthModule,
    HealthModule,
    UsersModule,
    IndicatorsModule,
    DataSourcesModule,
    ProposalsModule,
    CorrelationsModule,
    NewsModule,
    EtlModule,
  ],
})
export class AppModule {}
