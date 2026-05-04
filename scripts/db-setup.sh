#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

docker compose -f db/docker-compose.yml up -d

for i in $(seq 1 30); do
  if docker exec ironfit-postgis pg_isready -U postgres -d ironfit >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

docker exec -i ironfit-postgis psql -U postgres -d ironfit < db/schema.sql

echo "Ironfit PostGIS pronto em postgresql://postgres:postgres@127.0.0.1:5434/ironfit"
