#!/usr/bin/env node

/**
 * Firebase MCP Server - Custom Commands Setup Script
 * 
 * This script automatically creates all Firebase custom commands for Claude Code
 * Run: node setup-fb-commands.js
 * Run: node setup-fb-commands.js init
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Commands directory paths
const CLAUDE_COMMANDS_DIR = path.join(os.homedir(), '.claude', 'commands');
const FB_COMMANDS_DIR = path.join(CLAUDE_COMMANDS_DIR, 'fb');
const DIST_COMMANDS_DIR = path.join(__dirname, '..', 'dist', 'commands');

// Project directories
const PROJECT_ROOT = path.join(__dirname, '..');
const CONFIG_DIR = path.join(PROJECT_ROOT, 'config');

// Firebase services configuration with all MCP tools
const FIREBASE_SERVICES = {
  'auth': {
    name: 'Authentication',
    emoji: '🔐',
    description: 'Firebase 사용자 인증 및 계정 관리',
    commands: [
      { name: 'create_user', desc: '새 사용자 계정 생성', tool: 'auth_create_user' },
      { name: 'get_user', desc: '사용자 정보 조회', tool: 'auth_get_user' },
      { name: 'update_user', desc: '사용자 정보 업데이트', tool: 'auth_update_user' },
      { name: 'delete_user', desc: '사용자 계정 삭제', tool: 'auth_delete_user' },
      { name: 'list_users', desc: '사용자 목록 조회', tool: 'auth_list_users' },
      { name: 'set_custom_claims', desc: '커스텀 클레임 설정', tool: 'auth_set_custom_claims' },
      { name: 'create_custom_token', desc: '커스텀 토큰 생성', tool: 'auth_create_custom_token' },
      { name: 'verify_token', desc: 'ID 토큰 검증', tool: 'auth_verify_token' },
      { name: 'revoke_tokens', desc: '리프레시 토큰 무효화', tool: 'auth_revoke_refresh_tokens' }
    ]
  },
  'firestore': {
    name: 'Firestore Database',
    emoji: '🗄️',
    description: 'NoSQL 클라우드 데이터베이스',
    commands: [
      { name: 'get_document', desc: '문서 조회', tool: 'firestore_get_document' },
      { name: 'set_document', desc: '문서 생성/수정', tool: 'firestore_set_document' },
      { name: 'add_document', desc: '자동 ID로 문서 추가', tool: 'firestore_add_document' },
      { name: 'update_document', desc: '문서 필드 업데이트', tool: 'firestore_update_document' },
      { name: 'delete_document', desc: '문서 삭제', tool: 'firestore_delete_document' },
      { name: 'get_collection', desc: '컬렉션의 모든 문서 조회', tool: 'firestore_get_collection' },
      { name: 'query_documents', desc: '조건부 문서 쿼리', tool: 'firestore_query_documents' },
      { name: 'batch_write', desc: '배치 쓰기 작업', tool: 'firestore_batch_write' },
      { name: 'listen_document', desc: '문서 실시간 리스너', tool: 'firestore_listen_document' },
      { name: 'listen_collection', desc: '컬렉션 실시간 리스너', tool: 'firestore_listen_collection' }
    ]
  },
  'storage': {
    name: 'Cloud Storage',
    emoji: '💾',
    description: '클라우드 파일 저장소',
    commands: [
      { name: 'upload_file', desc: '파일 업로드', tool: 'storage_upload_file' },
      { name: 'download_file', desc: '파일 다운로드', tool: 'storage_download_file' },
      { name: 'delete_file', desc: '파일 삭제', tool: 'storage_delete_file' },
      { name: 'get_metadata', desc: '파일 메타데이터 조회', tool: 'storage_get_metadata' },
      { name: 'update_metadata', desc: '파일 메타데이터 업데이트', tool: 'storage_update_metadata' },
      { name: 'list_files', desc: '파일 목록 조회', tool: 'storage_list_files' },
      { name: 'get_download_url', desc: '다운로드 URL 생성', tool: 'storage_get_download_url' },
      { name: 'copy_file', desc: '파일 복사', tool: 'storage_copy_file' }
    ]
  },
  'functions': {
    name: 'Cloud Functions',
    emoji: '⚡',
    description: '서버리스 클라우드 함수',
    commands: [
      { name: 'list', desc: 'Cloud Functions 목록 조회', tool: 'functions_list' },
      { name: 'get', desc: 'Cloud Function 정보 조회', tool: 'functions_get' },
      { name: 'call', desc: 'Cloud Function 호출', tool: 'functions_call' },
      { name: 'deploy', desc: 'Cloud Function 배포', tool: 'functions_deploy' },
      { name: 'delete', desc: 'Cloud Function 삭제', tool: 'functions_delete' },
      { name: 'logs', desc: 'Cloud Function 로그 조회', tool: 'functions_logs' }
    ]
  },
  'analytics': {
    name: 'Analytics',
    emoji: '📊',
    description: '앱 사용자 행동 분석',
    commands: [
      { name: 'get_user_properties', desc: '사용자 속성 조회', tool: 'analytics_get_user_properties' },
      { name: 'set_user_properties', desc: '사용자 속성 설정', tool: 'analytics_set_user_properties' },
      { name: 'log_event', desc: '이벤트 로그 기록', tool: 'analytics_log_event' },
      { name: 'get_events', desc: '이벤트 목록 조회', tool: 'analytics_get_events' },
      { name: 'get_reports', desc: '분석 보고서 조회', tool: 'analytics_get_reports' }
    ]
  },
  'messaging': {
    name: 'Cloud Messaging',
    emoji: '💬',
    description: '클라우드 메시징 및 푸시 알림',
    commands: [
      { name: 'send_to_token', desc: '토큰으로 메시지 전송', tool: 'messaging_send_to_token' },
      { name: 'send_to_topic', desc: '토픽으로 메시지 전송', tool: 'messaging_send_to_topic' },
      { name: 'send_to_condition', desc: '조건부 메시지 전송', tool: 'messaging_send_to_condition' },
      { name: 'send_multicast', desc: '다중 사용자에게 메시지 전송', tool: 'messaging_send_multicast' },
      { name: 'subscribe_to_topic', desc: '토픽 구독', tool: 'messaging_subscribe_to_topic' },
      { name: 'unsubscribe_from_topic', desc: '토픽 구독 해제', tool: 'messaging_unsubscribe_from_topic' },
      { name: 'get_delivery_reports', desc: '전송 상태 보고서 조회', tool: 'messaging_get_delivery_reports' }
    ]
  },
  'performance': {
    name: 'Performance Monitoring',
    emoji: '⚡',
    description: '앱 성능 모니터링',
    commands: [
      { name: 'start_trace', desc: '성능 추적 시작', tool: 'performance_start_trace' },
      { name: 'stop_trace', desc: '성능 추적 종료', tool: 'performance_stop_trace' },
      { name: 'add_trace_metric', desc: '추적 메트릭 추가', tool: 'performance_add_trace_metric' },
      { name: 'get_traces', desc: '성능 추적 데이터 조회', tool: 'performance_get_traces' },
      { name: 'get_metrics', desc: '성능 메트릭 조회', tool: 'performance_get_metrics' }
    ]
  },
  'remote-config': {
    name: 'Remote Config',
    emoji: '🎛️',
    description: '원격 앱 설정 관리',
    commands: [
      { name: 'get_template', desc: '원격 구성 템플릿 조회', tool: 'remote_config_get_template' },
      { name: 'publish_template', desc: '원격 구성 템플릿 게시', tool: 'remote_config_publish_template' },
      { name: 'validate_template', desc: '원격 구성 템플릿 검증', tool: 'remote_config_validate_template' },
      { name: 'rollback', desc: '원격 구성 롤백', tool: 'remote_config_rollback' },
      { name: 'get_versions', desc: '원격 구성 버전 목록 조회', tool: 'remote_config_get_versions' },
      { name: 'get_parameters', desc: '원격 구성 매개변수 조회', tool: 'remote_config_get_parameters' }
    ]
  },
  'security': {
    name: 'Security',
    emoji: '🛡️',
    description: '보안 규칙 및 보안 관리',
    commands: [
      { name: 'rules_get', desc: '보안 규칙 조회', tool: 'security_rules_get' },
      { name: 'rules_update', desc: '보안 규칙 업데이트', tool: 'security_rules_update' },
      { name: 'rules_test', desc: '보안 규칙 테스트', tool: 'security_rules_test' },
      { name: 'rules_deploy', desc: '보안 규칙 배포', tool: 'security_rules_deploy' },
      { name: 'rules_validate', desc: '보안 규칙 검증', tool: 'security_rules_validate' }
    ]
  },
  'hosting': {
    name: 'Hosting',
    emoji: '🌐',
    description: '웹사이트 호스팅',
    commands: [
      { name: 'deploy', desc: '웹사이트 배포', tool: 'hosting_deploy' },
      { name: 'list_sites', desc: '호스팅 사이트 목록 조회', tool: 'hosting_list_sites' },
      { name: 'get_site', desc: '호스팅 사이트 정보 조회', tool: 'hosting_get_site' },
      { name: 'delete_site', desc: '호스팅 사이트 삭제', tool: 'hosting_delete_site' }
    ]
  },
  'realtime-db': {
    name: 'Realtime Database',
    emoji: '🔄',
    description: '실시간 데이터베이스',
    commands: [
      { name: 'get', desc: '실시간 DB 데이터 조회', tool: 'realtime_db_get' },
      { name: 'set', desc: '실시간 DB 데이터 설정', tool: 'realtime_db_set' },
      { name: 'push', desc: '실시간 DB 데이터 추가', tool: 'realtime_db_push' },
      { name: 'update', desc: '실시간 DB 데이터 업데이트', tool: 'realtime_db_update' },
      { name: 'remove', desc: '실시간 DB 데이터 삭제', tool: 'realtime_db_remove' },
      { name: 'query', desc: '실시간 DB 쿼리 실행', tool: 'realtime_db_query' }
    ]
  }
};

/**
 * Create command directories if they don't exist
 */
