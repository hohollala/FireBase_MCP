# Firebase App Check 명령어

🔐 **Firebase App Check** - 앱 무결성 및 보안 검증

## 📋 사용 가능한 도구

### 🛡️ **App Check 설정**

**`app_check_enable_service`** - App Check 서비스 활성화
```
자연어 요청: "Firebase App Check를 활성화해주세요"

매개변수:
- appId: 앱 ID (필수)
- enforcementState: 적용 상태 (필수, 'ENFORCED' | 'UNENFORCED')
- ttl: 토큰 유효 시간 (선택적)
```

**`app_check_get_config`** - App Check 설정 조회
```
자연어 요청: "현재 App Check 설정을 보여주세요"

매개변수:
- appId: 앱 ID (필수)
```

**`app_check_update_config`** - App Check 설정 업데이트
```
자연어 요청: "App Check 설정을 업데이트해주세요"

매개변수:
- appId: 앱 ID (필수)
- config: 새 설정 (필수)
```

### 📱 **앱 등록 및 관리**

**`app_check_register_app`** - 앱 등록
```
자연어 요청: "새 앱을 App Check에 등록해주세요"

매개변수:
- platform: 플랫폼 ('ios' | 'android' | 'web') (필수)
- appId: 앱 ID (필수)
- displayName: 표시 이름 (필수)
```

**`app_check_list_apps`** - 등록된 앱 목록 조회
```
자연어 요청: "App Check에 등록된 모든 앱을 보여주세요"

매개변수:
- platform: 플랫폼 필터 (선택적)
- pageSize: 페이지 크기 (선택적)
```

**`app_check_get_app_info`** - 앱 정보 조회
```
자연어 요청: "특정 앱의 App Check 정보를 조회해주세요"

매개변수:
- appId: 앱 ID (필수)
```

### 🔑 **토큰 관리**

**`app_check_create_debug_token`** - 디버그 토큰 생성
```
자연어 요청: "개발용 디버그 토큰을 생성해주세요"

매개변수:
- appId: 앱 ID (필수)
- displayName: 토큰 이름 (필수)
- token: 디버그 토큰 값 (필수)
```

**`app_check_list_debug_tokens`** - 디버그 토큰 목록 조회
```
자연어 요청: "생성된 디버그 토큰 목록을 보여주세요"

매개변수:
- appId: 앱 ID (필수)
```

**`app_check_delete_debug_token`** - 디버그 토큰 삭제
```
자연어 요청: "더 이상 사용하지 않는 디버그 토큰을 삭제해주세요"

매개변수:
- appId: 앱 ID (필수)
- debugTokenId: 디버그 토큰 ID (필수)
```

**`app_check_verify_token`** - 토큰 검증
```
자연어 요청: "App Check 토큰이 유효한지 검증해주세요"

매개변수:
- token: 검증할 토큰 (필수)
- audience: 대상 서비스 (선택적)
```

### 🎯 **서비스별 설정**

**`app_check_configure_firestore`** - Firestore App Check 설정
```
자연어 요청: "Firestore에 App Check를 적용해주세요"

매개변수:
- enforcement: 적용 모드 (필수, 'ENFORCED' | 'UNENFORCED')
- unauthenticatedAllowed: 미인증 접근 허용 여부 (선택적)
```

**`app_check_configure_storage`** - Storage App Check 설정
```
자연어 요청: "Cloud Storage에 App Check를 적용해주세요"

매개변수:
- enforcement: 적용 모드 (필수)
- bucket: 대상 버킷 (선택적)
```

**`app_check_configure_functions`** - Functions App Check 설정
```
자연어 요청: "Cloud Functions에 App Check를 적용해주세요"

매개변수:
- functionName: 함수 이름 (선택적)
- enforcement: 적용 모드 (필수)
```

**`app_check_configure_realtime_database`** - Realtime Database App Check 설정
```
자연어 요청: "Realtime Database에 App Check를 적용해주세요"

매개변수:
- enforcement: 적용 모드 (필수)
- databaseUrl: 데이터베이스 URL (선택적)
```

