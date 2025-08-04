# Firebase Authentication 명령어

🔐 **Firebase Authentication** - 사용자 인증 및 계정 관리

## 📋 사용 가능한 도구

### 👤 **사용자 관리**

**`auth_create_user`** - 새 사용자 생성
```
자연어 요청: "새 사용자를 생성해주세요. 이메일은 user@example.com이고 비밀번호는 password123입니다"

매개변수:
- email: 사용자 이메일 (필수)
- password: 비밀번호 (선택적)
- displayName: 표시 이름 (선택적)
- phoneNumber: 전화번호 (선택적)
- photoURL: 프로필 사진 URL (선택적)
- disabled: 계정 비활성화 여부 (선택적)
```

**`auth_get_user`** - 사용자 정보 조회
```
자연어 요청: "UID가 abc123인 사용자 정보를 조회해주세요"

매개변수:
- uid: 사용자 UID (필수)
```

**`auth_get_user_by_email`** - 이메일로 사용자 조회
```
자연어 요청: "user@example.com 사용자 정보를 조회해주세요"

매개변수:
- email: 사용자 이메일 (필수)
```

**`auth_list_users`** - 사용자 목록 조회
```
자연어 요청: "사용자 목록을 보여주세요" 또는 "최대 50명의 사용자를 조회해주세요"

매개변수:
- maxResults: 조회할 최대 사용자 수 (선택적, 기본값: 1000)
- pageToken: 페이지네이션 토큰 (선택적)
```

**`auth_update_user`** - 사용자 정보 업데이트
```
자연어 요청: "사용자 abc123의 이름을 '홍길동'으로 변경해주세요"

매개변수:
- uid: 사용자 UID (필수)
- email: 새 이메일 (선택적)
- password: 새 비밀번호 (선택적)
- displayName: 새 표시 이름 (선택적)
- phoneNumber: 새 전화번호 (선택적)
- photoURL: 새 프로필 사진 URL (선택적)
- disabled: 계정 비활성화 여부 (선택적)
```

**`auth_delete_user`** - 사용자 삭제
```
자연어 요청: "사용자 abc123을 삭제해주세요"

매개변수:
- uid: 사용자 UID (필수)
```

### 🎟️ **토큰 및 클레임 관리**

**`auth_set_custom_claims`** - 커스텀 클레임 설정
```
자연어 요청: "사용자 abc123에게 admin 권한을 부여해주세요"

매개변수:
- uid: 사용자 UID (필수)
- customClaims: 커스텀 클레임 객체 (필수)
```

**`auth_create_custom_token`** - 커스텀 토큰 생성
```
자연어 요청: "사용자 abc123을 위한 커스텀 토큰을 생성해주세요"

매개변수:
- uid: 사용자 UID (필수)
- additionalClaims: 추가 클레임 (선택적)
```

**`auth_verify_id_token`** - ID 토큰 검증
```
자연어 요청: "이 ID 토큰이 유효한지 확인해주세요"

매개변수:
- idToken: 검증할 ID 토큰 (필수)
```

## 💡 사용 팁

1. **이메일 형식**: 반드시 유효한 이메일 형식을 사용하세요
2. **비밀번호 정책**: Firebase 기본 정책(최소 6자)을 따르세요
3. **UID**: Firebase가 자동 생성하는 고유 식별자입니다
4. **커스텀 클레임**: 최대 1000바이트까지 설정 가능합니다

## 🔗 관련 명령어

- `FB firestore` - 사용자 데이터 저장
- `FB messaging` - 사용자별 알림 전송
- `FB analytics` - 사용자 행동 분석