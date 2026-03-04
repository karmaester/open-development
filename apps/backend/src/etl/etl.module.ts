import { Module } from '@nestjs/common';
import { EtlController } from './etl.controller.js';
import { EtlService } from './etl.service.js';

@Module({
  controllers: [EtlController],
  providers: [EtlService],
  exports: [EtlService],
})
export class EtlModule {}
