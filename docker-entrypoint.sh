#!/bin/sh
set -e

echo "=========================================="
echo "  RithuDevQuest Container Initialization   "
echo "=========================================="

# 1. Wait for PostgreSQL connection
echo "==> Verifying database connection..."
until pg_isready -h "${DB_HOST:-postgres}" -p "${DB_PORT:-5432}" -U "${POSTGRES_USER:-rithu}" > /dev/null 2>&1; do
  echo "    Database not ready yet, waiting 2s..."
  sleep 2
done
echo "==> Database connection verified!"

# 2. Apply Prisma database migrations
echo "==> Applying database migrations..."
npx prisma migrate deploy

# 3. Seed curriculum and achievements
echo "==> Seeding curriculum data (idempotent)..."
npx tsx prisma/seed.ts || echo "==> Seeding step completed."

echo "=========================================="
echo "  Starting Next.js Server on port ${PORT:-3000}  "
echo "=========================================="

exec "$@"