function ensureCommandsDirectories() {
  console.log('🔍 Checking commands directories...');
  
  // Create user commands directory
  if (!fs.existsSync(CLAUDE_COMMANDS_DIR)) {
    console.log('📁 Creating user commands directory:', CLAUDE_COMMANDS_DIR);
    fs.mkdirSync(CLAUDE_COMMANDS_DIR, { recursive: true });
  } else {
    console.log('✅ User commands directory exists:', CLAUDE_COMMANDS_DIR);
  }
  
  // Create fb commands directory
  if (!fs.existsSync(FB_COMMANDS_DIR)) {
    console.log('📁 Creating fb commands directory:', FB_COMMANDS_DIR);
    fs.mkdirSync(FB_COMMANDS_DIR, { recursive: true });
  } else {
    console.log('✅ FB commands directory exists:', FB_COMMANDS_DIR);
  }
  
  // Create dist commands directory
  if (!fs.existsSync(DIST_COMMANDS_DIR)) {
    console.log('📁 Creating dist commands directory:', DIST_COMMANDS_DIR);
    fs.mkdirSync(DIST_COMMANDS_DIR, { recursive: true });
  } else {
    console.log('✅ Dist commands directory exists:', DIST_COMMANDS_DIR);
  }
}

/**
 * Create project structure and sample files
 */
