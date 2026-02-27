-- ===========================================
-- TimescaleDB Initialization Script
-- ===========================================
-- This script runs AFTER drizzle-kit push creates the tables.
-- It converts indicator_data to a hypertable and creates
-- continuous aggregates and custom indexes.

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Convert indicator_data to a hypertable partitioned on recorded_at
-- Using if_not_exists to make this script idempotent
SELECT create_hypertable(
  'indicator_data',
  'recorded_at',
  if_not_exists => TRUE,
  migrate_data => TRUE
);

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_indicator_data_country_indicator
  ON indicator_data (country_code, indicator_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_indicator_data_indicator_year
  ON indicator_data (indicator_id, year);

CREATE INDEX IF NOT EXISTS idx_indicator_data_country_year
  ON indicator_data (country_code, year);

-- Continuous aggregate: yearly summary per indicator per country
CREATE MATERIALIZED VIEW IF NOT EXISTS indicator_data_yearly
WITH (timescaledb.continuous) AS
SELECT
  indicator_id,
  country_code,
  time_bucket('365 days', recorded_at) AS bucket,
  AVG(value) AS avg_value,
  MIN(value) AS min_value,
  MAX(value) AS max_value,
  COUNT(*) AS data_points
FROM indicator_data
GROUP BY indicator_id, country_code, bucket
WITH NO DATA;

-- Add refresh policy for the continuous aggregate (refresh last 2 years of data daily)
SELECT add_continuous_aggregate_policy('indicator_data_yearly',
  start_offset => INTERVAL '2 years',
  end_offset => INTERVAL '1 day',
  schedule_interval => INTERVAL '1 day',
  if_not_exists => TRUE
);
