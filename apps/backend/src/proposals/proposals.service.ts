import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import type { Database } from '@opendevelopment/db';
import { proposals, proposalComments } from '@opendevelopment/db';
import type { CreateProposal } from '@opendevelopment/shared-types';
import { ProposalStatus } from '@opendevelopment/shared-types';
import { DATABASE } from '../database/database.module.js';

@Injectable()
export class ProposalsService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findAll(filters: { status?: string; authorId?: string; page?: number; pageSize?: number }) {
    const { status, authorId, page = 1, pageSize = 20 } = filters;
    const conditions = [];
    if (status) conditions.push(eq(proposals.status, status));
    if (authorId) conditions.push(eq(proposals.authorId, authorId));

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db
        .select()
        .from(proposals)
        .where(where)
        .limit(pageSize)
        .offset(offset)
        .orderBy(proposals.createdAt),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(proposals)
        .where(where),
    ]);

    const totalCount = countResult[0]?.count ?? 0;
    return {
      data,
      meta: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
    };
  }

  async findById(id: string) {
    const [proposal] = await this.db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
    if (!proposal) throw new NotFoundException('Proposal not found');

    const comments = await this.db
      .select()
      .from(proposalComments)
      .where(eq(proposalComments.proposalId, id))
      .orderBy(proposalComments.createdAt);

    return { ...proposal, comments };
  }

  async create(data: CreateProposal, authorId: string) {
    const [proposal] = await this.db
      .insert(proposals)
      .values({ ...data, authorId, status: ProposalStatus.DRAFT })
      .returning();
    return proposal;
  }

  async update(id: string, data: Partial<CreateProposal>, userId: string, userRole: string) {
    const [existing] = await this.db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
    if (!existing) throw new NotFoundException('Proposal not found');

    if (userRole !== 'ADMIN' && existing.authorId !== userId) {
      throw new ForbiddenException('Only the author or an admin can update this proposal');
    }
    if (userRole !== 'ADMIN' && existing.status !== ProposalStatus.DRAFT) {
      throw new ForbiddenException('Can only update proposals in DRAFT status');
    }

    const [proposal] = await this.db
      .update(proposals)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(proposals.id, id))
      .returning();
    return proposal;
  }

  async updateStatus(id: string, status: string) {
    const [proposal] = await this.db
      .update(proposals)
      .set({ status, updatedAt: new Date() })
      .where(eq(proposals.id, id))
      .returning();
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }

  async addComment(proposalId: string, authorId: string, content: string) {
    const [existing] = await this.db
      .select()
      .from(proposals)
      .where(eq(proposals.id, proposalId))
      .limit(1);
    if (!existing) throw new NotFoundException('Proposal not found');

    const [comment] = await this.db
      .insert(proposalComments)
      .values({ proposalId, authorId, content })
      .returning();
    return comment;
  }

  async findComments(proposalId: string, page = 1, pageSize = 50) {
    const offset = (page - 1) * pageSize;
    const [data, countResult] = await Promise.all([
      this.db
        .select()
        .from(proposalComments)
        .where(eq(proposalComments.proposalId, proposalId))
        .limit(pageSize)
        .offset(offset)
        .orderBy(proposalComments.createdAt),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(proposalComments)
        .where(eq(proposalComments.proposalId, proposalId)),
    ]);

    const totalCount = countResult[0]?.count ?? 0;
    return {
      data,
      meta: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
    };
  }
}
