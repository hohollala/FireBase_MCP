# Firebase Remote Config 명령어

🎛️ **Firebase Remote Config** - 원격 앱 설정 관리

## 📋 사용 가능한 도구

### ⚙️ **설정 관리**

**`remote_config_get_config`** - 전체 설정 조회
```
자연어 요청: "현재 Remote Config 설정을 모두 조회해주세요"

매개변수:
- version: 버전 번호 (선택적, 기본값: 최신)
- format: 출력 형식 (선택적)
```

**`remote_config_get_parameter`** - 특정 매개변수 조회
```
자연어 요청: "welcome_message 설정값을 조회해주세요"

매개변수:
- parameterKey: 매개변수 키 (필수)
- userId: 사용자 ID (선택적)
- conditions: 적용 조건 (선택적)
```

**`remote_config_set_parameter`** - 매개변수 설정
```
자연어 요청: "앱의 최대 로그인 시도 횟수를 5회로 설정해주세요"

매개변수:
- parameterKey: 매개변수 키 (필수)
- defaultValue: 기본값 (필수)
- description: 설명 (선택적)
- valueType: 값 타입 (선택적)
```

**`remote_config_delete_parameter`** - 매개변수 삭제
```
자연어 요청: "더 이상 사용하지 않는 old_feature_flag를 삭제해주세요"

매개변수:
- parameterKey: 매개변수 키 (필수)
```

### 🎯 **조건부 설정**

**`remote_config_create_condition`** - 조건 생성
```
자연어 요청: "iOS 사용자를 위한 조건을 생성해주세요"

매개변수:
- conditionName: 조건 이름 (필수)
- expression: 조건 표현식 (필수)
- tagColor: 태그 색상 (선택적)
- description: 설명 (선택적)
```

**`remote_config_set_conditional_value`** - 조건별 값 설정
```
자연어 요청: "한국 사용자에게는 다른 환영 메시지를 보여주세요"

매개변수:
- parameterKey: 매개변수 키 (필수)
- conditionName: 조건 이름 (필수)
- value: 조건별 값 (필수)
```

**`remote_config_list_conditions`** - 조건 목록 조회
```
자연어 요청: "설정된 모든 조건들을 보여주세요"

매개변수:
- includeInactive: 비활성 조건 포함 여부 (선택적)
```

### 📊 **A/B 테스트**

**`remote_config_create_experiment`** - A/B 테스트 실험 생성
```
자연어 요청: "버튼 색상에 대한 A/B 테스트를 생성해주세요"

매개변수:
- experimentName: 실험 이름 (필수)
- parameterKey: 테스트할 매개변수 (필수)
- variants: 변형 버전 배열 (필수)
- targetingCriteria: 대상 기준 (필수)
```

**`remote_config_get_experiment_results`** - 실험 결과 조회
```
자연어 요청: "버튼 색상 A/B 테스트 결과를 보여주세요"

매개변수:
- experimentName: 실험 이름 (필수)
- metricType: 메트릭 타입 (선택적)
- confidenceLevel: 신뢰도 수준 (선택적)
```

**`remote_config_end_experiment`** - 실험 종료
```
자연어 요청: "완료된 A/B 테스트를 종료하고 우승 변형을 적용해주세요"

매개변수:
- experimentName: 실험 이름 (필수)
- winningVariant: 우승 변형 (선택적)
```

### 📝 **템플릿 관리**

**`remote_config_publish_config`** - 설정 게시
```
자연어 요청: "변경된 설정을 실제 앱에 적용해주세요"

매개변수:
- validateOnly: 검증만 수행 여부 (선택적)
- etag: ETag 값 (선택적)
```

**`remote_config_get_template_history`** - 템플릿 히스토리 조회
```
자연어 요청: "지난 일주일간의 설정 변경 히스토리를 보여주세요"

매개변수:
- startTime: 시작 시간 (선택적)
- endTime: 종료 시간 (선택적)
- pageSize: 페이지 크기 (선택적)
```

**`remote_config_rollback_template`** - 템플릿 롤백
```
자연어 요청: "이전 버전의 설정으로 롤백해주세요"

매개변수:
- versionNumber: 롤백할 버전 번호 (필수)
```

### 🎨 **매개변수 그룹**

**`remote_config_create_parameter_group`** - 매개변수 그룹 생성
```
자연어 요청: "UI 관련 설정들을 그룹으로 묶어주세요"

매개변수:
- groupName: 그룹 이름 (필수)
- description: 그룹 설명 (선택적)
- parameters: 포함할 매개변수 배열 (선택적)
```

**`remote_config_add_to_group`** - 그룹에 매개변수 추가
```
자연어 요청: "theme_color 설정을 UI 그룹에 추가해주세요"

매개변수:
- groupName: 그룹 이름 (필수)
- parameterKey: 매개변수 키 (필수)
```

### 🔍 **모니터링 및 분석**

**`remote_config_get_usage_stats`** - 사용 통계 조회
```
자연어 요청: "Remote Config 매개변수 사용 통계를 보여주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- parameterKey: 특정 매개변수 (선택적)
```

**`remote_config_get_fetch_stats`** - 가져오기 통계 조회
```
자연어 요청: "앱에서 설정을 가져온 횟수를 분석해주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- groupBy: 그룹화 기준 (선택적)
```

### 🚨 **알림 및 모니터링**

**`remote_config_set_alert`** - 변경 알림 설정
```
자연어 요청: "중요한 설정이 변경되면 알림을 받도록 설정해주세요"

매개변수:
- parameterKeys: 모니터링할 매개변수 배열 (필수)
- alertChannels: 알림 채널 (필수)
- conditions: 알림 조건 (선택적)
```

**`remote_config_validate_config`** - 설정 유효성 검증
```
자연어 요청: "현재 설정의 유효성을 검증해주세요"

매개변수:
- config: 검증할 설정 (선택적, 기본값: 현재 설정)
- strict: 엄격한 검증 여부 (선택적)
```

### 🔄 **동기화 및 캐시**

**`remote_config_force_refresh`** - 강제 새로고침
```
자연어 요청: "모든 클라이언트에서 설정을 즉시 새로고침하도록 해주세요"

매개변수:
- targetClients: 대상 클라이언트 (선택적)
- parameters: 새로고침할 매개변수 (선택적)
```

**`remote_config_get_cache_status`** - 캐시 상태 조회
```
자연어 요청: "클라이언트의 캐시 상태를 확인해주세요"

매개변수:
- clientId: 클라이언트 ID (선택적)
- detailed: 상세 정보 포함 여부 (선택적)
```

## 💡 사용 팁

1. **기본값 설정**: 모든 매개변수에 적절한 기본값을 설정하세요
2. **조건 활용**: 플랫폼, 지역, 앱 버전별로 다른 값을 제공하세요
3. **A/B 테스트**: 중요한 변경사항은 A/B 테스트로 검증하세요
4. **변경 주기**: 너무 자주 변경하지 않도록 주의하세요
5. **버전 관리**: 중요한 변경사항은 버전을 기록하고 롤백 계획을 수립하세요

## 🔗 관련 명령어

- `FB analytics` - A/B 테스트 결과 분석
- `FB auth` - 사용자별 개인화 설정
- `FB functions` - 설정 변경 자동화
- `FB firestore` - 설정 히스토리 저장