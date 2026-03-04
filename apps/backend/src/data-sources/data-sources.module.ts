import { Module } from '@nestjs/common';
import { DataSourcesController } from './data-sources.controller.js';
import { DataSourcesService } from './data-sources.service.js';

@Module({
  controllers: [DataSourcesController],
  providers: [DataSourcesService],
  exports: [DataSourcesService],
})
export class DataSourcesModule {}
