import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import type { Database } from '@opendevelopment/db';
import { users } from '@opendevelopment/db';
import { DATABASE } from '../database/database.module.js';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findAll(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    const [data, countResult] = await Promise.all([
      this.db.select().from(users).limit(pageSize).offset(offset).orderBy(users.createdAt),
      this.db.select({ count: sql<number>`count(*)::int` }).from(users),
    ]);
    const totalCount = countResult[0]?.count ?? 0;
    return {
      data,
      meta: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
    };
  }

  async findById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(
    id: string,
    data: Partial<{ displayName: string; role: string; avatarUrl: string }>,
  ) {
    const [user] = await this.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