function createProjectStructure() {
  console.log('🏗️ Creating project structure...');
  
  // Create config directory
  if (!fs.existsSync(CONFIG_DIR)) {
    console.log('📁 Creating config directory:', CONFIG_DIR);
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  } else {
    console.log('✅ Config directory exists:', CONFIG_DIR);
  }
  
  // Create sample service account file
  const sampleServiceAccount = {
    "type": "service_account",
    "project_id": "your-project-id",
    "private_key_id": "your-private-key-id",
    "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
    "client_id": "your-client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com"
  };
  
  const serviceAccountPath = path.join(CONFIG_DIR, 'service-account.json');
  if (!fs.existsSync(serviceAccountPath)) {
    console.log('📄 Creating sample service-account.json');
    fs.writeFileSync(serviceAccountPath, JSON.stringify(sampleServiceAccount, null, 2), 'utf8');
  } else {
    console.log('✅ service-account.json exists');
  }
  
  // Create alternative service account files
  const alternativeFiles = [
    'firebase-service-account.json',
    'firebase-adminsdk.json',
    'firebase-service-account-production.json',
    'firebase-service-account-development.json'
  ];
  
  alternativeFiles.forEach(filename => {
    const filePath = path.join(CONFIG_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`📄 Creating ${filename}`);
      fs.writeFileSync(filePath, JSON.stringify(sampleServiceAccount, null, 2), 'utf8');
    } else {
      console.log(`✅ ${filename} exists`);
    }
  });
  
  // Create .env file
  const envPath = path.join(PROJECT_ROOT, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('📄 Creating .env file');
    const envContent = `# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=./config/service-account.json

# Environment
NODE_ENV=development
LOG_LEVEL=info

# MCP Server Configuration
MCP_SERVER_PORT=3000
MCP_SERVER_HOST=localhost

# Optional: Custom Firebase Config
# FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
# FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
`;
    fs.writeFileSync(envPath, envContent, 'utf8');
  } else {
    console.log('✅ .env file exists');
  }
  
  // Create .env.example file
  const envExamplePath = path.join(PROJECT_ROOT, '.env.example');
  if (!fs.existsSync(envExamplePath)) {
    console.log('📄 Creating .env.example file');
    const envExampleContent = `# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=./config/service-account.json

# Environment
NODE_ENV=development
LOG_LEVEL=info

# MCP Server Configuration
MCP_SERVER_PORT=3000
MCP_SERVER_HOST=localhost

# Optional: Custom Firebase Config
# FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
# FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
`;
    fs.writeFileSync(envExamplePath, envExampleContent, 'utf8');
  } else {
    console.log('✅ .env.example file exists');
  }
  
  // Create config README
  const configReadmePath = path.join(CONFIG_DIR, 'README.md');
  if (!fs.existsSync(configReadmePath)) {
    console.log('📄 Creating config/README.md');
    const configReadmeContent = `# Firebase Configuration

이 디렉토리는 Firebase 서비스 계정 키 파일들을 저장하는 곳입니다.

## 📁 파일명 규칙

### 권장 파일명 (간단하게):
- \`service-account.json\` - 기본 서비스 계정 키

### 또는 다른 이름들:
- \`firebase-service-account.json\` - Firebase 서비스 계정 키
- \`firebase-adminsdk.json\` - Firebase Admin SDK 키

### 프로젝트별 구분이 필요한 경우:
- \`firebase-service-account-production.json\` - 프로덕션용
- \`firebase-service-account-development.json\` - 개발용

## 🔧 설정 방법

1. **Firebase Console에서 키 다운로드:**
   - Firebase Console → 프로젝트 설정 → 서비스 계정 탭
   - "새 비공개 키 생성" 클릭
   - JSON 형식으로 다운로드

2. **파일 저장:**
   - 다운로드한 파일을 이 디렉토리에 저장
   - 권장 파일명: \`service-account.json\`

3. **환경 변수 설정:**
   \`\`\`bash
   export FIREBASE_PROJECT_ID=your-project-id
   export FIREBASE_SERVICE_ACCOUNT_PATH=./config/service-account.json
   \`\`\`

## ⚠️ 보안 주의사항

- 서비스 계정 키는 절대 공개 저장소에 커밋하지 마세요
- \`.gitignore\`에 \`config/*.json\`을 추가하세요
- 프로덕션에서는 환경 변수로 관리하세요

## 🔗 관련 링크

- [Firebase Admin SDK 설정](https://firebase.google.com/docs/admin/setup)
- [서비스 계정 키 생성](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)
`;
    fs.writeFileSync(configReadmePath, configReadmeContent, 'utf8');
  } else {
    console.log('✅ config/README.md exists');
  }
  
  console.log('✅ Project structure created successfully!');
}

