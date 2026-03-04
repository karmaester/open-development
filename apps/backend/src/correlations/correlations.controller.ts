import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { UserRole } from '@opendevelopment/shared-types';
import { CurrentUser, Public, Roles } from '../auth/decorators.js';
import { CorrelationsService } from './correlations.service.js';

@Controller('correlations')
export class CorrelationsController {
  constructor(private readonly correlationsService: CorrelationsService) {}

  @Public()
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('indicatorId') indicatorId?: string,
    @Query('method') method?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.correlationsService.findAll({
      status,
      indicatorId,
      method,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.correlationsService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RESEARCHER)
  create(
    @Body()
    body: {
      indicatorAId: string;
      indicatorBId: string;
      method: string;
      countryCode?: string;
      timeRangeStart?: number;
      timeRangeEnd?: number;
    },
    @CurrentUser() user: any,
  ) {
    return this.correlationsService.create({ ...body, createdBy: user.id });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.correlationsService.remove(id);
  }
}