### 📊 **모니터링 및 분석**

**`app_check_get_verification_stats`** - 검증 통계 조회
```
자연어 요청: "App Check 검증 통계를 보여주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- appId: 앱 ID (선택적)
- groupBy: 그룹화 기준 (선택적)
```

**`app_check_get_failed_verifications`** - 실패한 검증 조회
```
자연어 요청: "검증에 실패한 요청들을 분석해주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- failureReason: 실패 사유 (선택적)
```

**`app_check_get_usage_metrics`** - 사용량 메트릭 조회
```
자연어 요청: "App Check 사용량 메트릭을 조회해주세요"

매개변수:
- timeRange: 시간 범위 (필수)
- metricType: 메트릭 타입 (선택적)
- appId: 앱 ID (선택적)
```

### 🚨 **보안 알림**

**`app_check_set_security_alert`** - 보안 알림 설정
```
자연어 요청: "의심스러운 앱 활동이 감지되면 알림을 받도록 설정해주세요"

매개변수:
- alertName: 알림 이름 (필수)
- conditions: 알림 조건 (필수)
- channels: 알림 채널 (필수)
```

**`app_check_get_security_incidents`** - 보안 사고 조회
```
자연어 요청: "App Check 관련 보안 사고를 조회해주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- severity: 심각도 (선택적)
```

### 🔧 **고급 설정**

**`app_check_set_custom_provider`** - 커스텀 제공자 설정
```
자연어 요청: "커스텀 App Check 제공자를 설정해주세요"

매개변수:
- appId: 앱 ID (필수)
- providerConfig: 제공자 설정 (필수)
```

**`app_check_configure_replay_protection`** - 재생 공격 보호 설정
```
자연어 요청: "토큰 재사용 공격을 방지하도록 설정해주세요"

매개변수:
- enabled: 활성화 여부 (필수)
- windowSize: 검증 창 크기 (선택적)
```

**`app_check_set_rate_limits`** - 요청 제한 설정
```
자연어 요청: "App Check 요청 빈도 제한을 설정해주세요"

매개변수:
- appId: 앱 ID (필수)
- rateLimits: 제한 설정 (필수)
```

### 🧪 **테스트 및 검증**

**`app_check_test_integration`** - 통합 테스트
```
자연어 요청: "App Check 통합이 올바르게 작동하는지 테스트해주세요"

매개변수:
- appId: 앱 ID (필수)
- testScenarios: 테스트 시나리오 (선택적)
```

**`app_check_validate_attestation`** - 증명 검증
```
자연어 요청: "앱의 무결성 증명을 검증해주세요"

매개변수:
- attestationToken: 증명 토큰 (필수)
- expectedApp: 예상 앱 정보 (필수)
```

**`app_check_simulate_attack`** - 공격 시뮬레이션
```
자연어 요청: "보안 테스트를 위해 공격을 시뮬레이션해주세요"

매개변수:
- attackType: 공격 타입 (필수)
- targetApp: 대상 앱 (필수)
- testMode: 테스트 모드 여부 (필수)
```

## 💡 사용 팁

1. **단계적 적용**: 먼저 UNENFORCED 모드로 시작하여 점진적으로 적용하세요
2. **디버그 토큰**: 개발 단계에서는 디버그 토큰을 활용하세요
3. **모니터링**: 적용 후 검증 실패율을 지속적으로 모니터링하세요
4. **플랫폼별 설정**: 각 플랫폼의 특성에 맞게 설정을 최적화하세요
5. **백업 계획**: 문제 발생 시를 대비한 롤백 계획을 수립하세요

## 🔗 관련 명령어

- `FB auth` - 사용자 인증과 연계
- `FB firestore` - 데이터베이스 보안 강화
- `FB storage` - 파일 저장소 보안 강화
- `FB functions` - 서버리스 함수 보안