/**
 * Generate main service command content
 */
function generateServiceCommand(serviceKey, serviceConfig) {
  const fileName = `FB-${serviceKey}.md`;
  const content = `# FB-${serviceKey} - ${serviceConfig.emoji} ${serviceConfig.name}

${serviceConfig.description}

## 📋 사용 가능한 명령어

${serviceConfig.commands.map(cmd => 
`### \`${cmd.name}\`
${cmd.desc}

**MCP 도구:** \`${cmd.tool}\`

**사용 예시:**
\`\`\`
"${serviceConfig.name}에서 ${cmd.desc}해주세요"
\`\`\`
`).join('\n\n')}

## 🚀 빠른 시작

1. **Claude Code에서 요청:**
   \`\`\`
   "새 사용자를 생성해주세요"
   "users 컬렉션에서 데이터를 조회해주세요"
   "파일을 Storage에 업로드해주세요"
   \`\`\`

2. **자동 도구 실행:**
   Claude가 적절한 MCP 도구를 자동으로 선택하여 실행합니다.

## 💡 팁

- 자연어로 요청하면 자동으로 적절한 도구가 실행됩니다
- 구체적인 요청일수록 더 정확한 결과를 얻을 수 있습니다
- 매개변수는 자연어로 설명 가능합니다

## 🔗 관련 링크

- [Firebase ${serviceConfig.name} 문서](https://firebase.google.com/docs)
- [MCP 프로토콜](https://modelcontextprotocol.io)
- [GitHub Repository](https://github.com/hohollala/FireBase_MCP)
`;

  return { fileName, content };
}

