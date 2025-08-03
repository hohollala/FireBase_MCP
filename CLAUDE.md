# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Firebase MCP (Model Context Protocol) Server that enables AI development tools (Claude Code, Claude Desktop, Gemini CLI, Cursor IDE) to interact with Firebase services through the MCP protocol. The server acts as a bridge between AI assistants and Firebase services including Authentication, Firestore, Storage, Functions, Analytics, Messaging, and more.

## Architecture Overview

The project follows a layered architecture:

- **MCP Protocol Layer**: Handles JSON-RPC 2.0 communication with AI clients
- **Tool Router**: Routes MCP tool calls to appropriate Firebase service handlers  
- **Firebase Service Layer**: Abstracts Firebase Admin SDK operations into discrete services
- **Web Dashboard**: Optional React-based monitoring interface

Key architectural principles:
- Each Firebase service (Auth, Firestore, Storage, etc.) has its own service class
- MCP tools are organized by service type and implement standardized interfaces
- Strict TypeScript typing throughout for type safety
- Modular plugin architecture for extensibility

## Project Structure

```
src/
├── server/          # MCP server core (protocol handler, tool router)
├── firebase/        # Firebase service handlers (auth.service.ts, firestore.service.ts, etc.)
├── tools/          # MCP tool definitions organized by Firebase service
├── types/          # TypeScript interfaces for MCP, Firebase, and common types
├── utils/          # Shared utilities (logger, validator, error-handler, config)
└── web/            # Express app for web dashboard

web-dashboard/      # React dashboard (separate from main server)
tests/             # Unit, integration, and E2E tests
config/            # Configuration files and Firebase service account keys
docs/              # Project documentation
```

## Development Setup

The project uses:
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.0+
- **MCP Framework**: @modelcontextprotocol/sdk
- **Firebase SDK**: firebase-admin
- **Web Framework**: Express.js
- **Frontend**: React/Next.js with Tailwind CSS
- **Testing**: Jest + Supertest
- **Build**: TypeScript Compiler + Webpack

## Core Concepts

### MCP Tools Organization
Tools are organized by Firebase service:
- `auth-tools.ts`: User management, authentication, custom claims
- `firestore-tools.ts`: Document CRUD, collections, queries, real-time listeners
- `storage-tools.ts`: File upload/download, metadata management
- `functions-tools.ts`: Function deployment, invocation, log retrieval

### Firebase Service Pattern
Each Firebase service follows a consistent pattern:
1. Service class implements Firebase Admin SDK operations
2. Service exposes methods that correspond to MCP tools
3. Error handling and validation at service level
4. Real-time features use Firebase listeners where applicable

### Configuration Management
- Firebase projects configured via service account keys in `config/`
- MCP server settings in `mcp-config.json`
- Environment-specific configuration support
- Runtime configuration validation

## Communication Protocols

### MCP Protocol
- **Transport**: stdio (primary) and HTTP (web dashboard)
- **Format**: JSON-RPC 2.0
- **Methods**: initialize, listTools, callTool, listResources, readResource, subscribe

### Firebase Integration
- Firebase Admin SDK for server-side operations
- Service account authentication required
- Real-time listeners for Firestore and Realtime Database
- Batch operations for performance optimization

## Development Phases

The project is structured in 4 development phases:

1. **Phase 1 (Foundation)**: MCP protocol + Auth + Firestore CRUD
2. **Phase 2 (Core Services)**: Storage + Functions + Realtime Database  
3. **Phase 3 (Advanced)**: Analytics + Messaging + Web Dashboard
4. **Phase 4 (Production)**: Additional services + Security + Deployment

## Key Implementation Notes

### Error Handling
- Firebase Admin SDK errors are caught and transformed to MCP-compatible responses
- Validation occurs at multiple layers (tool input, service operations, Firebase rules)
- Structured logging for debugging and monitoring

### Real-time Features
- Firestore and Realtime Database listeners implemented using Firebase SDK
- MCP notifications used to push real-time updates to clients
- Connection management for multiple concurrent listeners

### Security Considerations  
- Firebase service account keys must be stored securely
- MCP client authentication should be implemented
- Firebase security rules enforced at service level
- Input validation and sanitization required

### Performance Optimization
- Connection pooling for Firebase operations
- Caching strategies for frequently accessed data
- Batch operations where possible
- Memory usage monitoring (target: <512MB)

## Current Status

This is currently in the planning/documentation phase. The actual implementation has not yet begun. When starting development, begin with Phase 1 tasks: project setup, MCP protocol implementation, and basic Firebase Authentication integration.