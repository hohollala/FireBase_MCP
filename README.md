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

### 로컬 설치
```bash
# Clone the repository
git clone https://github.com/hohollala/FireBase_MCP.git
cd FireBase_MCP

# Install dependencies
npm install

# Build the project
npm run build

# Install locally
npm install .
```

### 글로벌 설치 (권장)
```bash
# 글로벌 설치
npm install -g firebase-mcp-server
```

### 🔥 자동 커맨드 설치

설치 과정에서 자동으로 `~/.claude/commands/fb/` 폴더가 생성되고 모든 Firebase 명령어가 설치됩니다:

#### 🚀 프로젝트 초기화 (init)

프로젝트 구조와 샘플 파일들을 자동으로 생성하려면:

```bash
# 프로젝트 구조 초기화
npm run init

# 또는 직접 실행
node scripts/setup-fb-commands.js init
```

이 명령어는 다음을 생성합니다:
- `config/` 폴더
- `config/service-account.json` (샘플)
- `config/firebase-service-account.json` (샘플)
- `config/firebase-adminsdk.json` (샘플)
- `config/firebase-service-account-production.json` (샘플)
- `config/firebase-service-account-development.json` (샘플)
- `.env` (샘플)
- `.env.example` (샘플)
- `config/README.md` (문서)

```bash
# 설치 후 자동으로 생성되는 파일들
~/.claude/commands/
├── FB.md                    # Firebase 전체 개요
└── fb/                      # Firebase 명령어 디렉토리
    ├── README.md            # 디렉토리 인덱스
    ├── FB-auth.md           # 인증 서비스
    ├── FB-auth-create_user.md
    ├── FB-auth-get_user.md
    ├── FB-firestore.md      # Firestore 서비스
    ├── FB-firestore-get_document.md
    ├── FB-storage.md        # Storage 서비스
    └── ... (70+ 개의 명령어 파일)
```

### 📋 사용법

1. **Claude Code에서 명령어 확인:**
   ```bash
   /fb                    # 모든 Firebase 명령어 보기
   FB                     # Firebase 개요 보기
   FB-auth               # 인증 관련 명령어
   FB-firestore          # Firestore 관련 명령어
   ```

2. **자연어로 요청:**
   ```bash
   "새 사용자를 생성해주세요"
   "Firestore에서 데이터를 조회해주세요"
   "Storage에 파일을 업로드해주세요"
   ```

### 🎯 Custom Commands Auto-Generation

The build process automatically generates 50+ Claude Code custom commands:

- **FB** - Firebase services overview
- **FB-auth** - Authentication commands
- **FB-firestore** - Firestore database commands  
- **FB-storage** - Cloud Storage commands
- **FB-functions** - Cloud Functions commands
- And 40+ more detailed commands

Commands are installed to `~/.claude/commands/` during build/install.

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

   **Claude Code**:
   
   **방법 1: CLI 명령어로 등록 (권장)**
   
   **Windows PowerShell:**
   ```powershell
   claude mcp add firebase-mcp -s user -- node "$PWD/dist/index.js"
   ```
   
   **Windows CMD:**
   ```cmd
   claude mcp add firebase-mcp -s user -- node "[설치경로]/dist/index.js"
   ```
   
   **macOS/Linux:**
   ```bash
   claude mcp add firebase-mcp -s user -- node $(pwd)/dist/index.js
   ```
   
   **방법 2: 글로벌 설치 후 등록**
   ```bash
   # 글로벌 설치
   npm install -g firebase-mcp-server
   
   # 등록
   claude mcp add firebase-mcp-server -s user -- firebase-mcp-server
   ```
   
   **방법 3: 수동 설정 파일**
   
   `~/.claude.json` 파일을 생성하고 다음 내용을 추가:
   ```json
   {
     "mcpServers": {
       "firebase-mcp": {
         "type": "stdio",
         "command": "node",
         "args": [
           "[설치폴더경로]/dist/index.js"
         ],
         "env": {
           "FIREBASE_PROJECT_ID": "your-project-id",
           "FIREBASE_SERVICE_ACCOUNT_PATH": "./config/service-account.json"
         }
       }
     }
   }
   ```

   **방법 2: 프로젝트별 설정 파일**
   ```json
   // .claude/mcp.json (프로젝트 루트)
   {
     "mcpServers": {
       "firebase": {
         "command": "firebase-mcp-server",
         "args": [],
         "env": {
           "FIREBASE_PROJECT_ID": "your-project-id",
           "FIREBASE_SERVICE_ACCOUNT_PATH": "./config/service-account.json"
         }
       }
     }
   }
   ```

   **방법 3: 전역 설정 파일**
   ```json
   // ~/.claude/mcp.json (사용자 홈 디렉토리)
   {
     "mcpServers": {
       "firebase": {
         "command": "firebase-mcp-server",
         "args": [],
         "env": {
           "FIREBASE_PROJECT_ID": "your-project-id",
           "FIREBASE_SERVICE_ACCOUNT_PATH": "/path/to/service-account.json"
         }
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