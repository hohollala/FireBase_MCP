# Firebase Analytics 명령어

📊 **Firebase Analytics** - 앱 사용자 행동 분석

## 📋 사용 가능한 도구

### 📈 **이벤트 로깅**

**`analytics_log_event`** - 사용자 이벤트 로깅
```
자연어 요청: "사용자 로그인 이벤트를 기록해주세요"

매개변수:
- eventName: 이벤트 이름 (필수)
- parameters: 이벤트 매개변수 (선택적)
- userId: 사용자 ID (선택적)
- timestamp: 이벤트 발생 시간 (선택적)
```

**`analytics_log_purchase`** - 구매 이벤트 로깅
```
자연어 요청: "사용자의 상품 구매 이벤트를 기록해주세요"

매개변수:
- transactionId: 거래 ID (필수)
- currency: 통화 코드 (필수)
- value: 거래 금액 (필수)
- items: 구매 상품 목록 (필수)
- userId: 사용자 ID (선택적)
```

**`analytics_log_screen_view`** - 화면 조회 이벤트 로깅
```
자연어 요청: "사용자가 프로필 페이지를 조회한 이벤트를 기록해주세요"

매개변수:
- screenName: 화면 이름 (필수)
- screenClass: 화면 클래스 (선택적)
- userId: 사용자 ID (선택적)
- parameters: 추가 매개변수 (선택적)
```

### 👤 **사용자 속성**

**`analytics_set_user_property`** - 사용자 속성 설정
```
자연어 요청: "사용자의 선호 카테고리를 설정해주세요"

매개변수:
- userId: 사용자 ID (필수)
- propertyName: 속성 이름 (필수)
- propertyValue: 속성 값 (필수)
```

**`analytics_set_user_id`** - 사용자 ID 설정
```
자연어 요청: "익명 사용자에게 고유 ID를 할당해주세요"

매개변수:
- userId: 설정할 사용자 ID (필수)
- previousUserId: 이전 사용자 ID (선택적)
```

### 📊 **리포트 조회**

**`analytics_get_user_metrics`** - 사용자 메트릭 조회
```
자연어 요청: "지난 30일간의 사용자 통계를 조회해주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- metrics: 조회할 메트릭 목록 (필수)
- dimensions: 차원 목록 (선택적)
```

**`analytics_get_event_metrics`** - 이벤트 메트릭 조회
```
자연어 요청: "로그인 이벤트 발생 횟수를 조회해주세요"

매개변수:
- eventName: 이벤트 이름 (필수)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- groupBy: 그룹화 기준 (선택적)
```

**`analytics_get_conversion_funnel`** - 전환 퍼널 분석
```
자연어 요청: "회원가입부터 첫 구매까지의 전환율을 분석해주세요"

매개변수:
- funnelSteps: 퍼널 단계 배열 (필수)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- segmentBy: 세분화 기준 (선택적)
```

### 📱 **앱 성과 분석**

**`analytics_get_app_overview`** - 앱 개요 조회
```
자연어 요청: "앱의 전반적인 성과 지표를 보여주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- compareWith: 비교 기간 (선택적)
```

**`analytics_get_retention_cohort`** - 코호트 리텐션 분석
```
자연어 요청: "월별 사용자 재방문율을 분석해주세요"

매개변수:
- cohortType: 코호트 타입 (필수)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- returnCriteria: 재방문 기준 (선택적)
```

**`analytics_get_popular_content`** - 인기 콘텐츠 분석
```
자연어 요청: "가장 많이 조회된 페이지를 알려주세요"

매개변수:
- contentType: 콘텐츠 타입 (필수)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- limit: 결과 개수 제한 (선택적)
```

### 🎯 **대상 그룹**

**`analytics_create_audience`** - 맞춤 대상 그룹 생성
```
자연어 요청: "활성 사용자 그룹을 생성해주세요"

매개변수:
- audienceName: 대상 그룹 이름 (필수)
- description: 설명 (선택적)
- criteria: 포함 조건 (필수)
- membershipDuration: 멤버십 기간 (선택적)
```

**`analytics_get_audience_insights`** - 대상 그룹 인사이트 조회
```
자연어 요청: "활성 사용자 그룹의 특성을 분석해주세요"

매개변수:
- audienceId: 대상 그룹 ID (필수)
- insightType: 인사이트 타입 (필수)
- dateRange: 날짜 범위 (선택적)
```

### 🔧 **설정 관리**

**`analytics_get_data_streams`** - 데이터 스트림 조회
```
자연어 요청: "연결된 데이터 스트림 목록을 보여주세요"

매개변수:
- propertyId: 속성 ID (선택적)
```

**`analytics_create_custom_event`** - 맞춤 이벤트 정의
```
자연어 요청: "새로운 맞춤 이벤트를 정의해주세요"

매개변수:
- eventName: 이벤트 이름 (필수)
- description: 이벤트 설명 (선택적)
- parameters: 매개변수 정의 (선택적)
```

**`analytics_set_conversion_event`** - 전환 이벤트 설정
```
자연어 요청: "구매 완료를 전환 이벤트로 설정해주세요"

매개변수:
- eventName: 이벤트 이름 (필수)
- isConversion: 전환 이벤트 여부 (필수)
```

## 💡 사용 팁

1. **이벤트 명명**: 일관된 명명 규칙을 사용하세요 (예: snake_case)
2. **매개변수**: 의미 있는 매개변수를 추가하여 분석 품질을 높이세요
3. **사용자 속성**: 개인정보를 포함하지 않는 속성만 설정하세요
4. **전환 이벤트**: 비즈니스에 중요한 액션을 전환 이벤트로 설정
5. **데이터 보존**: Analytics 데이터는 최대 14개월간 보존됩니다

## 🔗 관련 명령어

- `FB auth` - 사용자 인증 이벤트
- `FB firestore` - 데이터 변경 이벤트
- `FB messaging` - 알림 상호작용 추적
- `FB functions` - 이벤트 처리 자동화