# Firebase Storage 명령어

💾 **Firebase Storage** - 클라우드 파일 저장소

## 📋 사용 가능한 도구

### 📤 **파일 업로드**

**`storage_upload_file`** - 파일 업로드
```
자연어 요청: "프로필 이미지를 업로드해주세요"

매개변수:
- filePath: 업로드할 로컬 파일 경로 (필수)
- destination: Storage 내 저장 경로 (필수)
- metadata: 파일 메타데이터 (선택적)
- makePublic: 공개 파일로 설정 여부 (선택적)
```

**`storage_upload_buffer`** - 버퍼 데이터 업로드
```
자연어 요청: "메모리의 이미지 데이터를 업로드해주세요"

매개변수:
- buffer: 업로드할 버퍼 데이터 (필수)
- destination: Storage 내 저장 경로 (필수)
- contentType: MIME 타입 (필수)
- metadata: 파일 메타데이터 (선택적)
```

### 📥 **파일 다운로드**

**`storage_download_file`** - 파일 다운로드
```
자연어 요청: "프로필 이미지를 다운로드해주세요"

매개변수:
- filePath: Storage 내 파일 경로 (필수)
- destination: 로컬 저장 경로 (선택적)
```

**`storage_get_download_url`** - 다운로드 URL 생성
```
자연어 요청: "이미지의 공개 URL을 생성해주세요"

매개변수:
- filePath: Storage 내 파일 경로 (필수)
- expiresIn: URL 만료 시간 (선택적, 기본값: 1시간)
```

**`storage_get_signed_url`** - 서명된 URL 생성
```
자연어 요청: "파일의 임시 접근 URL을 생성해주세요"

매개변수:
- filePath: Storage 내 파일 경로 (필수)
- action: 'read' | 'write' | 'delete' (필수)
- expiresIn: URL 만료 시간 (선택적)
```

### 📂 **파일 관리**

**`storage_list_files`** - 파일 목록 조회
```
자연어 요청: "images 폴더의 파일 목록을 보여주세요"

매개변수:
- prefix: 파일 경로 접두사 (선택적)
- delimiter: 구분자 (선택적, 기본값: '/')
- maxResults: 최대 결과 수 (선택적)
- pageToken: 페이지네이션 토큰 (선택적)
```

**`storage_get_metadata`** - 파일 메타데이터 조회
```
자연어 요청: "profile.jpg 파일의 메타데이터를 조회해주세요"

매개변수:
- filePath: Storage 내 파일 경로 (필수)
```

**`storage_update_metadata`** - 파일 메타데이터 업데이트
```
자연어 요청: "파일의 캐시 설정을 업데이트해주세요"

매개변수:
- filePath: Storage 내 파일 경로 (필수)
- metadata: 업데이트할 메타데이터 (필수)
```

**`storage_delete_file`** - 파일 삭제
```
자연어 요청: "old-image.jpg 파일을 삭제해주세요"

매개변수:
- filePath: Storage 내 파일 경로 (필수)
```

### 📋 **파일 정보**

**`storage_file_exists`** - 파일 존재 확인
```
자연어 요청: "profile.jpg 파일이 존재하는지 확인해주세요"

매개변수:
- filePath: Storage 내 파일 경로 (필수)
```

**`storage_get_file_size`** - 파일 크기 조회
```
자연어 요청: "video.mp4 파일의 크기를 알려주세요"

매개변수:
- filePath: Storage 내 파일 경로 (필수)
```

**`storage_copy_file`** - 파일 복사
```
자연어 요청: "이미지를 백업 폴더로 복사해주세요"

매개변수:
- sourcePath: 원본 파일 경로 (필수)
- destinationPath: 대상 파일 경로 (필수)
```

**`storage_move_file`** - 파일 이동
```
자연어 요청: "임시 파일을 정식 폴더로 이동해주세요"

매개변수:
- sourcePath: 원본 파일 경로 (필수)
- destinationPath: 대상 파일 경로 (필수)
```

### 🔐 **보안 및 권한**

**`storage_make_public`** - 파일 공개 설정
```
자연어 요청: "이미지를 누구나 접근 가능하게 설정해주세요"

매개변수:
- filePath: Storage 내 파일 경로 (필수)
```

**`storage_make_private`** - 파일 비공개 설정
```
자연어 요청: "문서를 비공개로 설정해주세요"

매개변수:
- filePath: Storage 내 파일 경로 (필수)
```

**`storage_set_cors`** - CORS 설정
```
자연어 요청: "버킷의 CORS 정책을 설정해주세요"

매개변수:
- corsConfiguration: CORS 설정 배열 (필수)
```

## 💡 사용 팁

1. **파일 경로**: 슬래시(/)로 구분된 경로를 사용하세요 (예: "images/profile/user123.jpg")
2. **메타데이터**: contentType, cacheControl, customMetadata 등을 설정 가능
3. **보안**: 파일 업로드 시 적절한 보안 규칙을 설정하세요
4. **최적화**: 대용량 파일은 청크 업로드를 고려하세요
5. **URL 만료**: 서명된 URL은 보안을 위해 적절한 만료 시간을 설정하세요

## 🔗 관련 명령어

- `FB auth` - 사용자별 파일 접근 권한
- `FB firestore` - 파일 메타데이터 저장
- `FB functions` - 파일 처리 자동화
- `FB analytics` - 파일 다운로드 추적