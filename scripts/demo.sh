#!/bin/bash
# demo.sh - Demonstrate Tejo Nails Platform functionality

echo "🎬 Tejo Nails Platform - Live Demo"
echo "=================================="

# Check if services are running
echo "Checking services..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/system-health)
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$BACKEND_STATUS" != "200" ] || [ "$FRONTEND_STATUS" != "200" ]; then
    echo "❌ Services not running. Please start with: ./quick-start.sh"
    exit 1
fi

echo "✅ All services are running!"
echo ""

# Demo 1: System Health
echo "📊 Demo 1: System Health Monitoring"
echo "-----------------------------------"
echo "Fetching system health data..."
curl -s http://localhost:3002/api/system-health | jq '.overall, .metrics.cpu, .metrics.memory' 2>/dev/null || curl -s http://localhost:3002/api/system-health | head -c 200
echo ""
echo ""

# Demo 2: Authentication
echo "🔐 Demo 2: User Authentication"
echo "------------------------------"
echo "Logging in as admin user..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tejonails.com","password":"admin123"}')

if [[ $LOGIN_RESPONSE == *"accessToken"* ]]; then
    echo "✅ Login successful!"
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:50}..."
else
    echo "❌ Login failed"
    echo "Response: $LOGIN_RESPONSE"
fi
echo ""

# Demo 3: Products
echo "🛍️ Demo 3: Product Catalog"
echo "--------------------------"
echo "Fetching products..."
PRODUCTS=$(curl -s http://localhost:3002/api/products)
echo "Products available:"
echo $PRODUCTS | jq '.[].name' 2>/dev/null || echo $PRODUCTS | head -c 300
echo ""

# Demo 4: Categories
echo "📂 Demo 4: Categories"
echo "--------------------"
echo "Fetching categories..."
CATEGORIES=$(curl -s http://localhost:3002/api/categories)
echo "Categories available:"
echo $CATEGORIES | jq '.[].name' 2>/dev/null || echo $CATEGORIES | head -c 200
echo ""

# Demo 5: Orders (if authenticated)
if [ ! -z "$TOKEN" ]; then
    echo "📦 Demo 5: Order Management"
    echo "--------------------------"
    echo "Fetching orders (authenticated)..."
    ORDERS=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3002/api/orders)
    echo "Orders:"
    echo $ORDERS | jq 'length' 2>/dev/null || echo $ORDERS | head -c 200
    echo ""
fi

# Demo 6: Frontend Pages
echo "🌐 Demo 6: Frontend Application"
echo "------------------------------"
echo "Frontend is running at: http://localhost:3000"
echo "Available pages:"
echo "- Home: http://localhost:3000"
echo "- Products: http://localhost:3000/products"
echo "- Login: http://localhost:3000/auth/login"
echo "- Admin: http://localhost:3000/admin"
echo ""

# Demo 7: API Documentation
echo "📚 Demo 7: API Documentation"
echo "----------------------------"
echo "Swagger UI available at: http://localhost:3002/api/docs"
echo "Interactive API documentation with all endpoints"
echo ""

# Demo 8: Performance Metrics
echo "⚡ Demo 8: Performance Metrics"
echo "-----------------------------"
echo "Current system performance:"
echo "CPU Load: $(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}')"
echo "Memory: $(free -h | awk 'NR==2{printf "%s/%s", $3,$2}')"
echo "Disk: $(df -h / | awk 'NR==2{printf "%s/%s", $3,$2}')"
echo ""

echo "🎉 Demo Complete!"
echo "================"
echo ""
echo "🔗 Quick Access Links:"
echo "- Frontend: http://localhost:3000"
echo "- API Docs: http://localhost:3002/api/docs"
echo "- Health: http://localhost:3002/api/system-health"
echo ""
echo "👤 Admin Login:"
echo "- Email: admin@tejonails.com"
echo "- Password: admin123"
echo ""
echo "🛠️ Management Commands:"
echo "- System Check: ./scripts/system-check.sh"
echo "- API Test: ./scripts/api-test.sh"
echo "- Project Info: ./scripts/project-info.sh"