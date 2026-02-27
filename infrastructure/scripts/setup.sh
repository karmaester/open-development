#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$PROJECT_ROOT/infrastructure/docker/docker-compose.yml"

echo "=== OpenDevelopment Local Setup ==="
echo ""

# 1. Start Docker services
echo "Starting Docker services..."
docker compose -f "$COMPOSE_FILE" up -d

# 2. Wait for services to be healthy
echo "Waiting for PostgreSQL to be healthy..."
RETRIES=30
until docker compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U postgres -d opendevelopment > /dev/null 2>&1; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -eq 0 ]; then
    echo "ERROR: PostgreSQL failed to become healthy"
    exit 1
  fi
  echo "  Waiting for PostgreSQL... ($RETRIES attempts remaining)"
  sleep 2
done
echo "  PostgreSQL is healthy."

echo "Waiting for Redis to be healthy..."
RETRIES=15
until docker compose -f "$COMPOSE_FILE" exec -T redis redis-cli ping > /dev/null 2>&1; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -eq 0 ]; then
    echo "ERROR: Redis failed to become healthy"
    exit 1
  fi
  echo "  Waiting for Redis... ($RETRIES attempts remaining)"
  sleep 2
done
echo "  Redis is healthy."

echo ""

# 3. Run database setup
echo "Pushing database schema..."
cd "$PROJECT_ROOT"
pnpm turbo db:push

echo "Initializing TimescaleDB..."
pnpm turbo db:init-timescale

echo "Seeding database..."
pnpm turbo db:seed

echo ""
echo "=== Setup Complete ==="
echo "  PostgreSQL: localhost:5432 (user: postgres, db: opendevelopment)"
echo "  Redis:      localhost:6379"
echo ""
echo "Run 'pnpm turbo dev' to start development servers."
