# institution-ui 프로젝트 정보

**문서 버전:** 1.0
**작성일:** 2026-04-15

## 1. 개요

**institution-ui**는 연구기관 관리 REST API (Spring Boot 3.x / Java 17)의 프론트엔드 웹 클라이언트이다. 내부 사용자(USER/ADMIN)가 연구기관·기관 유형 정보를 브라우저를 통해 관리한다.

## 2. 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.2.1 |
| UI 라이브러리 | React | 19.2.4 |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS | 4.x |
| 단위 테스트 | Jest + React Testing Library | 30.x / 16.x |
| 통합 테스트 | Playwright | 1.59.x |
| Lint | ESLint + eslint-config-next | 9.x |
| 폰트 | Geist Sans, Geist Mono | — |
| 패키지 관리 | npm | — |

## 3. 프로젝트 구조

```
institution-ui/
├── app/                           # Next.js App Router (라우팅·페이지)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── institutions/
│   │   ├── page.tsx               # 목록
│   │   ├── new/page.tsx           # 등록 (ADMIN)
│   │   └── [id]/
│   │       ├── page.tsx           # 상세
│   │       └── edit/page.tsx      # 수정 (ADMIN)
│   └── institution-types/
│       ├── page.tsx
│       ├── new/page.tsx
│       └── [id]/
│           ├── page.tsx
│           └── edit/page.tsx
├── components/                    # 재사용 컴포넌트
│   ├── NavBar.tsx
│   ├── Alert.tsx
│   ├── ConfirmModal.tsx
│   ├── InstitutionForm.tsx
│   ├── InstitutionTypeForm.tsx
│   └── RoleBadge.tsx
├── lib/                           # 유틸·타입·API
│   ├── api.ts                     # fetch 래퍼
│   ├── types.ts                   # TypeScript 타입
│   ├── auth.ts                    # 인증 유틸
│   └── csrf.ts                    # CSRF 쿠키 파싱
├── __tests__/                     # 단위 테스트
├── e2e/                           # Playwright 시나리오
├── public/                        # 정적 자산
├── docs-ui/                       # 문서 (본 문서 포함)
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── jest.config.ts
├── jest.setup.ts
├── playwright.config.ts
├── package.json
└── package-lock.json
```

## 4. 스크립트

```bash
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run lint         # ESLint
npm test             # 단위 테스트 (Jest)
npm test -- --coverage   # 커버리지 포함
npx playwright test  # 통합 테스트
```

## 5. 환경 변수

`.env.local` (로컬 개발용):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

- `NEXT_PUBLIC_API_BASE_URL`: 백엔드 API 베이스 URL. `lib/api.ts`에서 참조.

## 6. 백엔드 API 통합

### 6.1 기본 설정

| 항목 | 값 |
|------|-----|
| 프로토콜 | HTTP(S) |
| 인증 | 세션 (JSESSIONID 쿠키) |
| CSRF | `XSRF-TOKEN` 쿠키 ↔ `X-XSRF-TOKEN` 헤더 |
| fetch 옵션 | `credentials: "include"` 필수 |
| Content-Type | `application/json` |

### 6.2 인증 엔드포인트

| Method | Endpoint | 권한 | 설명 |
|--------|----------|------|------|
| POST | `/api/auth/signup` | Public | 회원가입 |
| POST | `/api/auth/login` | Public | 로그인 (JSESSIONID 발급) |
| POST | `/api/auth/logout` | Auth | 로그아웃 |
| GET | `/api/auth/status` | Auth | 세션 상태 확인 |

### 6.3 기관 엔드포인트

| Method | Endpoint | 권한 | 설명 |
|--------|----------|------|------|
| GET | `/api/institutions` | USER, ADMIN | 활성 기관 목록 |
| GET | `/api/institutions/{id}` | USER, ADMIN | 기관 상세 |
| POST | `/api/institutions` | ADMIN | 기관 등록 |
| PUT | `/api/institutions/{id}` | ADMIN | 기관 수정 (전체) |
| DELETE | `/api/institutions/{id}` | ADMIN | Soft Delete (body: `{code, name}`) |

