# Firebase MCP Server - 디자인 가이드

## 🎨 디자인 시스템

### 디자인 철학
Firebase 콘솔의 깔끔하고 전문적인 인터페이스를 모티브로 하여, 개발자 친화적이고 직관적인 웹 대시보드를 제공합니다.

## 🎯 사용자 인터페이스 요구사항

### 주요 대상 사용자
- **개발자**: Firebase를 사용하는 프론트엔드/백엔드 개발자
- **DevOps 엔지니어**: Firebase 프로젝트 관리 담당자
- **AI 어시스턴트 사용자**: Claude, Cursor 등을 통해 Firebase 작업을 수행하는 사용자

### 사용 시나리오
1. **MCP 서버 상태 모니터링**: 서버 상태, 연결된 클라이언트 확인
2. **Firebase 프로젝트 관리**: 프로젝트 선택, 설정 변경
3. **실시간 로그 확인**: MCP 요청/응답 로그 모니터링
4. **서비스 상태 확인**: 각 Firebase 서비스의 연결 상태 확인

## 🎨 비주얼 디자인

### 컬러 팔레트

#### Primary Colors (Firebase 브랜딩 기반)
```css
:root {
  /* Firebase Orange */
  --primary-orange: #FF6F00;
  --primary-orange-light: #FF8F00;
  --primary-orange-dark: #E65100;
  
  /* Firebase Blue */
  --primary-blue: #039BE5;
  --primary-blue-light: #03A9F4;
  --primary-blue-dark: #0277BD;
  
  /* Firebase Yellow */
  --accent-yellow: #FBC02D;
  --accent-yellow-light: #FDD835;
  --accent-yellow-dark: #F57F17;
}
```

#### Neutral Colors
```css
:root {
  /* Light Theme */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8F9FA;
  --bg-tertiary: #F1F3F4;
  
  --text-primary: #202124;
  --text-secondary: #5F6368;
  --text-tertiary: #80868B;
  
  --border-light: #E8EAED;
  --border-medium: #DADCE0;
  
  /* Dark Theme */
  --dark-bg-primary: #1A1A1A;
  --dark-bg-secondary: #2D2D2D;
  --dark-bg-tertiary: #3C3C3C;
  
  --dark-text-primary: #E8EAED;
  --dark-text-secondary: #9AA0A6;
  --dark-text-tertiary: #5F6368;
  
  --dark-border-light: #3C4043;
  --dark-border-medium: #5F6368;
}
```

#### Status Colors
```css
:root {
  /* Success */
  --success: #137333;
  --success-light: #34A853;
  --success-bg: #E6F4EA;
  
  /* Warning */
  --warning: #EA8600;
  --warning-light: #FBBC04;
  --warning-bg: #FEF7E0;
  
  /* Error */
  --error: #D93025;
  --error-light: #EA4335;
  --error-bg: #FCE8E6;
  
  /* Info */
  --info: #1A73E8;
  --info-light: #4285F4;
  --info-bg: #E8F0FE;
}
```

### 타이포그래피

#### Font Family
```css
:root {
  --font-primary: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Roboto Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Ubuntu Mono', monospace;
}
```

#### Font Sizes
```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}
```

### 스페이싱 시스템
```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

## 🧩 컴포넌트 라이브러리

### 1. Navigation Bar
```tsx
interface NavbarProps {
  title: string;
  user?: User;
  onThemeToggle: () => void;
  theme: 'light' | 'dark';
}

// 디자인 특징:
// - Firebase 로고와 함께 서비스 이름
// - 테마 토글 버튼
// - 사용자 정보 (옵션)
// - 글로벌 검색 (향후 확장)
```

### 2. Sidebar Navigation
```tsx
interface SidebarProps {
  items: NavigationItem[];
  activeItem: string;
  collapsed?: boolean;
  onToggle: () => void;
}

