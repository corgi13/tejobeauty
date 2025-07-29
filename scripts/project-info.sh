#!/bin/bash
# project-info.sh - Display comprehensive project information

echo "📋 Tejo Nails Platform - Project Information"
echo "=============================================="

# Project structure
echo ""
echo "📁 Project Structure:"
tree -L 3 -I 'node_modules|dist|build|coverage|.git' . 2>/dev/null || find . -type d -not -path '*/node_modules*' -not -path '*/dist*' -not -path '*/build*' -not -path '*/.git*' | head -20

# Git information
echo ""
echo "🔧 Git Information:"
if [ -d ".git" ]; then
    echo "Current branch: $(git branch --show-current 2>/dev/null || echo 'N/A')"
    echo "Last commit: $(git log -1 --pretty=format:'%h - %s (%cr)' 2>/dev/null || echo 'N/A')"
    echo "Remote origin: $(git remote get-url origin 2>/dev/null || echo 'N/A')"
else
    echo "Not a git repository"
fi

# Environment information
echo ""
echo "🌍 Environment:"
echo "Node.js: $(node -v 2>/dev/null || echo 'Not installed')"
echo "npm: $(npm -v 2>/dev/null || echo 'Not installed')"
echo "Docker: $(docker -v 2>/dev/null || echo 'Not installed')"
echo "Docker Compose: $(docker-compose -v 2>/dev/null || echo 'Not installed')"

# Package information
echo ""
echo "📦 Dependencies:"
if [ -f "backend/package.json" ]; then
    echo "Backend dependencies: $(jq -r '.dependencies | keys | length' backend/package.json 2>/dev/null || echo 'N/A')"
fi
if [ -f "frontend/package.json" ]; then
    echo "Frontend dependencies: $(jq -r '.dependencies | keys | length' frontend/package.json 2>/dev/null || echo 'N/A')"
fi

# Service status
echo ""
echo "🚀 Service Status:"
check_service() {
    local name="$1"
    local url="$2"
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    if [ "$status" = "200" ]; then
        echo "✅ $name: Running (HTTP $status)"
    else
        echo "❌ $name: Not responding (HTTP $status)"
    fi
}

check_service "Backend API" "http://localhost:3002/api/system-health"
check_service "Frontend" "http://localhost:3000"

# Docker services
echo ""
echo "🐳 Docker Services:"
if command -v docker-compose &> /dev/null; then
    if [ -f "docker-compose.yml" ]; then
        echo "Development services:"
        docker-compose ps 2>/dev/null || echo "Services not running"
    fi
    if [ -f "docker-compose.prod.yml" ]; then
        echo "Production services:"
        docker-compose -f docker-compose.prod.yml ps 2>/dev/null || echo "Services not running"
    fi
else
    echo "Docker Compose not available"
fi

# Database information
echo ""
echo "🗄️ Database:"
if command -v docker-compose &> /dev/null; then
    DB_STATUS=$(docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready 2>/dev/null)
    if [[ $DB_STATUS == *"accepting connections"* ]]; then
        echo "✅ PostgreSQL: Connected"
        # Get database size
        DB_SIZE=$(docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d tejonails -c "SELECT pg_size_pretty(pg_database_size('tejonails'));" -t 2>/dev/null | xargs)
        echo "Database size: $DB_SIZE"
    else
        echo "❌ PostgreSQL: Not connected"
    fi
else
    echo "Database status: Unknown (Docker not available)"
fi

# Cache information
echo ""
echo "💾 Cache:"
if command -v docker-compose &> /dev/null; then
    REDIS_STATUS=$(docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping 2>/dev/null)
    if [[ $REDIS_STATUS == "PONG" ]]; then
        echo "✅ Redis: Connected"
        # Get Redis info
        REDIS_MEMORY=$(docker-compose -f docker-compose.prod.yml exec -T redis redis-cli info memory | grep used_memory_human | cut -d: -f2 | tr -d '\r' 2>/dev/null)
        echo "Redis memory usage: $REDIS_MEMORY"
    else
        echo "❌ Redis: Not connected"
    fi
else
    echo "Cache status: Unknown (Docker not available)"
fi

# System resources
echo ""
echo "💻 System Resources:"
echo "CPU Load: $(uptime | awk -F'load average:' '{print $2}')"
echo "Memory: $(free -h | awk 'NR==2{printf "%s/%s (%.0f%%)", $3,$2,$3*100/$2}')"
echo "Disk: $(df -h / | awk 'NR==2{printf "%s/%s (%s)", $3,$2,$5}')"

# Available scripts
echo ""
echo "🛠️ Available Scripts:"
if [ -d "scripts" ]; then
    for script in scripts/*.sh; do
        if [ -f "$script" ]; then
            echo "- $(basename "$script"): $(head -n 2 "$script" | tail -n 1 | sed 's/# //')"
        fi
    done
fi

# Configuration files
echo ""
echo "⚙️ Configuration Files:"
[ -f ".env" ] && echo "✅ .env" || echo "❌ .env (missing)"
[ -f ".env.example" ] && echo "✅ .env.example" || echo "❌ .env.example (missing)"
[ -f ".env.production" ] && echo "✅ .env.production" || echo "❌ .env.production (missing)"
[ -f "docker-compose.yml" ] && echo "✅ docker-compose.yml" || echo "❌ docker-compose.yml (missing)"
[ -f "docker-compose.prod.yml" ] && echo "✅ docker-compose.prod.yml" || echo "❌ docker-compose.prod.yml (missing)"

# Recent backups
echo ""
echo "💾 Recent Backups:"
if [ -d "backups" ]; then
    ls -la backups/*.tar.gz 2>/dev/null | tail -5 || echo "No backups found"
else
    echo "No backup directory found"
fi

# Cron jobs
echo ""
echo "⏰ Scheduled Tasks:"
crontab -l 2>/dev/null | grep -i tejonails || echo "No cron jobs found"

echo ""
echo "=============================================="
echo "For more information, check the README.md file"