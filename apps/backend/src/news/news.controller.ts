import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateNewsItemSchema, UserRole } from '@opendevelopment/shared-types';
import type { CreateNewsItem } from '@opendevelopment/shared-types';
import { Public, Roles } from '../auth/decorators.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { NewsService } from './news.service.js';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Public()
  @Get()
  findAll(
    @Query('source') source?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.newsService.findAll({
      source,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.newsService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body(new ZodValidationPipe(CreateNewsItemSchema)) body: CreateNewsItem) {
    return this.newsService.create(body);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
