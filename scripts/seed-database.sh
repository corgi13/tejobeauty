#!/bin/bash
# seed-database.sh - Seed the database with initial data

echo "🌱 Seeding database with initial data..."

# Check if running in Docker
if [ -f /.dockerenv ]; then
  echo "Running in Docker environment"
  cd /app && npx ts-node src/seed.ts
else
  # Running locally
  cd backend && npx ts-node src/seed.ts
fi

echo "Database seeding completed!"