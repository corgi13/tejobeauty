#!/bin/bash
# system-check.sh - Check the health of all system components

echo "🔍 Checking system health..."

# Check Docker services if running in Docker
if command -v docker-compose &> /dev/null; then
  echo "Checking Docker services..."
  docker-compose -f docker-compose.prod.yml ps
fi

# Check backend health
echo "Checking backend API..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/system-health)

if [ "$BACKEND_HEALTH" == "200" ]; then
  echo "✅ Backend API is healthy"
else
  echo "❌ Backend API is not responding (Status: $BACKEND_HEALTH)"
fi

# Check frontend
echo "Checking frontend..."
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$FRONTEND_HEALTH" == "200" ]; then
  echo "✅ Frontend is accessible"
else
  echo "❌ Frontend is not responding (Status: $FRONTEND_HEALTH)"
fi

# Check database connection
echo "Checking database connection..."
if command -v docker-compose &> /dev/null; then
  DB_STATUS=$(docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready 2>&1)
  if [[ $DB_STATUS == *"accepting connections"* ]]; then
    echo "✅ Database is accepting connections"
  else
    echo "❌ Database connection issue: $DB_STATUS"
  fi
fi

# Check Redis connection
echo "Checking Redis connection..."
if command -v docker-compose &> /dev/null; then
  REDIS_STATUS=$(docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping 2>&1)
  if [[ $REDIS_STATUS == "PONG" ]]; then
    echo "✅ Redis is responding"
  else
    echo "❌ Redis connection issue: $REDIS_STATUS"
  fi
fi

# Check disk space
echo "Checking disk space..."
df -h | grep -E '(Filesystem|/$)'

# Check memory usage
echo "Checking memory usage..."
free -h

# Check CPU load
echo "Checking CPU load..."
uptime

echo "System health check completed!"