/**
 * Generate sub-command content
 */
function generateSubCommand(serviceKey, serviceConfig, command) {
  const fileName = `FB-${serviceKey}-${command.name}.md`;
  const content = `# FB-${serviceKey}-${command.name} - ${serviceConfig.emoji} ${command.desc}

## 📋 명령어 정보

**서비스:** ${serviceConfig.name}  
**기능:** ${command.desc}  
**MCP 도구:** \`${command.tool}\`

## 🚀 사용법

### 1. 자연어 요청
\`\`\`
"${command.desc}해주세요"
\`\`\`

### 2. 구체적인 요청
\`\`\`
"${serviceConfig.name}에서 ${command.desc}하고 싶습니다"
\`\`\`

## 💡 예시

### ${serviceConfig.name} ${command.desc} 예시:
\`\`\`
사용자: "${command.desc}해주세요"
Claude: ${command.tool} 도구를 실행하여 ${command.desc}합니다...
\`\`\`

## ⚙️ 매개변수

필요한 매개변수는 자연어로 설명하세요:

\`\`\`
"이메일이 test@example.com인 사용자를 생성해주세요"
"users 컬렉션에서 나이가 25 이상인 사용자들을 조회해주세요"
"image.jpg 파일을 Storage에 업로드해주세요"
\`\`\`

## 🔗 관련 명령어

- \`FB-${serviceKey}\` - ${serviceConfig.name} 전체 도움말
- \`FB\` - 모든 Firebase 명령어 개요

## 📚 문서

- [Firebase ${serviceConfig.name}](https://firebase.google.com/docs)
- [MCP 프로토콜](https://modelcontextprotocol.io)
`;

  return { fileName, content };
}

