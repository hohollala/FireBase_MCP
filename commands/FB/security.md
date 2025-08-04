# Firebase Security 명령어

🛡️ **Firebase Security** - 보안 규칙 및 보안 관리

## 📋 사용 가능한 도구

### 🔒 **보안 규칙 관리**

**`security_get_firestore_rules`** - Firestore 보안 규칙 조회
```
자연어 요청: "현재 Firestore 보안 규칙을 보여주세요"

매개변수:
- format: 출력 형식 (선택적, 'json' | 'rules')
- version: 규칙 버전 (선택적)
```

**`security_update_firestore_rules`** - Firestore 보안 규칙 업데이트
```
자연어 요청: "사용자가 자신의 문서만 읽을 수 있도록 규칙을 설정해주세요"

매개변수:
- rules: 새 보안 규칙 (필수)
- testFirst: 테스트 먼저 실행 여부 (선택적)
```

**`security_get_storage_rules`** - Storage 보안 규칙 조회
```
자연어 요청: "Storage 보안 규칙을 조회해주세요"

매개변수:
- bucket: 스토리지 버킷 (선택적)
- format: 출력 형식 (선택적)
```

**`security_update_storage_rules`** - Storage 보안 규칙 업데이트
```
자연어 요청: "인증된 사용자만 파일을 업로드할 수 있도록 설정해주세요"

매개변수:
- rules: 새 보안 규칙 (필수)
- bucket: 대상 버킷 (선택적)
```

### 🧪 **보안 규칙 테스트**

**`security_test_firestore_rules`** - Firestore 규칙 테스트
```
자연어 요청: "새 보안 규칙이 올바르게 작동하는지 테스트해주세요"

매개변수:
- rules: 테스트할 규칙 (필수)
- testCases: 테스트 케이스 배열 (필수)
- userId: 테스트 사용자 ID (선택적)
```

**`security_test_storage_rules`** - Storage 규칙 테스트
```
자연어 요청: "파일 업로드 권한이 올바르게 작동하는지 확인해주세요"

매개변수:
- rules: 테스트할 규칙 (필수)
- testCases: 테스트 케이스 배열 (필수)
- filePath: 테스트 파일 경로 (필수)
```

**`security_validate_rules_syntax`** - 규칙 문법 검증
```
자연어 요청: "작성한 보안 규칙의 문법이 올바른지 검증해주세요"

매개변수:
- rules: 검증할 규칙 (필수)
- serviceType: 서비스 타입 (필수, 'firestore' | 'storage')
```

### 🔍 **보안 모니터링**

**`security_get_access_logs`** - 접근 로그 조회
```
자연어 요청: "지난 24시간 동안의 데이터 접근 로그를 보여주세요"

매개변수:
- startTime: 시작 시간 (필수)
- endTime: 종료 시간 (필수)
- resourceType: 리소스 타입 (선택적)
- userId: 사용자 ID (선택적)
```

**`security_get_failed_attempts`** - 실패한 접근 시도 조회
```
자연어 요청: "보안 규칙에 의해 차단된 접근 시도를 분석해주세요"

매개변수:
- startTime: 시작 시간 (필수)
- endTime: 종료 시간 (필수)
- ruleType: 규칙 타입 (선택적)
- groupBy: 그룹화 기준 (선택적)
```

**`security_analyze_threats`** - 위협 분석
```
자연어 요청: "비정상적인 접근 패턴을 분석해주세요"

매개변수:
- timeWindow: 분석 시간 창 (필수)
- threatTypes: 위협 타입 배열 (선택적)
- sensitivity: 민감도 수준 (선택적)
```

### 🚨 **보안 알림**

**`security_set_security_alert`** - 보안 알림 설정
```
자연어 요청: "의심스러운 활동이 감지되면 알림을 받도록 설정해주세요"

매개변수:
- alertName: 알림 이름 (필수)
- conditions: 알림 조건 (필수)
- channels: 알림 채널 (필수)
- severity: 심각도 (선택적)
```

**`security_get_security_incidents`** - 보안 사고 조회
```
자연어 요청: "발생한 보안 사고 목록을 보여주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- severity: 심각도 필터 (선택적)
- status: 상태 필터 (선택적)
```

### 🔐 **액세스 토큰 관리**

