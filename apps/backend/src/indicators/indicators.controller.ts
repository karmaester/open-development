import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateIndicatorSchema, UserRole } from '@opendevelopment/shared-types';
import { Public, Roles } from '../auth/decorators.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { IndicatorsService } from './indicators.service.js';
import type { CreateIndicator } from '@opendevelopment/shared-types';

@Controller('indicators')
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  @Public()
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('category') category?: string,
    @Query('sdgGoal') sdgGoal?: string,
    @Query('sourceId') sourceId?: string,
  ) {
    return this.indicatorsService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      category,
      sdgGoal: sdgGoal ? parseInt(sdgGoal, 10) : undefined,
      sourceId,
    });
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.indicatorsService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RESEARCHER)
  create(@Body(new ZodValidationPipe(CreateIndicatorSchema)) body: CreateIndicator) {
    return this.indicatorsService.create(body);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RESEARCHER)
  update(@Param('id') id: string, @Body() body: Partial<CreateIndicator>) {
    return this.indicatorsService.update(id, body);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.indicatorsService.remove(id);
  }

  @Public()
  @Get(':id/data')
  findData(
    @Param('id') id: string,
    @Query('countryCode') countryCode?: string,
    @Query('startYear') startYear?: string,
    @Query('endYear') endYear?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.indicatorsService.findData(id, {
      countryCode,
      startYear: startYear ? parseInt(startYear, 10) : undefined,
      endYear: endYear ? parseInt(endYear, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Post(':id/data')
  @Roles(UserRole.ADMIN, UserRole.RESEARCHER)
  addData(
    @Param('id') id: string,
    @Body()
    body: Array<{
      countryCode: string;
      year: number;
      value: number;
      metadata?: Record<string, unknown>;
    }>,
  ) {
    return this.indicatorsService.addData(id, body);
  }
}