// 디자인 특징:
// - Firebase 서비스별 아이콘
// - 접기/펼치기 기능
// - 활성 상태 하이라이트
// - 중첩 메뉴 지원
```

### 3. Status Card
```tsx
interface StatusCardProps {
  title: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

// 디자인 특징:
// - 상태에 따른 색상 변화
// - 실시간 업데이트 애니메이션
// - 클릭 가능한 상호작용
// - 아이콘과 텍스트 조합
```

### 4. Data Table
```tsx
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

// 디자인 특징:
// - Firebase 콘솔 스타일 테이블
// - 정렬, 필터링, 페이지네이션
// - 로딩 스켈레톤
// - 반응형 디자인
```

### 5. Log Viewer
```tsx
interface LogViewerProps {
  logs: LogEntry[];
  realtime?: boolean;
  filter?: LogFilter;
  onFilterChange: (filter: LogFilter) => void;
}

// 디자인 특징:
// - 실시간 로그 스트리밍
// - 로그 레벨별 색상 구분
// - 검색 및 필터링
// - 자동 스크롤
```

## 📱 레이아웃 구조

### Desktop Layout (1024px+)
```
┌─────────────────────────────────────────────────────────┐
│                    Navigation Bar                        │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   Sidebar    │              Main Content                │
│              │                                          │
│   - 대시보드   │  ┌─────────────────────────────────────┐  │
│   - Auth     │  │          Status Cards              │  │
│   - Firestore│  └─────────────────────────────────────┘  │
│   - Storage  │  ┌─────────────────────────────────────┐  │
│   - Functions│  │         Data Tables/Logs           │  │
│   - 설정      │  └─────────────────────────────────────┘  │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### Tablet Layout (768px - 1023px)
```
┌─────────────────────────────────────────────────────────┐
│                Navigation Bar                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  Main Content                           │
│  (사이드바는 햄버거 메뉴로 변경)                           │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Status Cards                        │ │
│  └─────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Data Tables/Logs                     │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout (320px - 767px)
```
┌─────────────────────────────────────┐
│          Navigation Bar             │
├─────────────────────────────────────┤
│                                     │
│           Main Content              │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │        Status Cards            │ │
│  │      (스택형 레이아웃)           │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │    Simplified Tables/Lists     │ │
│  └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

## 🎯 주요 페이지 디자인

### 1. Dashboard (대시보드)
**목적**: MCP 서버 전체 상태 한눈에 보기

**구성 요소**:
- **서버 상태 카드**: 온라인/오프라인, 업타임, 메모리 사용량
- **연결된 클라이언트**: Claude Code, Cursor 등 활성 연결
- **Firebase 프로젝트 선택**: 드롭다운으로 프로젝트 전환
- **최근 활동**: 최근 MCP 요청 목록
- **성능 차트**: 응답 시간, 요청 수 그래프

### 2. Authentication (인증 관리)
**목적**: Firebase Authentication 사용자 관리

**구성 요소**:
- **사용자 목록 테이블**: 이메일, 가입일, 상태
- **사용자 추가 버튼**: 모달 팝업으로 사용자 생성
- **필터 및 검색**: 이메일, 상태별 필터링
- **사용자 상세 정보**: 사이드 패널로 표시

### 3. Firestore (데이터베이스)
**목적**: Firestore 컬렉션 및 문서 탐색

**구성 요소**:
- **컬렉션 트리**: 좌측 사이드바에 계층 구조
- **문서 목록**: 선택된 컬렉션의 문서들
- **문서 편집기**: JSON 에디터로 문서 내용 편집
- **실시간 업데이트**: 데이터 변경 시 자동 새로고침

### 4. Storage (저장소)
**목적**: Firebase Storage 파일 관리

**구성 요소**:
- **파일 탐색기**: 폴더 구조 네비게이션
- **파일 목록**: 이름, 크기, 수정일 표시
- **업로드 영역**: 드래그 앤 드롭 업로드
- **미리보기**: 이미지 파일 썸네일

### 5. Functions (함수 관리)
**목적**: Firebase Functions 모니터링

**구성 요소**:
- **함수 목록**: 이름, 상태, 마지막 실행 시간
- **로그 뷰어**: 함수 실행 로그 실시간 확인
- **성능 메트릭**: 실행 시간, 오류율 차트
- **배포 상태**: 함수 배포 진행 상황

### 6. Logs (로그)
**목적**: MCP 서버 로그 모니터링

**구성 요소**:
- **실시간 로그 스트림**: WebSocket으로 실시간 업데이트
- **로그 레벨 필터**: Debug, Info, Warning, Error
- **검색 기능**: 키워드로 로그 검색
- **시간 범위 선택**: 특정 시간대 로그 확인

## 🎨 UI 컴포넌트 스타일 가이드

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-blue-dark);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--primary-blue);
  border: 1px solid var(--primary-blue);
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
}

