#!/bin/bash

# MCP Fetch Server Installation Script

echo "Installing MCP Fetch Server..."

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "Installing uv (Python package manager)..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    source $HOME/.cargo/env
fi

# Check if uvx is available
if ! command -v uvx &> /dev/null; then
    echo "uvx not available. Installing mcp-server-fetch via pip..."
    pip install mcp-server-fetch
else
    echo "Using uvx to run mcp-server-fetch..."
    echo "The server will be automatically downloaded when first used."
fi

echo "MCP Fetch Server setup complete!"
echo ""
echo "Configuration added to .vscode/mcp.json"
echo "The fetch server provides web fetching capabilities for AI assistants."
echo ""
echo "Features:"
echo "- Fetch web pages and extract content"
echo "- Convert HTML to markdown"
echo "- Respect robots.txt (configurable)"
echo "- Custom user-agent support"
echo "- Proxy support"
