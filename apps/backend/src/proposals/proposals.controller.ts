import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateProposalSchema, UserRole } from '@opendevelopment/shared-types';
import type { CreateProposal } from '@opendevelopment/shared-types';
import { CurrentUser, Public, Roles } from '../auth/decorators.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { ProposalsService } from './proposals.service.js';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Public()
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('authorId') authorId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.proposalsService.findAll({
      status,
      authorId,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.proposalsService.findById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateProposalSchema)) body: CreateProposal,
    @CurrentUser() user: any,
  ) {
    return this.proposalsService.create(body, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateProposal>, @CurrentUser() user: any) {
    return this.proposalsService.update(id, body, user.id, user.role);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.RESEARCHER)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.proposalsService.updateStatus(id, status);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body('content') content: string, @CurrentUser() user: any) {
    return this.proposalsService.addComment(id, user.id, content);
  }

  @Public()
  @Get(':id/comments')
  findComments(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.proposalsService.findComments(
      id,
      page ? parseInt(page, 10) : undefined,
      pageSize ? parseInt(pageSize, 10) : undefined,
    );
  }
}
