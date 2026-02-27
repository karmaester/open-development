import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));

async function reset() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();

  try {
    console.log('Dropping all tables...');

    // Drop continuous aggregates first
    await client.query('DROP MATERIALIZED VIEW IF EXISTS indicator_data_yearly CASCADE;');

    // Drop tables in reverse dependency order
    await client.query(`
      DROP TABLE IF EXISTS etl_runs CASCADE;
      DROP TABLE IF EXISTS proposal_comments CASCADE;
      DROP TABLE IF EXISTS proposals CASCADE;
      DROP TABLE IF EXISTS correlations CASCADE;
      DROP TABLE IF EXISTS news_items CASCADE;
      DROP TABLE IF EXISTS indicator_data CASCADE;
      DROP TABLE IF EXISTS indicators CASCADE;
      DROP TABLE IF EXISTS data_sources CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    console.log('All tables dropped.');

    // Re-initialize TimescaleDB extension (drizzle-kit push will recreate tables)
    console.log('Note: Run the following commands to fully reset:');
    console.log('  pnpm turbo db:push');
    console.log('  pnpm turbo db:init-timescale');
    console.log('  pnpm turbo db:seed');
  } catch (error) {
    console.error('Reset failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

reset().catch((error) => {
  console.error('Reset failed:', error);
  process.exit(1);
});
