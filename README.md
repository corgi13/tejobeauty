````markdown
# Tejo Beauty

## Opis

Ovo je projekt za Tejo Beauty web shop.

## Pokretanje

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## MCP Integration

Projekat sada uključuje Model Context Protocol (MCP) servere za poboljšane AI mogućnosti:

- **Fetch Server**: Omogućava AI asistentima pristup web stranicama u realnom vremenu
- **Sequential Thinking Server**: Pruža strukturirane mogućnosti razmišljanja za kompleksno rešavanje problema
- **Magic Server (21st.dev)**: AI-powered generiranje UI komponenti kroz prirodni jezik
- **Konfiguracija**: `.vscode/mcp.json`
- **Dokumentacija**: 
  - [Fetch Server Integration](./MCP-FETCH-INTEGRATION.md)
  - [Sequential Thinking Integration](./MCP-SEQUENTIAL-THINKING-INTEGRATION.md)
  - [Magic Server Integration](./MCP-MAGIC-INTEGRATION.md)
- **Instalacija**: 
  - Windows: `mcp-servers\install-*.bat` skriptovi
  - Linux/macOS: `mcp-servers/install-*.sh` skriptovi
  - Test: `mcp-servers/test-all-servers.sh`

Za više informacija, pogledajte [MCP Integration dokumentaciju](./mcp-servers/README.md).

````
