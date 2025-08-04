# Firebase Functions 명령어

⚡ **Firebase Functions** - 서버리스 클라우드 함수

## 📋 사용 가능한 도구

### 🚀 **함수 배포**

**`functions_deploy_function`** - 함수 배포
```
자연어 요청: "새로운 HTTP 함수를 배포해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- sourceCode: 함수 소스 코드 (필수)
- runtime: 런타임 환경 (선택적, 기본값: 'nodejs18')
- trigger: 트리거 타입 (필수)
- environmentVariables: 환경 변수 (선택적)
```

**`functions_deploy_from_zip`** - ZIP 파일로 함수 배포
```
자연어 요청: "ZIP 파일로 패키징된 함수를 배포해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- zipFilePath: ZIP 파일 경로 (필수)
- trigger: 트리거 타입 (필수)
- runtime: 런타임 환경 (선택적)
```

**`functions_update_function`** - 함수 업데이트
```
자연어 요청: "기존 함수의 코드를 업데이트해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- sourceCode: 새 소스 코드 (선택적)
- environmentVariables: 환경 변수 (선택적)
- description: 함수 설명 (선택적)
```

### 🎯 **함수 호출**

**`functions_call_http`** - HTTP 함수 호출
```
자연어 요청: "sendEmail 함수를 호출해서 이메일을 전송해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- data: 전달할 데이터 (선택적)
- method: HTTP 메서드 (선택적, 기본값: 'POST')
- headers: HTTP 헤더 (선택적)
```

**`functions_call_callable`** - 호출 가능한 함수 실행
```
자연어 요청: "calculateTax 함수를 호출해서 세금을 계산해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- data: 전달할 데이터 (선택적)
- context: 호출 컨텍스트 (선택적)
```

### 📊 **함수 관리**

**`functions_list_functions`** - 함수 목록 조회
```
자연어 요청: "배포된 모든 함수 목록을 보여주세요"

매개변수:
- region: 리전 (선택적, 기본값: 'us-central1')
- pageSize: 페이지 크기 (선택적)
- pageToken: 페이지 토큰 (선택적)
```

**`functions_get_function`** - 함수 정보 조회
```
자연어 요청: "sendNotification 함수의 상세 정보를 조회해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- region: 리전 (선택적)
```

**`functions_delete_function`** - 함수 삭제
```
자연어 요청: "더 이상 사용하지 않는 함수를 삭제해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- region: 리전 (선택적)
```

### 📝 **로그 및 모니터링**

**`functions_get_logs`** - 함수 로그 조회
```
자연어 요청: "지난 1시간 동안의 함수 로그를 조회해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- startTime: 시작 시간 (선택적)
- endTime: 종료 시간 (선택적)
- filter: 로그 필터 (선택적)
- orderBy: 정렬 기준 (선택적)
```

**`functions_get_metrics`** - 함수 메트릭 조회
```
자연어 요청: "함수의 실행 통계를 보여주세요"

매개변수:
- functionName: 함수 이름 (필수)
- metricType: 메트릭 타입 (필수)
- startTime: 시작 시간 (선택적)
- endTime: 종료 시간 (선택적)
```

### ⚙️ **환경 설정**

**`functions_set_env_vars`** - 환경 변수 설정
```
자연어 요청: "함수의 환경 변수를 설정해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- environmentVariables: 환경 변수 객체 (필수)
```

**`functions_get_env_vars`** - 환경 변수 조회
```
자연어 요청: "함수의 환경 변수를 조회해주세요"

매개변수:
- functionName: 함수 이름 (필수)
```

**`functions_set_iam_policy`** - IAM 정책 설정
```
자연어 요청: "함수의 접근 권한을 설정해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- policy: IAM 정책 (필수)
```

### 🔄 **트리거 관리**

**`functions_create_pubsub_trigger`** - Pub/Sub 트리거 생성
```
자연어 요청: "메시지 큐 이벤트로 함수를 트리거하도록 설정해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- topicName: Pub/Sub 토픽 이름 (필수)
```

**`functions_create_firestore_trigger`** - Firestore 트리거 생성
```
자연어 요청: "문서 변경 시 함수가 실행되도록 설정해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- documentPath: 문서 경로 (필수)
- eventType: 이벤트 타입 (필수)
```

**`functions_create_storage_trigger`** - Storage 트리거 생성
```
자연어 요청: "파일 업로드 시 함수가 실행되도록 설정해주세요"

매개변수:
- functionName: 함수 이름 (필수)
- bucket: 스토리지 버킷 (필수)
- eventType: 이벤트 타입 (필수)
```

## 💡 사용 팁

1. **런타임**: Node.js, Python, Go, Java 등 다양한 런타임 지원
2. **트리거**: HTTP, Pub/Sub, Firestore, Storage 등 다양한 트리거 타입
3. **환경 변수**: 민감한 정보는 환경 변수를 통해 관리
4. **로그**: 함수 실행 로그를 통해 디버깅 및 모니터링
5. **IAM**: 적절한 권한 설정으로 보안 강화

## 🔗 관련 명령어

- `FB firestore` - 데이터베이스 트리거 설정
- `FB storage` - 파일 이벤트 트리거
- `FB messaging` - 알림 발송 함수
- `FB analytics` - 이벤트 처리 함수