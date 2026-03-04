import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import type { Database } from '@opendevelopment/db';
import { users } from '@opendevelopment/db';
import type { CreateUser } from '@opendevelopment/shared-types';
import { DATABASE } from '../database/database.module.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: CreateUser) {
    const [user] = await this.db.insert(users).values(data).returning();
    if (!user) throw new Error('Failed to create user');
    const token = await this.generateToken(user);
    return { token, user };
  }

  async login(email: string) {
    const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) throw new UnauthorizedException('User not found');
    const token = await this.generateToken(user);
    return { token, user };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getUserById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user ?? null;
  }

  private async generateToken(user: { id: string; email: string; role: string }) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.signAsync(payload);
  }
}
