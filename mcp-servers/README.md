# MCP Servers for Tejo Beauty

This directory contains Model Context Protocol (MCP) server configurations and installation scripts for the Tejo Beauty project.

## Installed Servers

### Fetch Server
- **Purpose**: Provides web fetching capabilities for AI assistants
- **Configuration**: Located in `.vscode/mcp.json`
- **Installation**: Run `./install-fetch.sh` or `install-fetch.bat`

#### Features:
- Fetch web pages and extract content as markdown
- Respect robots.txt (configurable)
- Custom user-agent support
- Proxy support
- Convert HTML content to readable text

### Sequential Thinking Server
- **Purpose**: Provides structured thinking capabilities for complex problem-solving
- **Configuration**: Located in `.vscode/mcp.json`
- **Installation**: Run `./install-sequential-thinking.sh` or `install-sequential-thinking.bat`

#### Features:
- Dynamic and reflective problem-solving
- Structured thinking process with branching
- Revision and refinement of thoughts
- Context-aware multi-step reasoning
### Magic Server (21st.dev)
- **Purpose**: AI-powered UI component generation through natural language
- **Configuration**: Located in `.vscode/mcp.json` 
- **Installation**: Run `./install-magic.sh` or `install-magic.bat`

#### Features:
- AI-powered UI generation through natural language descriptions
- Modern component library access inspired by 21st.dev
- TypeScript support with type-safe development
- Real-time component preview
- SVGL integration for professional brand assets
- Seamless IDE integration

#### Usage:
The fetch server allows AI assistants to:
- Access web content in real-time
- Extract information from websites
- Convert HTML pages to structured markdown
- Follow links and gather information from multiple sources

#### Usage:
The sequential thinking server allows AI assistants to:
- Break down complex problems into manageable steps
- Revise and refine thinking as understanding deepens
- Create branching thought processes for alternative approaches
- Maintain context across multiple reasoning steps
- Question and validate previous thoughts
#### Usage:
The magic server allows AI assistants to:
- Generate UI components from natural language descriptions
- Access a vast library of modern, customizable components
- Create TypeScript-safe React components
- Integrate professional brand assets and logos
- Preview components in real-time
- Follow your project's code style and structure

#### Configuration Options:
- `--user-agent`: Custom User-Agent string
- `--ignore-robots-txt`: Ignore robots.txt restrictions
- `--proxy-url`: Proxy URL for requests

## VS Code Integration

The MCP servers are automatically configured for VS Code through the `.vscode/mcp.json` file. This allows AI assistants in VS Code to use these tools seamlessly.

## Adding More Servers

To add additional MCP servers:

1. Add the server configuration to `.vscode/mcp.json`
2. Create an installation script in this directory
3. Update this README with server details

## Installation

To install all MCP servers, run:

```bash
# Linux/macOS
chmod +x mcp-servers/*.sh
./mcp-servers/install-fetch.sh
./mcp-servers/install-sequential-thinking.sh
./mcp-servers/install-magic.sh

# Windows
mcp-servers\install-fetch.bat
mcp-servers\install-sequential-thinking.bat
mcp-servers\install-magic.bat
```

## Requirements

- Python 3.8+ (for fetch server)
- Node.js 18+ (for sequential thinking server)
- uv (Python package manager) - will be automatically installed if needed
- VS Code with MCP support

## Documentation

For more information about the Model Context Protocol:
- [MCP Specification](https://modelcontextprotocol.io/)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
