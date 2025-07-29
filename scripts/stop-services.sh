#!/bin/bash

echo "=== Stopping Tejo Nails Platform Services ==="

# Function to stop process by name
stop_process() {
    local process_name=$1
    local service_name=$2
    
    if pgrep -f "$process_name" > /dev/null; then
        echo "Stopping $service_name..."
        pkill -f "$process_name"
        sleep 2
        
        # Check if process is still running
        if pgrep -f "$process_name" > /dev/null; then
            echo "Force killing $service_name..."
            pkill -9 -f "$process_name"
        fi
        echo "✓ $service_name stopped"
    else
        echo "✓ $service_name was not running"
    fi
}

# Stop frontend
stop_process "next dev" "Frontend"

# Stop backend
stop_process "nest" "Backend"

# Additional cleanup for any remaining node processes on our ports
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Cleaning up remaining processes on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Cleaning up remaining processes on port 3002..."
    lsof -ti:3002 | xargs kill -9 2>/dev/null || true
fi

echo ""
echo "=== All services stopped ==="