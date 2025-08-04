# Firebase Performance 명령어

⚡ **Firebase Performance** - 앱 성능 모니터링

## 📋 사용 가능한 도구

### 📊 **성능 메트릭 조회**

**`performance_get_app_overview`** - 앱 성능 개요 조회
```
자연어 요청: "앱의 전반적인 성능 지표를 보여주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- appVersion: 앱 버전 (선택적)
- platform: 플랫폼 (선택적)
```

**`performance_get_startup_metrics`** - 앱 시작 성능 메트릭 조회
```
자연어 요청: "앱 시작 시간 통계를 조회해주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- percentile: 백분위수 (선택적, 기본값: 90)
- groupBy: 그룹화 기준 (선택적)
```

**`performance_get_network_metrics`** - 네트워크 성능 메트릭 조회
```
자연어 요청: "API 호출 응답 시간 통계를 보여주세요"

매개변수:
- urlPattern: URL 패턴 (선택적)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- httpMethod: HTTP 메서드 (선택적)
```

### 📱 **화면 성능 분석**

**`performance_get_screen_metrics`** - 화면별 성능 메트릭 조회
```
자연어 요청: "메인 화면의 렌더링 성능을 분석해주세요"

매개변수:
- screenName: 화면 이름 (필수)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- metricType: 메트릭 타입 (선택적)
```

**`performance_get_slow_renders`** - 느린 렌더링 분석
```
자연어 요청: "렌더링이 느린 화면들을 찾아주세요"

매개변수:
- threshold: 임계값 (선택적, 기본값: 16ms)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- limit: 결과 개수 제한 (선택적)
```

**`performance_get_frozen_frames`** - 프리징 프레임 분석
```
자연어 요청: "앱이 멈춘 구간을 분석해주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- screenName: 화면 이름 (선택적)
- severity: 심각도 (선택적)
```

### 🌐 **네트워크 추적**

**`performance_get_http_requests`** - HTTP 요청 성능 조회
```
자연어 요청: "API 엔드포인트별 응답 시간을 분석해주세요"

매개변수:
- endpoint: API 엔드포인트 (선택적)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- statusCode: HTTP 상태 코드 (선택적)
```

**`performance_get_failed_requests`** - 실패한 요청 분석
```
자연어 요청: "실패한 네트워크 요청들을 분석해주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- errorType: 오류 타입 (선택적)
- groupBy: 그룹화 기준 (선택적)
```

### 🔧 **커스텀 추적**

**`performance_create_custom_trace`** - 커스텀 추적 생성
```
자연어 요청: "데이터 로딩 시간을 추적하는 커스텀 트레이스를 생성해주세요"

매개변수:
- traceName: 추적 이름 (필수)
- description: 설명 (선택적)
- attributes: 속성 객체 (선택적)
```

**`performance_get_custom_trace_metrics`** - 커스텀 추적 메트릭 조회
```
자연어 요청: "데이터 로딩 추적 결과를 보여주세요"

매개변수:
- traceName: 추적 이름 (필수)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- percentile: 백분위수 (선택적)
```

### 📈 **성능 알림**

**`performance_set_alert_rule`** - 성능 알림 규칙 설정
```
자연어 요청: "앱 시작 시간이 3초를 초과하면 알림을 받도록 설정해주세요"

매개변수:
- metricType: 메트릭 타입 (필수)
- threshold: 임계값 (필수)
- comparison: 비교 연산자 (필수)
- alertName: 알림 이름 (필수)
```

**`performance_get_alert_history`** - 알림 히스토리 조회
```
자연어 요청: "성능 알림 히스토리를 보여주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- alertName: 알림 이름 (선택적)
- severity: 심각도 (선택적)
```

### 🔍 **성능 분석**

**`performance_analyze_trends`** - 성능 트렌드 분석
```
자연어 요청: "지난 한 달간의 성능 변화 추이를 분석해주세요"

매개변수:
- metricType: 메트릭 타입 (필수)
- timeframe: 시간 프레임 (필수)
- compareWith: 비교 기간 (선택적)
```

**`performance_get_crash_free_rate`** - 크래시 프리 비율 조회
```
자연어 요청: "앱의 안정성 지표를 보여주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- appVersion: 앱 버전 (선택적)
- platform: 플랫폼 (선택적)
```

**`performance_get_user_satisfaction`** - 사용자 만족도 점수 조회
```
자연어 요청: "사용자 경험 점수를 계산해주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- weightFactors: 가중치 요소 (선택적)
```

### 📱 **플랫폼별 메트릭**

**`performance_get_ios_metrics`** - iOS 전용 성능 메트릭
```
자연어 요청: "iOS 앱의 메모리 사용량을 분석해주세요"

매개변수:
- metricType: iOS 메트릭 타입 (필수)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- deviceModel: 기기 모델 (선택적)
```

**`performance_get_android_metrics`** - Android 전용 성능 메트릭
```
자연어 요청: "Android 앱의 ANR 발생률을 조회해주세요"

매개변수:
- metricType: Android 메트릭 타입 (필수)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- androidVersion: Android 버전 (선택적)
```

**`performance_get_web_vitals`** - 웹 바이탈 메트릭 조회
```
자연어 요청: "웹앱의 Core Web Vitals를 분석해주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- pageUrl: 페이지 URL (선택적)
- deviceType: 기기 타입 (선택적)
```

## 💡 사용 팁

1. **성능 기준**: 각 플랫폼의 성능 권장사항을 숙지하세요
2. **모니터링 주기**: 정기적인 성능 모니터링으로 문제를 사전에 발견
3. **사용자 그룹**: 기기, 지역, 네트워크별로 성능을 세분화하여 분석
4. **알림 설정**: 중요한 성능 지표에 대한 알림을 설정하여 즉시 대응
5. **최적화 우선순위**: 사용자 경험에 가장 큰 영향을 주는 부분부터 최적화

## 🔗 관련 명령어

- `FB analytics` - 성능과 사용자 행동 연관 분석
- `FB crashlytics` - 크래시와 성능 문제 상관관계
- `FB functions` - 성능 데이터 처리 자동화
- `FB firestore` - 성능 데이터 저장 및 분석