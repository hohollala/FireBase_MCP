# Firebase Configuration

이 디렉토리는 Firebase 서비스 계정 키 파일들을 저장하는 곳입니다.

## 📁 파일명 규칙

### 권장 파일명 (간단하게):
- `service-account.json` - 기본 서비스 계정 키

### 또는 다른 이름들:
- `firebase-service-account.json` - Firebase 서비스 계정 키
- `firebase-adminsdk.json` - Firebase Admin SDK 키

### 프로젝트별 구분이 필요한 경우:
- `firebase-service-account-production.json` - 프로덕션용
- `firebase-service-account-development.json` - 개발용

## 🔧 설정 방법

1. **Firebase Console에서 키 다운로드:**
   - Firebase Console → 프로젝트 설정 → 서비스 계정 탭
   - "새 비공개 키 생성" 클릭
   - JSON 형식으로 다운로드

2. **파일 저장:**
   - 다운로드한 파일을 이 디렉토리에 저장
   - 권장 파일명: `service-account.json`

3. **환경 변수 설정:**
   ```bash
   export FIREBASE_PROJECT_ID=your-project-id
   export FIREBASE_SERVICE_ACCOUNT_PATH=./config/service-account.json
   ```

## ⚠️ 보안 주의사항

- 서비스 계정 키는 절대 공개 저장소에 커밋하지 마세요
- `.gitignore`에 `config/*.json`을 추가하세요
- 프로덕션에서는 환경 변수로 관리하세요

## 🔗 관련 링크

- [Firebase Admin SDK 설정](https://firebase.google.com/docs/admin/setup)
- [서비스 계정 키 생성](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)
