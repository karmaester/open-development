import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateDataSourceSchema, UserRole } from '@opendevelopment/shared-types';
import type { CreateDataSource } from '@opendevelopment/shared-types';
import { Public, Roles } from '../auth/decorators.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { DataSourcesService } from './data-sources.service.js';

@Controller('data-sources')
export class DataSourcesController {
  constructor(private readonly dataSourcesService: DataSourcesService) {}

  @Public()
  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.dataSourcesService.findAll({
      type,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.dataSourcesService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body(new ZodValidationPipe(CreateDataSourceSchema)) body: CreateDataSource) {
    return this.dataSourcesService.create(body);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() body: Partial<CreateDataSource>) {
    return this.dataSourcesService.update(id, body);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.dataSourcesService.remove(id);
  }
}