### 6.4 기관 유형 엔드포인트

| Method | Endpoint | 권한 | 설명 |
|--------|----------|------|------|
| GET | `/api/institution-types` | USER, ADMIN | 활성 유형 목록 |
| GET | `/api/institution-types/{id}` | USER, ADMIN | 유형 상세 |
| POST | `/api/institution-types` | ADMIN | 유형 등록 |
| PUT | `/api/institution-types/{id}` | ADMIN | 유형 수정 |
| DELETE | `/api/institution-types/{id}` | ADMIN | 유형 비활성화 (active=false) |

### 6.5 응답 포맷

```json
{
  "status": 200,
  "message": "조회 성공",
  "data": { }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| status | number | HTTP 상태 코드 |
| message | string | 결과 메시지 (한국어) |
| data | object / array / null | 응답 본문 |

### 6.6 에러 코드

| Code | HTTP | 메시지 |
|------|------|--------|
| VALIDATION_ERROR | 400 | 입력값이 유효하지 않습니다 |
| INSTITUTION_TYPE_INACTIVE | 400 | 비활성화된 기관 유형은 사용할 수 없습니다 |
| UNAUTHORIZED | 401 | 인증이 필요합니다 |
| INVALID_CREDENTIALS | 401 | 자격 증명이 올바르지 않습니다 |
| ACCESS_DENIED | 403 | 접근 권한이 없습니다 |
| INSTITUTION_NOT_FOUND | 404 | 기관을 찾을 수 없습니다 |
| INSTITUTION_TYPE_NOT_FOUND | 404 | 기관 유형을 찾을 수 없습니다 |
| DUPLICATE_USERNAME | 409 | 이미 사용 중인 사용자명입니다 |
| DUPLICATE_INSTITUTION_CODE | 409 | 이미 사용 중인 기관 코드입니다 |
| DUPLICATE_INSTITUTION_TYPE_CODE | 409 | 이미 사용 중인 유형 코드입니다 |
| DELETE_MISMATCH | 409 | 삭제 확인 정보가 일치하지 않습니다 |
| INTERNAL_SERVER_ERROR | 500 | 서버 오류가 발생했습니다 |

## 7. 사용자 역할 & UI 동작

| 역할 | 기관 조회 | 기관 등록/수정/삭제 | 유형 조회 | 유형 관리 | NavBar |
|------|-----------|---------------------|-----------|-----------|--------|
| Anonymous | 차단 (로그인 리다이렉트) | 차단 | 차단 | 차단 | 비표시 |
| USER | ✓ | ✗ (버튼 숨김) | ✓ | ✗ | 표시 |
| ADMIN | ✓ | ✓ | ✓ | ✓ | 표시 |

## 8. 구현 페이지

| 경로 | 페이지 | 접근 | API |
|------|--------|------|-----|
| `/login` | 로그인 | Public | `POST /api/auth/login` |
| `/signup` | 회원가입 | Public | `POST /api/auth/signup` |
| `/` | 홈 (리다이렉트) | — | — |
| `/institutions` | 기관 목록 | Auth | `GET /api/institutions` |
| `/institutions/[id]` | 기관 상세 | Auth | `GET /api/institutions/{id}` |
| `/institutions/new` | 기관 등록 | ADMIN | `POST /api/institutions` |
| `/institutions/[id]/edit` | 기관 수정 | ADMIN | `PUT /api/institutions/{id}` |
| `/institution-types` | 유형 목록 | Auth | `GET /api/institution-types` |
| `/institution-types/[id]` | 유형 상세 | Auth | `GET /api/institution-types/{id}` |
| `/institution-types/new` | 유형 등록 | ADMIN | `POST /api/institution-types` |
| `/institution-types/[id]/edit` | 유형 수정 | ADMIN | `PUT /api/institution-types/{id}` |

## 9. 데이터 모델

### 9.1 User

```typescript
type Role = "USER" | "ADMIN";

interface User {
  id: number;
  username: string;
  role: Role;
  createdAt: string;
}

