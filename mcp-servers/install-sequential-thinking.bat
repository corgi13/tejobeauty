@echo off
REM MCP Sequential Thinking Server Installation Script for Windows

echo Installing MCP Sequential Thinking Server...

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo npm is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npx is available
npx --version >nul 2>&1
if errorlevel 1 (
    echo npx not available. Please make sure Node.js is properly installed.
    pause
    exit /b 1
)

echo Node.js and npm are available.
echo The Sequential Thinking server will be automatically downloaded when first used via npx.

echo.
echo MCP Sequential Thinking Server setup complete!
echo.
echo Configuration added to .vscode/mcp.json
echo The server provides structured thinking capabilities for AI assistants.
echo.
echo Features:
echo - Dynamic and reflective problem-solving
echo - Structured thinking process with branching
echo - Revision and refinement of thoughts
echo - Context-aware multi-step reasoning
echo - Flexible thought management
echo.
pause
