import { Controller, Get, Inject } from '@nestjs/common';
import type { Pool } from 'pg';
import type Redis from 'ioredis';
import { DATABASE_POOL } from '../database/database.module.js';
import { REDIS } from '../redis/redis.module.js';
import { Public } from '../auth/decorators.js';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(DATABASE_POOL) private readonly pool: Pool,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  @Public()
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Public()
  @Get('db')
  async checkDb() {
    try {
      const result = await this.pool.query('SELECT 1 as check');
      return { status: 'ok', result: result.rows[0] };
    } catch (error) {
      return { status: 'error', message: (error as Error).message };
    }
  }

  @Public()
  @Get('redis')
  async checkRedis() {
    try {
      const pong = await this.redis.ping();
      return { status: 'ok', result: pong };
    } catch (error) {
      return { status: 'error', message: (error as Error).message };
    }
  }
}
