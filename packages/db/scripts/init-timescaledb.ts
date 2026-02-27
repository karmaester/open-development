import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));

async function initTimescaleDB() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  try {
    const sql = readFileSync(join(__dirname, 'init-timescaledb.sql'), 'utf-8');
    console.log('Initializing TimescaleDB...');
    await client.query(sql);
    console.log('TimescaleDB initialized successfully.');
    console.log('  - indicator_data converted to hypertable');
    console.log('  - Custom indexes created');
    console.log('  - Continuous aggregate created');
  } catch (error) {
    console.error('Failed to initialize TimescaleDB:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initTimescaleDB();