/**
 * Create all command files in fb directory
 */
function createCommandFiles() {
  console.log('📝 Creating Firebase command files in fb directory...');
  
  let totalFiles = 0;
  
  // Create main service commands
  Object.entries(FIREBASE_SERVICES).forEach(([serviceKey, serviceConfig]) => {
    const { fileName, content } = generateServiceCommand(serviceKey, serviceConfig);
    
    // Write to fb commands directory
    const fbFilePath = path.join(FB_COMMANDS_DIR, fileName);
    fs.writeFileSync(fbFilePath, content, 'utf8');
    
    // Write to dist commands directory
    const distFilePath = path.join(DIST_COMMANDS_DIR, fileName);
    fs.writeFileSync(distFilePath, content, 'utf8');
    
    console.log(`✅ Created: ${fileName}`);
    totalFiles++;
    
    // Create sub-commands
    serviceConfig.commands.forEach(command => {
      const subCommandFile = generateSubCommand(serviceKey, serviceConfig, command);
      
      // Write to fb commands directory
      const fbSubCommandPath = path.join(FB_COMMANDS_DIR, subCommandFile.fileName);
      fs.writeFileSync(fbSubCommandPath, subCommandFile.content, 'utf8');
      
      // Write to dist commands directory
      const distSubCommandPath = path.join(DIST_COMMANDS_DIR, subCommandFile.fileName);
      fs.writeFileSync(distSubCommandPath, subCommandFile.content, 'utf8');
      
      console.log(`✅ Created: ${subCommandFile.fileName}`);
      totalFiles++;
    });
  });
  
  return totalFiles;
}

/**
 * Create FB-init command
 */
function createInitCommand() {
  const initContent = `# FB-init - 🚀 Firebase MCP 프로젝트 초기화

Firebase MCP Server 프로젝트 구조를 자동으로 생성합니다.

## 📋 명령어 정보

**기능:** Firebase MCP 프로젝트 구조 및 설정 파일 초기화  
**스크립트:** \`npm run init\` 또는 \`node scripts/setup-fb-commands.js init\`

## 🚀 사용법

### 1. npm 스크립트로 실행
\`\`\`bash
npm run init
\`\`\`

### 2. 직접 스크립트 실행
\`\`\`bash
node scripts/setup-fb-commands.js init
\`\`\`

### 3. 자연어 요청
\`\`\`
"Firebase MCP 프로젝트를 초기화해주세요"
"FB-init을 실행해서 프로젝트 구조를 만들어주세요"
\`\`\`

## 📁 생성되는 파일들

### 설정 파일
- \`config/service-account.json\` - 기본 서비스 계정 키 (샘플)
- \`config/firebase-service-account.json\` - Firebase 서비스 계정 키 (샘플)
- \`config/firebase-adminsdk.json\` - Firebase Admin SDK 키 (샘플)
- \`config/firebase-service-account-production.json\` - 프로덕션용 (샘플)
- \`config/firebase-service-account-development.json\` - 개발용 (샘플)

### 환경 설정
- \`.env\` - 환경 변수 파일 (샘플)
- \`.env.example\` - 환경 변수 예시 파일

### 문서
- \`config/README.md\` - Firebase 설정 가이드

## ⚙️ 초기화 후 설정

1. **Firebase 서비스 계정 키 설정:**
   - Firebase Console → 프로젝트 설정 → 서비스 계정
   - "새 비공개 키 생성" 클릭
   - 다운로드한 JSON 파일을 \`config/service-account.json\`으로 저장

2. **환경 변수 설정:**
   \`\`\`bash
   # .env 파일 편집
   FIREBASE_PROJECT_ID=your-actual-project-id
   FIREBASE_SERVICE_ACCOUNT_PATH=./config/service-account.json
   \`\`\`

3. **빌드 및 설치:**
   \`\`\`bash
   npm run build  # 자동으로 모든 Firebase 명령어도 설치됩니다
   \`\`\`

## 💡 예시

\`\`\`bash
# 프로젝트 초기화
npm run init

# Firebase 설정 파일 교체
cp /path/to/your-firebase-key.json ./config/service-account.json

# 환경 변수 설정
echo "FIREBASE_PROJECT_ID=my-firebase-project" > .env
echo "FIREBASE_SERVICE_ACCOUNT_PATH=./config/service-account.json" >> .env

# 빌드 (자동으로 명령어들도 설치됨)
npm run build
\`\`\`

## 🔗 관련 명령어

- \`FB\` - Firebase 명령어 전체 개요
- \`FB-auth\` - 인증 관련 명령어
- \`FB-firestore\` - Firestore 관련 명령어

## 📚 문서

- [Firebase 설정 가이드](https://firebase.google.com/docs/admin/setup)
- [MCP 프로토콜](https://modelcontextprotocol.io)
- [GitHub Repository](https://github.com/hohollala/FireBase_MCP)
`;

  // Write FB-init command to user commands directory
  const userInitPath = path.join(CLAUDE_COMMANDS_DIR, 'FB-init.md');
  fs.writeFileSync(userInitPath, initContent, 'utf8');
  
  // Write FB-init command to fb commands directory
  const fbInitPath = path.join(FB_COMMANDS_DIR, 'FB-init.md');
  fs.writeFileSync(fbInitPath, initContent, 'utf8');
  
  // Write FB-init command to dist commands directory
  const distInitPath = path.join(DIST_COMMANDS_DIR, 'FB-init.md');
  fs.writeFileSync(distInitPath, initContent, 'utf8');
  
  console.log('✅ Created: FB-init.md (project initialization command)');
}

