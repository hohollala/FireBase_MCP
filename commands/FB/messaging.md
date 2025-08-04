# Firebase Messaging 명령어

💬 **Firebase Messaging** - 클라우드 메시징 및 푸시 알림

## 📋 사용 가능한 도구

### 📱 **메시지 전송**

**`messaging_send_to_device`** - 특정 기기로 메시지 전송
```
자연어 요청: "사용자의 스마트폰으로 푸시 알림을 전송해주세요"

매개변수:
- registrationToken: 기기 등록 토큰 (필수)
- notification: 알림 페이로드 (선택적)
- data: 데이터 페이로드 (선택적)
- options: 전송 옵션 (선택적)
```

**`messaging_send_to_multiple_devices`** - 여러 기기로 메시지 전송
```
자연어 요청: "선택된 사용자들에게 일괄 알림을 전송해주세요"

매개변수:
- registrationTokens: 기기 등록 토큰 배열 (필수)
- notification: 알림 페이로드 (선택적)
- data: 데이터 페이로드 (선택적)
- options: 전송 옵션 (선택적)
```

**`messaging_send_to_topic`** - 토픽 구독자에게 메시지 전송
```
자연어 요청: "뉴스 구독자들에게 새 기사 알림을 전송해주세요"

매개변수:
- topic: 토픽 이름 (필수)
- notification: 알림 페이로드 (선택적)
- data: 데이터 페이로드 (선택적)
- options: 전송 옵션 (선택적)
```

**`messaging_send_to_condition`** - 조건부 메시지 전송
```
자연어 요청: "iOS와 Android 사용자 모두에게 업데이트 알림을 전송해주세요"

매개변수:
- condition: 조건 문자열 (필수)
- notification: 알림 페이로드 (선택적)
- data: 데이터 페이로드 (선택적)
- options: 전송 옵션 (선택적)
```

### 🏷️ **토픽 관리**

**`messaging_subscribe_to_topic`** - 토픽 구독
```
자연어 요청: "사용자를 스포츠 뉴스 토픽에 구독시켜주세요"

매개변수:
- registrationTokens: 기기 등록 토큰 배열 (필수)
- topic: 토픽 이름 (필수)
```

**`messaging_unsubscribe_from_topic`** - 토픽 구독 해제
```
자연어 요청: "사용자의 마케팅 알림 구독을 해제해주세요"

매개변수:
- registrationTokens: 기기 등록 토큰 배열 (필수)
- topic: 토픽 이름 (필수)
```

**`messaging_list_topic_subscriptions`** - 토픽 구독 목록 조회
```
자연어 요청: "사용자가 구독 중인 토픽 목록을 보여주세요"

매개변수:
- registrationToken: 기기 등록 토큰 (필수)
```

### 📊 **메시지 분석**

**`messaging_get_message_stats`** - 메시지 전송 통계 조회
```
자연어 요청: "지난 주 푸시 알림 전송 성과를 보여주세요"

매개변수:
- startDate: 시작 날짜 (필수)
- endDate: 종료 날짜 (필수)
- messageType: 메시지 타입 (선택적)
- groupBy: 그룹화 기준 (선택적)
```

**`messaging_get_delivery_report`** - 전송 결과 리포트 조회
```
자연어 요청: "특정 메시지의 전송 결과를 조회해주세요"

매개변수:
- messageId: 메시지 ID (필수)
- includeDetails: 상세 정보 포함 여부 (선택적)
```

### 🎨 **메시지 템플릿**

**`messaging_create_template`** - 메시지 템플릿 생성
```
자연어 요청: "환영 메시지 템플릿을 생성해주세요"

매개변수:
- templateName: 템플릿 이름 (필수)
- title: 알림 제목 (필수)
- body: 알림 내용 (필수)
- imageUrl: 이미지 URL (선택적)
- clickAction: 클릭 액션 (선택적)
```

**`messaging_send_with_template`** - 템플릿으로 메시지 전송
```
자연어 요청: "환영 메시지 템플릿으로 신규 사용자에게 알림을 전송해주세요"

매개변수:
- templateName: 템플릿 이름 (필수)
- target: 전송 대상 (필수)
- variables: 템플릿 변수 (선택적)
```

### ⏰ **예약 메시지**

**`messaging_schedule_message`** - 메시지 예약 전송
```
자연어 요청: "내일 오전 9시에 리마인더 알림을 예약해주세요"

매개변수:
- target: 전송 대상 (필수)
- notification: 알림 페이로드 (필수)
- scheduledTime: 예약 시간 (필수)
- timezone: 시간대 (선택적)
```

**`messaging_cancel_scheduled_message`** - 예약 메시지 취소
```
자연어 요청: "예약된 프로모션 알림을 취소해주세요"

매개변수:
- scheduleId: 예약 ID (필수)
```

**`messaging_list_scheduled_messages`** - 예약 메시지 목록 조회
```
자연어 요청: "예약된 메시지 목록을 보여주세요"

매개변수:
- status: 상태 필터 (선택적)
- startDate: 시작 날짜 (선택적)
- endDate: 종료 날짜 (선택적)
```

### 🔔 **알림 설정**

**`messaging_validate_token`** - 등록 토큰 유효성 검증
```
자연어 요청: "기기 토큰이 유효한지 확인해주세요"

매개변수:
- registrationToken: 기기 등록 토큰 (필수)
```

**`messaging_get_notification_settings`** - 알림 설정 조회
```
자연어 요청: "사용자의 알림 설정을 조회해주세요"

매개변수:
- userId: 사용자 ID (필수)
```

**`messaging_update_notification_settings`** - 알림 설정 업데이트
```
자연어 요청: "사용자의 알림 환경설정을 업데이트해주세요"

매개변수:
- userId: 사용자 ID (필수)
- settings: 알림 설정 객체 (필수)
```

### 📱 **플랫폼별 설정**

**`messaging_send_ios_notification`** - iOS 전용 알림 전송
```
자연어 요청: "iOS 사용자에게 배지 카운트와 함께 알림을 전송해주세요"

매개변수:
- registrationTokens: iOS 기기 토큰 배열 (필수)
- apsPayload: APS 페이로드 (필수)
- data: 커스텀 데이터 (선택적)
```

**`messaging_send_android_notification`** - Android 전용 알림 전송
```
자연어 요청: "Android 사용자에게 맞춤 아이콘과 함께 알림을 전송해주세요"

매개변수:
- registrationTokens: Android 기기 토큰 배열 (필수)
- androidConfig: Android 설정 (필수)
- data: 커스텀 데이터 (선택적)
```

**`messaging_send_web_notification`** - 웹 푸시 알림 전송
```
자연어 요청: "웹 브라우저 사용자에게 푸시 알림을 전송해주세요"

매개변수:
- registrationTokens: 웹 토큰 배열 (필수)
- webpushConfig: 웹푸시 설정 (필수)
- data: 커스텀 데이터 (선택적)
```

## 💡 사용 팁

1. **토큰 관리**: 등록 토큰은 정기적으로 유효성을 검증하세요
2. **메시지 크기**: 총 페이로드 크기는 4KB를 초과하지 않도록 하세요
3. **배치 전송**: 대량 전송 시 배치 처리를 활용하세요
4. **플랫폼 최적화**: 각 플랫폼의 특성에 맞게 메시지를 최적화하세요
5. **사용자 경험**: 적절한 빈도와 시간을 고려하여 알림을 전송하세요

## 🔗 관련 명령어

- `FB auth` - 사용자별 알림 설정
- `FB firestore` - 알림 히스토리 저장
- `FB analytics` - 알림 성과 분석
- `FB functions` - 자동 알림 트리거