/* Danger Button */
.btn-danger {
  background: var(--error);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
}
```

### Cards
```css
.card {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  border-bottom: 1px solid var(--border-light);
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-4);
}
```

### Status Indicators
```css
.status-online {
  color: var(--success);
  background: var(--success-bg);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--text-sm);
  font-weight: 500;
}

.status-offline {
  color: var(--error);
  background: var(--error-bg);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--text-sm);
  font-weight: 500;
}

.status-warning {
  color: var(--warning);
  background: var(--warning-bg);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--text-sm);
  font-weight: 500;
}
```

## 🌓 다크 테마 지원

### 테마 전환 로직
```typescript
interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  autoDetect: boolean; // 시스템 설정 따르기
  persistence: boolean; // 사용자 선택 저장
}

// CSS Custom Properties를 통한 동적 테마 변경
const toggleTheme = (theme: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};
```

### 다크 테마 색상 매핑
```css
[data-theme="dark"] {
  --bg-primary: var(--dark-bg-primary);
  --bg-secondary: var(--dark-bg-secondary);
  --bg-tertiary: var(--dark-bg-tertiary);
  
  --text-primary: var(--dark-text-primary);
  --text-secondary: var(--dark-text-secondary);
  --text-tertiary: var(--dark-text-tertiary);
  
  --border-light: var(--dark-border-light);
  --border-medium: var(--dark-border-medium);
}
```

## 📐 반응형 디자인 원칙

### Breakpoints
```css
:root {
  --bp-mobile: 320px;
  --bp-tablet: 768px;
  --bp-desktop: 1024px;
  --bp-wide: 1440px;
}

/* Mobile First 접근 */
@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}

@media (min-width: 1440px) {
  /* Wide screen styles */
}
```

### 반응형 그리드
```css
.grid {
  display: grid;
  gap: var(--space-4);
  
  /* Mobile: 1 column */
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    /* Tablet: 2 columns */
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    /* Desktop: 3-4 columns */
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}
```

## 🎭 애니메이션 및 트랜지션

### 기본 트랜지션
```css
:root {
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}

/* 공통 트랜지션 */
.transition {
  transition: all var(--transition-normal);
}

/* 호버 효과 */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### 로딩 애니메이션
```css
.loading-spinner {
  border: 2px solid var(--border-light);
  border-top: 2px solid var(--primary-blue);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## 📱 접근성 (Accessibility)

### ARIA 지원
```tsx
// 적절한 ARIA 레이블 사용
<button 
  aria-label="Toggle dark mode"
  aria-pressed={isDarkMode}
  role="switch"
>
  {isDarkMode ? '🌙' : '☀️'}
</button>

// 스크린 리더를 위한 설명
<div 
  role="status" 
  aria-live="polite"
  aria-label="Server status"
>
  Server is {status}
</div>
```

### 키보드 내비게이션
```css
/* 포커스 인디케이터 */
.focusable:focus {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* 탭 인덱스 관리 */
.tab-navigation {
  display: flex;
  role: tablist;
}

.tab-item {
  role: tab;
  cursor: pointer;
  padding: var(--space-3) var(--space-4);
}

.tab-item[aria-selected="true"] {
  background: var(--primary-blue);
  color: white;
}
```

### 색상 대비
```css
/* WCAG AA 기준 준수 (4.5:1 대비율) */
:root {
  --text-high-contrast: #000000; /* 21:1 대비율 */
  --text-medium-contrast: #424242; /* 12.6:1 대비율 */
  --text-low-contrast: #757575; /* 4.5:1 대비율 */
}
```

---

**문서 버전**: 1.0  
**최종 수정**: 2025-08-03  
**작성자**: AI Assistant