/**
 * Create main FB command and fb directory index
 */
function createMainCommands() {
  // Create main FB command
  const mainFBContent = `# FB - Firebase MCP Server 명령어 개요

🔥 **Firebase MCP Server** - AI 개발 도구를 위한 완전한 Firebase 통합 솔루션

## 📋 사용 가능한 서비스

${Object.entries(FIREBASE_SERVICES).map(([key, config]) => 
`### ${config.emoji} **${config.name}**
\`\`\`
FB-${key}              # ${config.name} 메인 명령어
${config.commands.map(cmd => `FB-${key}-${cmd.name}        # ${cmd.desc}`).join('\n')}
\`\`\`
`).join('\n')}

## 🚀 빠른 시작

1. **MCP 서버 확인:**
   \`\`\`bash
   claude mcp list
   \`\`\`

2. **Claude Code 시작:**
   \`\`\`bash
   claude
   \`\`\`

3. **Firebase 명령어 사용:**
   \`\`\`
   FB-auth              # 인증 관련 도움말
   FB-firestore         # 데이터베이스 관련 도움말
   FB-storage           # 저장소 관련 도움말
   \`\`\`

## 💡 사용 팁

- 모든 명령어는 자연어로 요청 가능
- 구체적인 요청일수록 더 정확한 결과
- 매개변수는 자연어로 설명 가능

## 🔗 링크

- [GitHub Repository](https://github.com/hohollala/FireBase_MCP)
- [설치 가이드](https://github.com/hohollala/FireBase_MCP#installation)
- [사용 예시](https://github.com/hohollala/FireBase_MCP#examples)
`;

  // Write main FB command to user commands directory
  const userFBPath = path.join(CLAUDE_COMMANDS_DIR, 'FB.md');
  fs.writeFileSync(userFBPath, mainFBContent, 'utf8');
  
  // Write main FB command to dist commands directory
  const distFBPath = path.join(DIST_COMMANDS_DIR, 'FB.md');
  fs.writeFileSync(distFBPath, mainFBContent, 'utf8');
  
  // Create fb directory index
  const fbIndexContent = `# /fb - Firebase 명령어 디렉토리

🔥 **Firebase MCP Server** 명령어들이 이 디렉토리에 저장되어 있습니다.

## 📁 사용 가능한 명령어

${Object.entries(FIREBASE_SERVICES).map(([key, config]) => 
`### ${config.emoji} **${config.name}**
\`\`\`
FB-${key}.md           # ${config.name} 메인 명령어
${config.commands.map(cmd => `FB-${key}-${cmd.name}.md     # ${cmd.desc}`).join('\n')}
\`\`\`
`).join('\n')}

