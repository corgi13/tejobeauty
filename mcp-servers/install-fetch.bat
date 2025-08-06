@echo off
REM MCP Fetch Server Installation Script for Windows

echo Installing MCP Fetch Server...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.8+ first.
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if uv is installed
uv --version >nul 2>&1
if errorlevel 1 (
    echo Installing uv (Python package manager)...
    powershell -Command "& {irm https://astral.sh/uv/install.ps1 | iex}"
    call refreshenv
)

REM Check if uvx is available
uvx --version >nul 2>&1
if errorlevel 1 (
    echo uvx not available. Installing mcp-server-fetch via pip...
    pip install mcp-server-fetch
) else (
    echo Using uvx to run mcp-server-fetch...
    echo The server will be automatically downloaded when first used.
)

echo.
echo MCP Fetch Server setup complete!
echo.
echo Configuration added to .vscode/mcp.json
echo The fetch server provides web fetching capabilities for AI assistants.
echo.
echo Features:
echo - Fetch web pages and extract content
echo - Convert HTML to markdown
echo - Respect robots.txt (configurable)
echo - Custom user-agent support
echo - Proxy support
echo.
pause
