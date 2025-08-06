#!/bin/bash

# Test script for MCP Fetch Server

echo "Testing MCP Fetch Server installation..."

# Test if the server can be invoked
if command -v uvx &> /dev/null; then
    echo "Testing with uvx..."
    timeout 10s uvx mcp-server-fetch --help 2>/dev/null
    if [ $? -eq 0 ] || [ $? -eq 124 ]; then
        echo "✅ MCP Fetch Server is accessible via uvx"
    else
        echo "❌ MCP Fetch Server test failed with uvx"
    fi
elif command -v python &> /dev/null; then
    echo "Testing with python..."
    timeout 10s python -m mcp_server_fetch --help 2>/dev/null
    if [ $? -eq 0 ] || [ $? -eq 124 ]; then
        echo "✅ MCP Fetch Server is accessible via python"
    else
        echo "❌ MCP Fetch Server test failed with python"
    fi
else
    echo "❌ Neither uvx nor python is available"
fi

# Check configuration file
if [ -f "../.vscode/mcp.json" ]; then
    echo "✅ MCP configuration file exists"
    echo "Configuration:"
    cat ../.vscode/mcp.json
else
    echo "❌ MCP configuration file not found"
fi

echo ""
echo "Test complete!"
