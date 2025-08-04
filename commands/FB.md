# Firebase MCP Server 명령어 도움말

🔥 **Firebase MCP Server** - AI 개발 도구를 위한 완전한 Firebase 통합 솔루션

## 📋 사용 가능한 명령어

### 🔐 **인증 (Authentication)**
```
FB auth          # 인증 관련 모든 명령어 보기
FB auth create   # 새 사용자 생성 도움말
FB auth get      # 사용자 조회 도움말
FB auth list     # 사용자 목록 도움말
FB auth update   # 사용자 업데이트 도움말
FB auth delete   # 사용자 삭제 도움말
```

### 🗄️ **Firestore (데이터베이스)**
```
FB firestore         # Firestore 관련 모든 명령어 보기
FB firestore get     # 문서 조회 도움말
FB firestore set     # 문서 생성/업데이트 도움말
FB firestore query   # 문서 쿼리 도움말
FB firestore listen  # 실시간 리스너 도움말
```

### 💾 **Storage (저장소)**
```
FB storage           # Storage 관련 모든 명령어 보기
FB storage upload    # 파일 업로드 도움말
FB storage download  # 파일 다운로드 도움말
FB storage list      # 파일 목록 도움말
```

### ⚡ **Functions (클라우드 함수)**
```
FB functions         # Functions 관련 모든 명령어 보기
FB functions deploy  # 함수 배포 도움말
FB functions call    # 함수 호출 도움말
```

### 📊 **Analytics (분석)**
```
FB analytics         # Analytics 관련 모든 명령어 보기
FB analytics log     # 이벤트 로깅 도움말
FB analytics report  # 리포트 조회 도움말
```

### 💬 **Messaging (메시징)**
```
FB messaging         # Messaging 관련 모든 명령어 보기
FB messaging send    # 메시지 전송 도움말
FB messaging topic   # 토픽 관리 도움말
```

### ⚡ **Performance (성능 모니터링)**
```
FB performance       # Performance 관련 모든 명령어 보기
FB performance app   # 앱 성능 메트릭 도움말
FB performance network # 네트워크 성능 도움말
```

### 🎛️ **Remote Config (원격 설정)**
```
FB remote_config     # Remote Config 관련 모든 명령어 보기
FB remote_config get # 설정 조회 도움말
FB remote_config set # 설정 업데이트 도움말
```

### 🛡️ **Security (보안)**
```
FB security          # Security 관련 모든 명령어 보기
FB security rules    # 보안 규칙 도움말
FB security monitor  # 보안 모니터링 도움말
```

### 🔗 **Dynamic Links (동적 링크)**
```
FB dynamic_links     # Dynamic Links 관련 모든 명령어 보기
FB dynamic_links create # 링크 생성 도움말
FB dynamic_links stats  # 링크 통계 도움말
```

### 🔐 **App Check (앱 무결성)**
```
FB app_check         # App Check 관련 모든 명령어 보기
FB app_check enable  # App Check 활성화 도움말
FB app_check verify  # 토큰 검증 도움말
```

## 🚀 빠른 시작

1. **MCP 서버 상태 확인:**
   ```bash
   claude mcp list
   claude mcp test firebase-mcp-server
   ```

2. **Claude Code 시작:**
   ```bash
   claude
   ```

3. **자연어로 요청:**
   - "새 사용자를 생성해주세요"
   - "Firestore에서 products 컬렉션을 조회해주세요"
   - "Storage에 이미지를 업로드해주세요"

## 💡 도움말

- `FB <service>` : 특정 서비스의 모든 명령어 보기
- `FB <service> <action>` : 특정 액션의 상세 도움말 보기
- 각 명령어는 Claude Code에서 자연어로 요청 가능

## 🔗 링크

- [전체 문서](https://github.com/hohollala/FireBase_MCP)
- [설치 가이드](https://github.com/hohollala/FireBase_MCP#installation)
- [문제 해결](https://github.com/hohollala/FireBase_MCP#troubleshooting)