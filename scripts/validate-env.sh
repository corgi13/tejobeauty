#!/bin/bash

echo "=== Environment Variable Validation ==="
echo ""

# Frontend validation
echo "Frontend Environment Variables:"
echo "Checking frontend/.env.local..."

if [ -f "frontend/.env.local" ]; then
    echo "✓ frontend/.env.local exists"
    
    # Check required frontend variables
    if grep -q "NEXT_PUBLIC_API_URL" frontend/.env.local; then
        API_URL=$(grep "NEXT_PUBLIC_API_URL" frontend/.env.local | cut -d'=' -f2)
        echo "✓ NEXT_PUBLIC_API_URL: $API_URL"
    else
        echo "✗ NEXT_PUBLIC_API_URL missing"
    fi
    
    if grep -q "NEXT_PUBLIC_FRONTEND_URL" frontend/.env.local; then
        FRONTEND_URL=$(grep "NEXT_PUBLIC_FRONTEND_URL" frontend/.env.local | cut -d'=' -f2)
        echo "✓ NEXT_PUBLIC_FRONTEND_URL: $FRONTEND_URL"
    else
        echo "✗ NEXT_PUBLIC_FRONTEND_URL missing"
    fi
    
    if grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" frontend/.env.local; then
        echo "✓ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY configured"
    else
        echo "✗ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY missing"
    fi
else
    echo "✗ frontend/.env.local not found"
fi

echo ""

# Backend validation
echo "Backend Environment Variables:"
echo "Checking backend/.env..."

if [ -f "backend/.env" ]; then
    echo "✓ backend/.env exists"
    
    # Check required backend variables
    if grep -q "^PORT=" backend/.env; then
        PORT=$(grep "^PORT=" backend/.env | cut -d'=' -f2 | tr -d '"')
        echo "✓ PORT: $PORT"
    else
        echo "✗ PORT missing"
    fi
    
    if grep -q "DATABASE_URL" backend/.env; then
        echo "✓ DATABASE_URL configured"
    else
        echo "✗ DATABASE_URL missing"
    fi
    
    if grep -q "JWT_SECRET" backend/.env; then
        echo "✓ JWT_SECRET configured"
    else
        echo "✗ JWT_SECRET missing"
    fi
    
    if grep -q "FRONTEND_URL" backend/.env; then
        BACKEND_FRONTEND_URL=$(grep "FRONTEND_URL" backend/.env | cut -d'=' -f2 | tr -d '"')
        echo "✓ FRONTEND_URL: $BACKEND_FRONTEND_URL"
    else
        echo "✗ FRONTEND_URL missing"
    fi
else
    echo "✗ backend/.env not found"
fi

echo ""
echo "=== Port Consistency Check ==="

# Extract ports from configuration
FRONTEND_API_PORT=$(grep "NEXT_PUBLIC_API_URL" frontend/.env.local 2>/dev/null | grep -o ':300[0-9]' | cut -d':' -f2)
BACKEND_PORT=$(grep "^PORT=" backend/.env 2>/dev/null | cut -d'=' -f2 | tr -d '"')

if [ "$FRONTEND_API_PORT" = "$BACKEND_PORT" ]; then
    echo "✓ Port configuration is consistent: $BACKEND_PORT"
else
    echo "✗ Port mismatch - Frontend expects: $FRONTEND_API_PORT, Backend uses: $BACKEND_PORT"
fi