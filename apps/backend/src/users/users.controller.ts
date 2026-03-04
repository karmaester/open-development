import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UserRole } from '@opendevelopment/shared-types';
import { Roles } from '../auth/decorators.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.usersService.findAll(
      page ? parseInt(page, 10) : undefined,
      pageSize ? parseInt(pageSize, 10) : undefined,
    );
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ displayName: string; role: string; avatarUrl: string }>,
  ) {
    return this.usersService.update(id, body);
  }
}
