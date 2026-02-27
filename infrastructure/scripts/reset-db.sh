#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$PROJECT_ROOT/infrastructure/docker/docker-compose.yml"

echo "=== OpenDevelopment Database Reset ==="
echo ""
echo "This will destroy ALL data and recreate the database from scratch."
read -p "Are you sure? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

# Stop and remove containers + volumes
echo "Stopping services and removing volumes..."
docker compose -f "$COMPOSE_FILE" down -v

# Re-run setup
echo "Re-running setup..."
"$SCRIPT_DIR/setup.sh"
