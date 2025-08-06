#!/bin/bash

# MCP Magic Server Installation Script

echo "Installing MCP Magic Server..."

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
echo "The Magic server will be automatically downloaded when first used via npx."

echo ""
echo "MCP Magic Server setup complete!"
echo ""
echo "Configuration added to .vscode/mcp.json"
echo "The server provides AI-powered UI component generation."
echo ""
echo "Features:"
echo "- AI-powered UI generation through natural language"
echo "- Modern component library access"
echo "- TypeScript support"
echo "- Real-time component preview"
echo "- SVGL integration for professional brand assets"
echo "- Seamless IDE integration"
echo ""
echo "Usage:"
echo "- Use '/ui' command followed by your component description"
echo "- Example: '/ui create a modern navigation bar with responsive design'"
