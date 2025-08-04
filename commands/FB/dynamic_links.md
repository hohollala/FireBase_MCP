# Firebase Dynamic Links 명령어

🔗 **Firebase Dynamic Links** - 스마트 앱 링크 관리

## 📋 사용 가능한 도구

### 🌐 **동적 링크 생성**

**`dynamic_links_create_short_link`** - 짧은 동적 링크 생성
```
자연어 요청: "상품 페이지로 연결되는 짧은 링크를 생성해주세요"

매개변수:
- longDynamicLink: 긴 동적 링크 URL (필수)
- suffix: URL 접미사 옵션 (선택적)
- dynamicLinkInfo: 링크 정보 객체 (선택적)
```

**`dynamic_links_create_long_link`** - 긴 동적 링크 생성
```
자연어 요청: "프로모션 코드가 포함된 상세한 동적 링크를 생성해주세요"

매개변수:
- link: 대상 URL (필수)
- domainUriPrefix: 도메인 URI 접두사 (필수)
- androidInfo: Android 앱 정보 (선택적)
- iosInfo: iOS 앱 정보 (선택적)
- navigationInfo: 네비게이션 정보 (선택적)
```

**`dynamic_links_create_branded_link`** - 브랜드 링크 생성
```
자연어 요청: "회사 브랜드가 포함된 커스텀 동적 링크를 생성해주세요"

매개변수:
- customDomain: 커스텀 도메인 (필수)
- link: 대상 URL (필수)
- socialMetaTagInfo: 소셜 메타 태그 정보 (선택적)
- analyticsInfo: 분석 정보 (선택적)
```

### 📱 **플랫폼별 설정**

**`dynamic_links_set_android_params`** - Android 매개변수 설정
```
자연어 요청: "Android 앱으로 연결되는 링크 설정을 구성해주세요"

매개변수:
- packageName: Android 패키지 이름 (필수)
- fallbackUrl: 대체 URL (선택적)
- minPackageVersionCode: 최소 앱 버전 (선택적)
- customScheme: 커스텀 스킴 (선택적)
```

**`dynamic_links_set_ios_params`** - iOS 매개변수 설정
```
자연어 요청: "iOS 앱으로 연결되는 링크 설정을 구성해주세요"

매개변수:
- bundleId: iOS 번들 ID (필수)
- appStoreId: 앱스토어 ID (선택적)
- fallbackUrl: 대체 URL (선택적)
- minimumVersion: 최소 앱 버전 (선택적)
- ipadBundleId: iPad 전용 번들 ID (선택적)
```

**`dynamic_links_set_web_params`** - 웹 매개변수 설정
```
자연어 요청: "웹 브라우저에서 열리는 링크 설정을 구성해주세요"

매개변수:
- link: 웹 URL (필수)
- openInApp: 앱에서 열기 여부 (선택적)
- universalLinkParams: 유니버설 링크 매개변수 (선택적)
```

### 🎨 **소셜 메타 태그**

**`dynamic_links_set_social_meta_tags`** - 소셜 메타 태그 설정
```
자연어 요청: "소셜 미디어에서 보기 좋은 링크 미리보기를 설정해주세요"

매개변수:
- title: 제목 (필수)
- description: 설명 (선택적)
- imageUrl: 이미지 URL (선택적)
```

**`dynamic_links_update_link_preview`** - 링크 미리보기 업데이트
```
자연어 요청: "기존 동적 링크의 미리보기 이미지를 변경해주세요"

매개변수:
- linkId: 링크 ID (필수)
- previewInfo: 새 미리보기 정보 (필수)
```

### 📊 **링크 분석**

**`dynamic_links_get_link_stats`** - 링크 통계 조회
```
자연어 요청: "동적 링크의 클릭 통계를 보여주세요"

매개변수:
- dynamicLink: 동적 링크 URL (필수)
- startDate: 시작 날짜 (선택적)
- endDate: 종료 날짜 (선택적)
- durationDays: 조회 기간 (선택적)
```

**`dynamic_links_get_platform_stats`** - 플랫폼별 통계 조회
```
자연어 요청: "iOS와 Android별 링크 클릭 현황을 분석해주세요"

매개변수:
- dynamicLink: 동적 링크 URL (필수)
- platformType: 플랫폼 타입 (선택적)
- metricType: 메트릭 타입 (선택적)
```

