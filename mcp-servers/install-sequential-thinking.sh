#!/bin/bash

# MCP Sequential Thinking Server Installation Script

echo "Installing MCP Sequential Thinking Server..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "npx not available. Please make sure Node.js is properly installed."
    exit 1
fi

echo "Node.js and npm are available."
echo "The Sequential Thinking server will be automatically downloaded when first used via npx."

echo ""
echo "MCP Sequential Thinking Server setup complete!"
echo ""
echo "Configuration added to .vscode/mcp.json"
echo "The server provides structured thinking capabilities for AI assistants."
echo ""
echo "Features:"
echo "- Dynamic and reflective problem-solving"
echo "- Structured thinking process with branching"
echo "- Revision and refinement of thoughts" 
echo "- Context-aware multi-step reasoning"
echo "- Flexible thought management"
