import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { HealthController } from '../src/health/health.controller.js';
import { DATABASE_POOL } from '../src/database/database.module.js';
import { REDIS } from '../src/redis/redis.module.js';

describe('HealthController', () => {
  let app: INestApplication;
  let controller: HealthController;

  const mockPool = {
    query: async () => ({ rows: [{ check: 1 }] }),
  };

  const mockRedis = {
    ping: async () => 'PONG',
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: DATABASE_POOL, useValue: mockPool },
        { provide: REDIS, useValue: mockRedis },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    controller = module.get<HealthController>(HealthController);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('should return health status', () => {
    const result = controller.check();
    expect(result).toHaveProperty('status', 'ok');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('uptime');
  });

  it('should check database connectivity', async () => {
    const result = await controller.checkDb();
    expect(result).toHaveProperty('status', 'ok');
  });

  it('should check redis connectivity', async () => {
    const result = await controller.checkRedis();
    expect(result).toEqual({ status: 'ok', result: 'PONG' });
  });

  it('should handle database errors gracefully', async () => {
    const failPool = {
      query: async () => {
        throw new Error('Connection refused');
      },
    };
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: DATABASE_POOL, useValue: failPool },
        { provide: REDIS, useValue: mockRedis },
      ],
    }).compile();

    const failController = module.get<HealthController>(HealthController);
    const result = await failController.checkDb();
    expect(result).toHaveProperty('status', 'error');
    expect(result).toHaveProperty('message', 'Connection refused');
  });

  it('should handle redis errors gracefully', async () => {
    const failRedis = {
      ping: async () => {
        throw new Error('Redis down');
      },
    };
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: DATABASE_POOL, useValue: mockPool },
        { provide: REDIS, useValue: failRedis },
      ],
    }).compile();

    const failController = module.get<HealthController>(HealthController);
    const result = await failController.checkRedis();
    expect(result).toHaveProperty('status', 'error');
    expect(result).toHaveProperty('message', 'Redis down');
  });
});
