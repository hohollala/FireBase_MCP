# Firebase MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)

Firebase MCP (Model Context Protocol) Server enables AI development tools like Claude Code, Claude Desktop, Gemini CLI, and Cursor IDE to interact seamlessly with Firebase services.

## 🚀 Features

- **Complete Firebase Integration**: Authentication, Firestore, Storage, Functions, Analytics, Messaging, and more
- **MCP Protocol Compliant**: Full JSON-RPC 2.0 over MCP support
- **Multi-Client Support**: Claude Code, Claude Desktop, Gemini CLI, Cursor IDE
- **Real-time Capabilities**: Live data synchronization and listeners
- **Web Dashboard**: Firebase Console-style monitoring interface
- **TypeScript First**: 100% type safety and modern development experience

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Firebase project with Admin SDK credentials
- AI development tool supporting MCP protocol

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/firebase-mcp/firebase-mcp-server.git
cd firebase-mcp-server

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Build the project
npm run build
```

## ⚙️ Configuration

1. **Firebase Setup**:
   ```bash
   # Place your Firebase service account key
   cp /path/to/your/firebase-admin-key.json ./config/firebase-admin-key.json
   ```

2. **Environment Variables**:
   ```bash
   # Edit .env file
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./config/firebase-admin-key.json
   ```

3. **MCP Client Configuration**:
   
   **Claude Desktop**:
   ```json
   {
     "mcpServers": {
       "firebase": {
         "command": "node",
         "args": ["/path/to/firebase-mcp-server/dist/index.js"],
         "transport": "stdio"
       }
     }
   }
   ```

## 🏃‍♂️ Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Testing
```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Watch mode
npm run test:watch
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Clients                               │
│  Claude Code │ Claude Desktop │ Gemini CLI │ Cursor IDE    │
└─────────────────────────────────────────────────────────────┘
                            │
                    MCP Protocol (JSON-RPC 2.0)
                            │
┌─────────────────────────────────────────────────────────────┐
│                Firebase MCP Server                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │ MCP Handler │ │ Tool Router │ │    Web Dashboard       │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Firebase Service Layer                     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                   Firebase Admin SDK
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Services                        │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Documentation

- [Requirements](./docs/requirements.md) - Project requirements and specifications
- [Technical Specification](./docs/technical_spec.md) - Detailed technical architecture
- [Design Guide](./docs/design_guide.md) - UI/UX design system
- [Project Tasks](./docs/project_task.md) - Development roadmap and tasks
- [API Documentation](./docs/api/) - Auto-generated API docs

## 🔧 Development

### Project Structure
```
src/
├── server/          # MCP server core
├── firebase/        # Firebase service handlers
├── tools/          # MCP tool definitions
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── web/            # Web dashboard

tests/              # Test files
config/             # Configuration files
docs/               # Documentation
web-dashboard/      # React dashboard (separate)
```

### Adding New Firebase Services

1. Create service class in `src/firebase/`
2. Define MCP tools in `src/tools/`
3. Add TypeScript interfaces in `src/types/`
4. Register tools in `src/tools/index.ts`
5. Add tests in `tests/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@firebase-mcp.dev
- 🐛 Issues: [GitHub Issues](https://github.com/firebase-mcp/firebase-mcp-server/issues)
- 📖 Docs: [Documentation](./docs/)

## 🗺️ Roadmap

- [x] Phase 1: Core MCP + Authentication + Firestore
- [ ] Phase 2: Storage + Functions + Realtime Database
- [ ] Phase 3: Analytics + Messaging + Web Dashboard
- [ ] Phase 4: Additional Services + Production Features

## ⭐ Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic
- [Firebase Admin SDK](https://firebase.google.com/docs/admin) by Google
- All contributors and the open-source community