interface AuthStatus {
  authenticated: boolean;
  username: string | null;
  role: Role | null;
}
```

### 9.2 Institution

```typescript
interface InstitutionType {
  id: number;
  code: string;
  name: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Institution {
  id: number;
  name: string;
  code: string;
  institutionType: InstitutionType;
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  representative: string | null;
  establishedDate: string | null;  // YYYY-MM-DD
  createdAt: string;               // ISO 8601
  updatedAt: string;
}
```

### 9.3 요청 DTO

```typescript
interface SignupRequest { username: string; password: string; role: Role; }
interface LoginRequest { username: string; password: string; }

interface InstitutionRequest {
  name: string;
  code: string;
  institutionTypeId: number;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  representative?: string;
  establishedDate?: string;
}

interface DeleteInstitutionRequest { code: string; name: string; }

interface InstitutionTypeRequest {
  code: string;
  name: string;
  description?: string;
  sortOrder?: number;
}
```

## 10. 폼 검증 규칙

| 필드 | 규칙 |
|------|------|
| username | 필수, 4-50자, 고유 |
| password | 필수, 최소 8자 |
| role | 필수, USER/ADMIN |
| 기관.name | 필수, 최대 200자 |
| 기관.code | 필수, 최대 50자, `^[A-Z0-9_-]+$` |
| 기관.institutionTypeId | 필수 (활성 유형만) |
| 기관.address | 필수, 최대 500자 |
| 기관.phone | 선택, 최대 30자 |
| 기관.email | 선택, 이메일 형식, 최대 100자 |
| 기관.website | 선택, URL, 최대 500자 |
| 기관.representative | 선택, 최대 100자 |
| 기관.establishedDate | 선택, YYYY-MM-DD |
| 유형.code | 필수, 최대 50자, `^[A-Z0-9_]+$` |
| 유형.name | 필수, 최대 100자 |
| 유형.description | 선택, 최대 255자 |
| 유형.sortOrder | 선택, ≥0 |

## 11. 테스트 계정

| username | password | role |
|----------|----------|------|
| admin | admin1234 | ADMIN |
| user01 | user1234 | USER |

## 12. 사용자 흐름

```
┌──────────────────────────────────────────────────────────┐
│  Anonymous                                                │
│     │                                                     │
│     ├──> /signup ──> /login                               │
│     └──> /login                                           │
│             │                                             │
│             ▼                                             │
│        /institutions  ───┐                                │
│             │             │                               │
│             ├──> 행 클릭 ──> /institutions/[id]           │
│             │                      │                      │
│             │                      ├──> (ADMIN) /edit     │
│             │                      ├──> (ADMIN) 삭제 모달 │
│             │                      └──> 목록으로          │
│             │                                             │
│             ├──> (ADMIN) /new                             │
│             │                                             │
│             └──> /institution-types (동일 패턴)           │
│                                                           │
│        Logout ──> /login                                  │
└──────────────────────────────────────────────────────────┘
```

## 13. 현재 상태

| 항목 | 상태 |
|------|------|
| 문서화 (Phase 1) | 진행 중 → 완료 예정 |
| 프로젝트 스캐폴드 (Phase 2) | 대기 |
| 구현 (Phase 3-6) | 대기 |
| 테스트 (Phase 7) | 대기 |

## 14. 관련 문서

| 문서 | 위치 |
|------|------|
| 프로젝트 제안서 | `docs-ui/project-proposal-ui.md` |
| SRS | `docs-ui/SRS-ui.md` |
| SOW | `docs-ui/SOW-ui.md` |
| 기능 명세 | `docs-ui/functional-specification-ui.md` |
| UI 디자인 | `docs-ui/ui-design-plan.md` |
| WBS | `docs-ui/WBS-ui.md` |
| 백엔드 API 레퍼런스 | `../institution/docs/02-설계/API-reference.md` |
| 백엔드 기능 명세 | `../institution/docs/02-설계/functional-specification.md` |
| 백엔드 DB 스키마 | `../institution/docs/02-설계/database-schema.md` |