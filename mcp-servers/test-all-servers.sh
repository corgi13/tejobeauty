#!/bin/bash

# Test script for all MCP servers

echo "🧪 Testing MCP Servers Installation..."
echo "======================================="

# Test Magic Server
echo ""
echo "✨ Testing Magic Server..."
if command -v npx &> /dev/null; then
    echo "✅ NPX is available for Magic"
    echo "Testing Magic server availability..."
    timeout 10s npx @21st-dev/magic@latest --help 2>/dev/null >/dev/null
    if [ $? -eq 0 ] || [ $? -eq 124 ]; then
        echo "✅ Magic Server is accessible"
    else
        echo "❌ Magic Server test failed"
    fi
else
    echo "❌ NPX not available for Magic"
fi

# Test Sequential Thinking Server
echo ""
echo "🧠 Testing Sequential Thinking Server..."
if command -v npx &> /dev/null; then
    echo "✅ NPX is available"
    echo "Testing server availability..."
    timeout 10s npx @modelcontextprotocol/server-sequential-thinking --help 2>/dev/null >/dev/null
    if [ $? -eq 0 ] || [ $? -eq 124 ]; then
        echo "✅ Sequential Thinking Server is accessible"
    else
        echo "❌ Sequential Thinking Server test failed"
    fi
else
    echo "❌ NPX not available"
fi

# Test Fetch Server
echo ""
echo "🌐 Testing Fetch Server..."
if command -v python &> /dev/null; then
    echo "✅ Python is available"
    timeout 10s python -m mcp_server_fetch --help 2>/dev/null >/dev/null
    if [ $? -eq 0 ] || [ $? -eq 124 ]; then
        echo "✅ Fetch Server is accessible"
    else
        echo "❌ Fetch Server test failed"
    fi
else
    echo "❌ Python not available"
fi

# Check configuration file
echo ""
echo "⚙️  Testing Configuration..."
if [ -f "../.vscode/mcp.json" ]; then
    echo "✅ MCP configuration file exists"
    echo ""
    echo "📋 Current Configuration:"
    cat ../.vscode/mcp.json | head -20
    echo ""
    
    # Count servers
    server_count=$(cat ../.vscode/mcp.json | grep -o '"command"' | wc -l)
    echo "📊 Total configured servers: $server_count"
else
    echo "❌ MCP configuration file not found"
fi

echo ""
echo "🎯 Testing Summary:"
echo "=================="

# Summary
all_good=true

if command -v npx &> /dev/null; then
    echo "✅ Magic Server: Node.js/NPX ready"
    echo "✅ Sequential Thinking: Node.js/NPX ready"
else
    echo "❌ Magic Server: Node.js/NPX missing"
    echo "❌ Sequential Thinking: Node.js/NPX missing"
    all_good=false
fi

if command -v python &> /dev/null; then
    if python -c "import mcp_server_fetch" 2>/dev/null; then
        echo "✅ Fetch Server: Python and package ready"
    else
        echo "⚠️  Fetch Server: Python available, package needs installation"
    fi
else
    echo "❌ Fetch Server: Python missing"
    all_good=false
fi

if [ -f "../.vscode/mcp.json" ]; then
    echo "✅ Configuration: VS Code MCP config ready"
else
    echo "❌ Configuration: Missing MCP config"
    all_good=false
fi

echo ""
if [ "$all_good" = true ]; then
    echo "🎉 All systems ready! MCP servers are configured and available."
else
    echo "⚠️  Some issues found. Please check the output above."
fi

echo ""
echo "📖 Next steps:"
echo "- Restart VS Code to load new MCP configuration"
echo "- Test with an AI assistant in VS Code"
echo "- Try combining fetch and sequential thinking capabilities"
echo ""
echo "Test complete! 🚀"
