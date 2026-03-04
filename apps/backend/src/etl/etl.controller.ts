import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserRole } from '@opendevelopment/shared-types';
import { Roles } from '../auth/decorators.js';
import { EtlService } from './etl.service.js';

@Controller('etl')
export class EtlController {
  constructor(private readonly etlService: EtlService) {}

  @Post('run/:sourceId')
  @Roles(UserRole.ADMIN)
  triggerRun(@Param('sourceId') sourceId: string) {
    return this.etlService.triggerRun(sourceId);
  }

  @Get('runs')
  @Roles(UserRole.ADMIN)
  findRuns(
    @Query('sourceId') sourceId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.etlService.findRuns({
      sourceId,
      status,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Get('runs/:id')
  @Roles(UserRole.ADMIN)
  findRunById(@Param('id') id: string) {
    return this.etlService.findRunById(id);
  }
}