**`security_list_service_accounts`** - 서비스 계정 목록 조회
```
자연어 요청: "프로젝트의 모든 서비스 계정을 보여주세요"

매개변수:
- includeKeys: 키 정보 포함 여부 (선택적)
```

**`security_create_service_account_key`** - 서비스 계정 키 생성
```
자연어 요청: "새 서비스 계정 키를 생성해주세요"

매개변수:
- serviceAccountEmail: 서비스 계정 이메일 (필수)
- keyAlgorithm: 키 알고리즘 (선택적)
- privateKeyType: 개인 키 타입 (선택적)
```

**`security_revoke_service_account_key`** - 서비스 계정 키 취소
```
자연어 요청: "노출된 서비스 계정 키를 취소해주세요"

매개변수:
- serviceAccountEmail: 서비스 계정 이메일 (필수)
- keyId: 키 ID (필수)
```

### 🔑 **API 키 관리**

**`security_list_api_keys`** - API 키 목록 조회
```
자연어 요청: "프로젝트의 모든 API 키를 보여주세요"

매개변수:
- showRestrictions: 제한사항 표시 여부 (선택적)
```

**`security_create_api_key`** - API 키 생성
```
자연어 요청: "새 API 키를 생성하고 도메인 제한을 설정해주세요"

매개변수:
- displayName: 표시 이름 (필수)
- restrictions: 사용 제한사항 (선택적)
- scopes: 권한 범위 (선택적)
```

**`security_update_api_key_restrictions`** - API 키 제한사항 업데이트
```
자연어 요청: "API 키의 IP 주소 제한을 업데이트해주세요"

매개변수:
- keyId: API 키 ID (필수)
- restrictions: 새 제한사항 (필수)
```

**`security_disable_api_key`** - API 키 비활성화
```
자연어 요청: "더 이상 사용하지 않는 API 키를 비활성화해주세요"

매개변수:
- keyId: API 키 ID (필수)
- reason: 비활성화 사유 (선택적)
```

### 🔒 **사용자 권한 관리**

**`security_list_iam_members`** - IAM 멤버 목록 조회
```
자연어 요청: "프로젝트의 모든 IAM 멤버를 보여주세요"

매개변수:
- includeRoles: 역할 정보 포함 여부 (선택적)
```

**`security_add_iam_member`** - IAM 멤버 추가
```
자연어 요청: "새 개발자에게 Editor 권한을 부여해주세요"

매개변수:
- member: 멤버 이메일 (필수)
- role: 부여할 역할 (필수)
- condition: 조건부 권한 (선택적)
```

**`security_remove_iam_member`** - IAM 멤버 제거
```
자연어 요청: "퇴사한 직원의 프로젝트 접근 권한을 제거해주세요"

매개변수:
- member: 멤버 이메일 (필수)
- role: 제거할 역할 (선택적)
```

### 📊 **보안 감사**

**`security_run_security_audit`** - 보안 감사 실행
```
자연어 요청: "프로젝트의 전체 보안 상태를 감사해주세요"

매개변수:
- auditType: 감사 타입 (필수)
- includeDetails: 상세 정보 포함 여부 (선택적)
```

**`security_get_compliance_report`** - 컴플라이언스 리포트 조회
```
자연어 요청: "GDPR 컴플라이언스 상태 리포트를 생성해주세요"

매개변수:
- complianceStandard: 컴플라이언스 표준 (필수)
- reportFormat: 리포트 형식 (선택적)
```

**`security_export_security_config`** - 보안 설정 백업
```
자연어 요청: "현재 보안 설정을 백업용으로 내보내주세요"

매개변수:
- includeKeys: 키 정보 포함 여부 (선택적)
- format: 백업 형식 (선택적)
```

## 💡 사용 팁

1. **최소 권한 원칙**: 필요한 최소한의 권한만 부여하세요
2. **정기 감사**: 주기적으로 권한과 접근 로그를 검토하세요
3. **키 로테이션**: 서비스 계정 키를 정기적으로 교체하세요
4. **모니터링**: 비정상적인 접근 패턴을 실시간으로 모니터링하세요
5. **백업**: 보안 설정을 정기적으로 백업하세요

## 🔗 관련 명령어

- `FB auth` - 사용자 인증 보안
- `FB firestore` - 데이터베이스 보안 규칙
- `FB storage` - 파일 저장소 보안
- `FB analytics` - 보안 이벤트 분석