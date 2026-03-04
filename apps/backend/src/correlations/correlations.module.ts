import { Module } from '@nestjs/common';
import { CorrelationsController } from './correlations.controller.js';
import { CorrelationsService } from './correlations.service.js';

@Module({
  controllers: [CorrelationsController],
  providers: [CorrelationsService],
  exports: [CorrelationsService],
})
export class CorrelationsModule {}