**`dynamic_links_get_conversion_stats`** - 전환 통계 조회
```
자연어 요청: "링크를 통한 앱 설치 전환율을 분석해주세요"

매개변수:
- dynamicLink: 동적 링크 URL (필수)
- conversionType: 전환 타입 (필수)
- attributionWindow: 기여 창 (선택적)
```

### 🔧 **링크 관리**

**`dynamic_links_list_links`** - 링크 목록 조회
```
자연어 요청: "생성된 모든 동적 링크 목록을 보여주세요"

매개변수:
- pageSize: 페이지 크기 (선택적)
- pageToken: 페이지 토큰 (선택적)
- orderBy: 정렬 기준 (선택적)
```

**`dynamic_links_get_link_info`** - 링크 정보 조회
```
자연어 요청: "특정 동적 링크의 상세 정보를 조회해주세요"

매개변수:
- dynamicLink: 동적 링크 URL (필수)
- includeStats: 통계 포함 여부 (선택적)
```

**`dynamic_links_update_link`** - 링크 정보 업데이트
```
자연어 요청: "기존 동적 링크의 대상 URL을 변경해주세요"

매개변수:
- linkId: 링크 ID (필수)
- updateInfo: 업데이트할 정보 (필수)
```

**`dynamic_links_delete_link`** - 링크 삭제
```
자연어 요청: "더 이상 사용하지 않는 동적 링크를 삭제해주세요"

매개변수:
- linkId: 링크 ID (필수)
```

### 🎯 **캠페인 관리**

**`dynamic_links_create_campaign`** - 캠페인 링크 생성
```
자연어 요청: "마케팅 캠페인용 추적 가능한 링크를 생성해주세요"

매개변수:
- campaignName: 캠페인 이름 (필수)
- source: 트래픽 소스 (필수)
- medium: 마케팅 매체 (필수)
- campaign: 캠페인 식별자 (선택적)
- term: 검색 키워드 (선택적)
- content: 광고 내용 (선택적)
```

**`dynamic_links_get_campaign_performance`** - 캠페인 성과 조회
```
자연어 요청: "마케팅 캠페인의 성과를 분석해주세요"

매개변수:
- campaignName: 캠페인 이름 (필수)
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- metrics: 조회할 메트릭 (선택적)
```

### 🔄 **링크 리디렉션**

**`dynamic_links_set_fallback_behavior`** - 대체 동작 설정
```
자연어 요청: "앱이 설치되지 않은 경우의 동작을 설정해주세요"

매개변수:
- linkId: 링크 ID (필수)
- platform: 플랫폼 (필수)
- fallbackAction: 대체 동작 (필수)
- fallbackUrl: 대체 URL (선택적)
```

**`dynamic_links_test_link`** - 링크 테스트
```
자연어 요청: "생성한 동적 링크가 올바르게 작동하는지 테스트해주세요"

매개변수:
- dynamicLink: 동적 링크 URL (필수)
- platform: 테스트 플랫폼 (필수)
- deviceInfo: 기기 정보 (선택적)
```

### 📈 **고급 분석**

**`dynamic_links_get_attribution_data`** - 어트리뷰션 데이터 조회
```
자연어 요청: "링크를 통한 사용자 유입 경로를 분석해주세요"

매개변수:
- userId: 사용자 ID (선택적)
- dynamicLink: 동적 링크 URL (선택적)
- timeRange: 시간 범위 (필수)
```

**`dynamic_links_export_data`** - 데이터 내보내기
```
자연어 요청: "동적 링크 통계 데이터를 CSV로 내보내주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- format: 내보내기 형식 (선택적)
- filters: 필터 조건 (선택적)
```

## 💡 사용 팁

1. **링크 구조**: 명확하고 일관된 링크 구조를 사용하세요
2. **메타 태그**: 소셜 미디어 공유를 위한 메타 태그를 반드시 설정하세요
3. **대체 URL**: 앱이 설치되지 않은 경우를 위한 대체 URL을 준비하세요
4. **분석 활용**: 링크 성과를 정기적으로 분석하여 마케팅 전략을 개선하세요
5. **테스트**: 배포 전에 다양한 플랫폼에서 링크를 테스트하세요

## 🔗 관련 명령어

- `FB analytics` - 링크 클릭 이벤트 분석
- `FB auth` - 사용자 연결 및 어트리뷰션
- `FB messaging` - 링크가 포함된 알림 전송
- `FB remote_config` - 링크 동작 조건부 설정