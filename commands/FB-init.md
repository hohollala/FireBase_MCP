# FB-init - Firebase MCP 커스텀 명령어 초기화 도움말

🚀 **Firebase MCP Server 커스텀 명령어 시스템 설치**

Claude Code에서 "FB-init"를 입력하면 이 도움말이 표시됩니다.

Firebase MCP Server의 모든 커스텀 명령어를 자동으로 설치하는 방법을 안내합니다.

## 🎯 실행 방법

### 방법 1: npm 스크립트 사용
```bash
# Firebase MCP Server 프로젝트 폴더에서
npm run setup-commands
```

### 방법 2: 직접 스크립트 실행
```bash
# Firebase MCP Server 프로젝트 폴더에서
node scripts/setup-fb-commands.js
```

### 방법 3: Claude Code에서 자연어 요청
```
"Firebase MCP 커스텀 명령어를 설치해주세요"
"FB-init을 실행해서 Firebase 명령어들을 설치해주세요"
```

## 📁 설치되는 명령어 목록

### 🔐 **인증 (Authentication)**
- `FB-auth` - Firebase 인증 관련 모든 명령어
- `FB-auth-create` - 새 사용자 생성
- `FB-auth-get` - 사용자 정보 조회
- `FB-auth-update` - 사용자 정보 업데이트
- `FB-auth-delete` - 사용자 삭제
- `FB-auth-token` - 토큰 및 클레임 관리

### 🗄️ **Firestore (데이터베이스)**
- `FB-firestore` - Firestore 관련 모든 명령어
- `FB-firestore-get` - 문서 조회
- `FB-firestore-set` - 문서 생성/업데이트
- `FB-firestore-query` - 문서 쿼리
- `FB-firestore-listen` - 실시간 리스너
- `FB-firestore-batch` - 배치 작업

### 💾 **Storage (저장소)**
- `FB-storage` - Storage 관련 모든 명령어
- `FB-storage-upload` - 파일 업로드
- `FB-storage-download` - 파일 다운로드
- `FB-storage-list` - 파일 목록
- `FB-storage-delete` - 파일 삭제

### ⚡ **Functions (클라우드 함수)**
- `FB-functions` - Functions 관련 모든 명령어
- `FB-functions-deploy` - 함수 배포
- `FB-functions-call` - 함수 호출
- `FB-functions-logs` - 함수 로그

### 📊 **Analytics (분석)**
- `FB-analytics` - Analytics 관련 모든 명령어
- `FB-analytics-log` - 이벤트 로깅
- `FB-analytics-report` - 리포트 조회
- `FB-analytics-user` - 사용자 속성

### 💬 **Messaging (메시징)**
- `FB-messaging` - Messaging 관련 모든 명령어
- `FB-messaging-send` - 메시지 전송
- `FB-messaging-topic` - 토픽 관리
- `FB-messaging-template` - 메시지 템플릿

### ⚡ **Performance (성능 모니터링)**
- `FB-performance` - Performance 관련 모든 명령어
- `FB-performance-metrics` - 성능 메트릭
- `FB-performance-traces` - 커스텀 추적

### 🎛️ **Remote Config (원격 설정)**
- `FB-remote-config` - Remote Config 관련 모든 명령어
- `FB-remote-config-get` - 설정 조회
- `FB-remote-config-set` - 설정 업데이트
- `FB-remote-config-publish` - 설정 게시

### 🛡️ **Security (보안)**
- `FB-security` - Security 관련 모든 명령어
- `FB-security-rules` - 보안 규칙 관리
- `FB-security-monitor` - 보안 모니터링
- `FB-security-iam` - IAM 권한 관리

### 🔗 **Dynamic Links (동적 링크)**
- `FB-dynamic-links` - Dynamic Links 관련 모든 명령어
- `FB-dynamic-links-create` - 링크 생성
- `FB-dynamic-links-stats` - 링크 통계

### 🔐 **App Check (앱 무결성)**
- `FB-app-check` - App Check 관련 모든 명령어
- `FB-app-check-enable` - App Check 활성화
- `FB-app-check-verify` - 토큰 검증

## 🔧 설치 과정

1. **명령어 폴더 생성**: `~/.claude/commands/` 폴더 확인/생성
2. **Firebase 명령어 설치**: 모든 FB-* 명령어 파일 복사
3. **권한 설정**: 실행 권한 부여
4. **설정 완료**: Claude Code에서 즉시 사용 가능

## ✅ 설치 완료 후 사용법

```bash
# Claude Code에서 사용 가능한 명령어들
FB-auth              # 인증 도움말
FB-firestore         # Firestore 도움말
FB-storage           # Storage 도움말
FB-functions         # Functions 도움말
FB-analytics         # Analytics 도움말
# ... 모든 Firebase 서비스 명령어
```

## 🆘 문제 해결

- **권한 오류**: `chmod +x ~/.claude/commands/FB-*` 실행
- **명령어 인식 안됨**: Claude Code 재시작
- **파일 없음**: `FB-init` 다시 실행

## 📞 지원

- GitHub Issues: https://github.com/hohollala/FireBase_MCP/issues
- 문서: https://github.com/hohollala/FireBase_MCP#custom-commands