import { Global, Module } from '@nestjs/common';
import { db, pool } from '@opendevelopment/db';

export const DATABASE = Symbol('DATABASE');
export const DATABASE_POOL = Symbol('DATABASE_POOL');

@Global()
@Module({
  providers: [
    { provide: DATABASE, useValue: db },
    { provide: DATABASE_POOL, useValue: pool },
  ],
  exports: [DATABASE, DATABASE_POOL],
})
export class DatabaseModule {}