## 🚀 사용법

1. **Claude Code에서:**
   \`\`\`
   /fb
   \`\`\`

2. **특정 명령어 보기:**
   \`\`\`
   FB-auth
   FB-firestore
   FB-storage
   \`\`\`

## 💡 팁

- \`/fb\`를 입력하면 이 디렉토리의 모든 명령어를 볼 수 있습니다
- 각 명령어 파일에는 상세한 사용법과 예시가 포함되어 있습니다
- 자연어로 요청하면 자동으로 적절한 명령어가 실행됩니다

## 🔗 관련 링크

- [GitHub Repository](https://github.com/hohollala/FireBase_MCP)
- [설치 가이드](https://github.com/hohollala/FireBase_MCP#installation)
`;

  // Write fb directory index
  const fbIndexPath = path.join(FB_COMMANDS_DIR, 'README.md');
  fs.writeFileSync(fbIndexPath, fbIndexContent, 'utf8');
  
  console.log('✅ Created: FB.md (main command)');
  console.log('✅ Created: fb/README.md (directory index)');
}

/**
 * Main setup function
 */
function main() {
  const args = process.argv.slice(2);
  const isInit = args.includes('init');
  
  console.log('🚀 Firebase MCP Server - Custom Commands Setup');
  console.log('===============================================\n');
  
  try {
    if (isInit) {
      console.log('🔧 Initializing project structure...');
      createProjectStructure();
      console.log('\n📁 Project structure created successfully!');
      console.log('📁 Created directories:');
      console.log('   - config/');
      console.log('   - config/service-account.json (sample)');
      console.log('   - config/firebase-service-account.json (sample)');
      console.log('   - config/firebase-adminsdk.json (sample)');
      console.log('   - config/firebase-service-account-production.json (sample)');
      console.log('   - config/firebase-service-account-development.json (sample)');
      console.log('   - .env (sample)');
      console.log('   - .env.example (sample)');
      console.log('   - config/README.md (documentation)');
      console.log('\n💡 Next steps:');
      console.log('   1. Replace sample files with your actual Firebase configuration');
      console.log('   2. Update .env with your project ID and service account path');
      console.log('   3. Run: npm run build');
    }
    
    // Ensure commands directories exist
    ensureCommandsDirectories();
    
    // Create all command files
    const totalFiles = createCommandFiles();
    
    // Create main commands
    createMainCommands();
    
    // Create init command
    createInitCommand();
    
    console.log('\n🎉 Setup completed successfully!');
    console.log(`📊 Total files created: ${totalFiles + 3}`);
    console.log(`📁 User commands: ${CLAUDE_COMMANDS_DIR}`);
    console.log(`📁 FB commands: ${FB_COMMANDS_DIR}`);
    console.log(`📁 Dist commands: ${DIST_COMMANDS_DIR}`);
    console.log('\n💡 Usage:');
    console.log('   1. Restart Claude Code');
    console.log('   2. Type "/fb" to see all Firebase commands');
    console.log('   3. Type "FB" to see Firebase overview');
    console.log('   4. Use "FB-auth", "FB-firestore", etc. for specific services');
    console.log('\n🔗 Documentation: https://github.com/hohollala/FireBase_MCP');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  main();
}

module.exports = { main, FIREBASE_SERVICES };