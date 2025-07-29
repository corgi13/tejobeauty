#!/bin/bash

echo "=== Port Configuration Check ==="
echo "Frontend: Port 3000"
echo "Backend: Port 3002"
echo ""

echo "=== Firewall Status ==="
sudo ufw status | grep -E "(3000|3002)"
echo ""

echo "=== Active Processes on Ports ==="
echo "Port 3000 (Frontend):"
sudo lsof -i :3000 || echo "No process listening on port 3000"
echo ""
echo "Port 3002 (Backend):"
sudo lsof -i :3002 || echo "No process listening on port 3002"
echo ""

echo "=== Network Connectivity Test ==="
echo "Testing local connectivity..."
curl -s -o /dev/null -w "Frontend (3000): %{http_code}\n" http://localhost:3000 || echo "Frontend (3000): Connection failed"
curl -s -o /dev/null -w "Backend (3002): %{http_code}\n" http://localhost:3002/api || echo "Backend (3002): Connection failed"