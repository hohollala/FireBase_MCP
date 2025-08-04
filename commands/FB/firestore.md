# Firebase Firestore 명령어

🗄️ **Firebase Firestore** - NoSQL 클라우드 데이터베이스

## 📋 사용 가능한 도구

### 📄 **문서 작업**

**`firestore_get_document`** - 문서 조회
```
자연어 요청: "users 컬렉션에서 user123 문서를 조회해주세요"

매개변수:
- collectionPath: 컬렉션 경로 (필수)
- documentId: 문서 ID (필수)
```

**`firestore_set_document`** - 문서 생성/업데이트
```
자연어 요청: "users 컬렉션에 새 사용자 문서를 생성해주세요"

매개변수:
- collectionPath: 컬렉션 경로 (필수)
- documentId: 문서 ID (필수)
- data: 문서 데이터 객체 (필수)
- merge: 기존 데이터와 병합 여부 (선택적)
```

**`firestore_update_document`** - 문서 부분 업데이트
```
자연어 요청: "user123 문서의 name 필드를 '홍길동'으로 업데이트해주세요"

매개변수:
- collectionPath: 컬렉션 경로 (필수)
- documentId: 문서 ID (필수)
- data: 업데이트할 필드 객체 (필수)
```

**`firestore_delete_document`** - 문서 삭제
```
자연어 요청: "users 컬렉션에서 user123 문서를 삭제해주세요"

매개변수:
- collectionPath: 컬렉션 경로 (필수)
- documentId: 문서 ID (필수)
```

### 🔍 **쿼리 작업**

**`firestore_query_collection`** - 컬렉션 쿼리
```
자연어 요청: "age가 18 이상인 사용자를 조회해주세요"

매개변수:
- collectionPath: 컬렉션 경로 (필수)
- where: WHERE 조건 배열 (선택적)
- orderBy: 정렬 조건 (선택적)
- limit: 결과 개수 제한 (선택적)
- startAfter: 페이지네이션 시작점 (선택적)
```

**`firestore_query_collection_group`** - 컬렉션 그룹 쿼리
```
자연어 요청: "모든 posts 서브컬렉션에서 published가 true인 게시물을 조회해주세요"

매개변수:
- collectionId: 컬렉션 ID (필수)
- where: WHERE 조건 배열 (선택적)
- orderBy: 정렬 조건 (선택적)
- limit: 결과 개수 제한 (선택적)
```

### 📊 **집계 쿼리**

**`firestore_count_documents`** - 문서 개수 조회
```
자연어 요청: "users 컬렉션의 문서 개수를 알려주세요"

매개변수:
- collectionPath: 컬렉션 경로 (필수)
- where: WHERE 조건 배열 (선택적)
```

**`firestore_sum_field`** - 필드 합계 계산
```
자연어 요청: "orders 컬렉션의 total 필드 합계를 계산해주세요"

매개변수:
- collectionPath: 컬렉션 경로 (필수)
- field: 합계를 계산할 필드 (필수)
- where: WHERE 조건 배열 (선택적)
```

**`firestore_average_field`** - 필드 평균 계산
```
자연어 요청: "products 컬렉션의 price 필드 평균을 계산해주세요"

매개변수:
- collectionPath: 컬렉션 경로 (필수)
- field: 평균을 계산할 필드 (필수)
- where: WHERE 조건 배열 (선택적)
```

### 🔄 **실시간 리스너**

**`firestore_listen_document`** - 문서 실시간 리스너
```
자연어 요청: "user123 문서의 변경사항을 실시간으로 모니터링해주세요"

매개변수:
- collectionPath: 컬렉션 경로 (필수)
- documentId: 문서 ID (필수)
- listenerName: 리스너 이름 (필수)
```

**`firestore_listen_collection`** - 컬렉션 실시간 리스너
```
자연어 요청: "users 컬렉션의 변경사항을 실시간으로 모니터링해주세요"

매개변수:
- collectionPath: 컬렉션 경로 (필수)
- where: WHERE 조건 배열 (선택적)
- orderBy: 정렬 조건 (선택적)
- limit: 결과 개수 제한 (선택적)
- listenerName: 리스너 이름 (필수)
```

**`firestore_remove_listener`** - 리스너 제거
```
자연어 요청: "user-listener 리스너를 제거해주세요"

매개변수:
- listenerName: 제거할 리스너 이름 (필수)
```

### 📦 **배치 작업**

**`firestore_batch_write`** - 배치 쓰기
```
자연어 요청: "여러 문서를 한 번에 업데이트해주세요"

매개변수:
- operations: 배치 작업 배열 (필수)
  - type: 'set' | 'update' | 'delete'
  - collectionPath: 컬렉션 경로
  - documentId: 문서 ID
  - data: 데이터 (set/update 시)
```

**`firestore_transaction`** - 트랜잭션 실행
```
자연어 요청: "계좌 간 송금을 트랜잭션으로 처리해주세요"

매개변수:
- operations: 트랜잭션 작업 배열 (필수)
- maxAttempts: 최대 재시도 횟수 (선택적)
```

## 💡 사용 팁

1. **컬렉션 경로**: 슬래시(/)로 구분된 경로를 사용하세요 (예: "users/user123/posts")
2. **WHERE 조건**: [필드명, 연산자, 값] 형태의 배열로 지정
3. **정렬 조건**: [필드명, 방향] 형태로 지정 ("asc" 또는 "desc")
4. **페이지네이션**: startAfter를 사용하여 커서 기반 페이지네이션 구현
5. **배치 작업**: 최대 500개의 작업까지 한 번에 처리 가능

## 🔗 관련 명령어

- `FB auth` - 사용자 인증 관리
- `FB storage` - 파일 저장소 연동
- `FB functions` - 클라우드 함수 트리거
- `FB analytics` - 사용자 행동 분석