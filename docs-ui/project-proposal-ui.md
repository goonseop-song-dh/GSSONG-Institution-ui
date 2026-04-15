# 프로젝트 제안서: 연구기관 관리 UI (institution-ui)

**문서 버전:** 1.0
**작성일:** 2026-04-15

## 1. 프로젝트 요약

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 연구기관 관리 시스템 프론트엔드 (institution-ui) |
| 유형 | 프론트엔드 웹 애플리케이션 |
| 프레임워크 | Next.js 16.2.1 (App Router) |
| 언어 | TypeScript 5.x |
| UI 라이브러리 | React 19.2.4 |
| 스타일링 | Tailwind CSS 4.x |
| 대상 사용자 | 내부 직원 (일반 사용자, 관리자) |
| 목적 | 연구기관 관리 REST API (Spring Boot 3.x / Java 17)의 웹 클라이언트 |

## 2. 배경 및 목표

### 2.1 배경

연구기관 관리 REST API는 대학·정부출연연구소·기업부설연구소 등 연구기관 정보를 중앙 관리할 목적으로 설계되었다. Soft Delete, 역할 기반 접근 제어(USER/ADMIN), 세션 기반 인증(JSESSIONID), InstitutionType Master 관리, CSRF 보호 등 실무 운영에 필요한 기능을 포함한다. 해당 API를 실제 업무 담당자가 사용하려면 브라우저 기반 UI가 필요하다.

### 2.2 목표

- 연구기관 레코드를 관리할 수 있는 명확하고 전문적인 웹 UI 제공
- 역할 기반 UI 제어 (USER: 조회만, ADMIN: 전체 CRUD)
- 세션 기반 인증 흐름 처리 (로그인, 회원가입, 로그아웃)
- CSRF 토큰 자동 처리 (`X-XSRF-TOKEN`)
- 백엔드 규칙과 일치하는 클라이언트 사이드 검증
- 데스크톱·모바일 반응형 지원

## 3. 기술 스택

| 분류 | 기술 | 선택 이유 |
|------|------|-----------|
| 프레임워크 | Next.js 16.2.1 (App Router) | 서버/클라이언트 컴포넌트 분리, 파일 기반 라우팅 |
| UI 라이브러리 | React 19.2.4 | 최신 안정 React |
| 언어 | TypeScript 5.x | 타입 안전성, API 응답 계약 명시 |
| 스타일링 | Tailwind CSS 4.x | 유틸리티 우선 CSS, 빠른 UI 개발 |
| 폰트 | Geist Sans, Geist Mono | 깔끔한 엔터프라이즈 타이포그래피 |
| 테스트 (단위) | Jest + React Testing Library | 컴포넌트 단위 테스트 |
| 테스트 (통합) | Playwright | E2E 시나리오 검증 |
| Lint | ESLint 9.x + eslint-config-next | 코드 품질 |
| 패키지 관리 | npm | 의존성 관리 |

## 4. 기능 요구사항

### 4.1 인증

| ID | 기능 | 설명 |
|----|------|------|
| UI-AUTH-01 | 로그인 페이지 | username/password 폼. `POST /api/auth/login` 호출. 성공 시 `/institutions`로 이동. |
| UI-AUTH-02 | 회원가입 페이지 | username, password, role 입력. `POST /api/auth/signup` 호출. 성공 시 로그인 페이지로 이동. |
| UI-AUTH-03 | 로그아웃 | 상단 네비게이션 바 버튼. `POST /api/auth/logout` 호출 후 로그인으로 이동. |
| UI-AUTH-04 | 라우트 보호 | 미인증 사용자는 모든 보호 경로에서 `/login`으로 리다이렉트. |
| UI-AUTH-05 | CSRF 토큰 처리 | 변경 요청 시 `XSRF-TOKEN` 쿠키를 읽어 `X-XSRF-TOKEN` 헤더로 전송. |

### 4.2 기관 관리

| ID | 기능 | 설명 |
|----|------|------|
| UI-INST-01 | 기관 목록 | 활성 기관 테이블 (기관명, 코드, 유형, 대표자, 설립일). 행 클릭 시 상세 이동. |
| UI-INST-02 | 기관 상세 | 전체 필드 라벨-값 레이아웃. 타임스탬프 포함. |
| UI-INST-03 | 기관 등록 | 신규 기관 등록 폼 (ADMIN). InstitutionType은 활성 유형 드롭다운. |
| UI-INST-04 | 기관 수정 | 사전 채워진 수정 폼 (ADMIN). 전체 필드 교체(PUT). |
| UI-INST-05 | 기관 삭제 | 확인 모달에서 code + name 재입력 확인 후 Soft Delete (ADMIN). |

### 4.3 기관 유형 (InstitutionType) 관리

| ID | 기능 | 설명 |
|----|------|------|
| UI-TYPE-01 | 유형 목록 | 활성 유형 목록 표시 (USER/ADMIN). |
| UI-TYPE-02 | 유형 상세 | 개별 유형 상세 조회. |
| UI-TYPE-03 | 유형 등록 | 신규 유형 생성 (ADMIN). |
| UI-TYPE-04 | 유형 수정 | 기존 유형 수정 (ADMIN). |
| UI-TYPE-05 | 유형 비활성화 | 유형을 `active=false`로 전환. 물리 삭제 금지 (ADMIN). |

### 4.4 역할 기반 UI 제어

| 역할 | 기관 조회 | 기관 등록/수정/삭제 | 유형 조회 | 유형 관리 | 네비게이션 |
|------|-----------|---------------------|-----------|-----------|------------|
| Anonymous | 로그인으로 리다이렉트 | 로그인으로 리다이렉트 | 로그인으로 리다이렉트 | 로그인으로 리다이렉트 | 비표시 |
| USER | 가능 | 버튼 숨김 | 가능 | 버튼 숨김 | 표시 |
| ADMIN | 가능 | 가능 | 가능 | 가능 | 표시 |

## 5. 페이지 및 라우트

| 경로 | 페이지 | 접근 | 호출 API |
|------|--------|------|----------|
| `/login` | 로그인 | Public | `POST /api/auth/login` |
| `/signup` | 회원가입 | Public | `POST /api/auth/signup` |
| `/institutions` | 기관 목록 | Authenticated | `GET /api/institutions` |
| `/institutions/[id]` | 기관 상세 | Authenticated | `GET /api/institutions/{id}` |
| `/institutions/new` | 기관 등록 | ADMIN | `POST /api/institutions` |
| `/institutions/[id]/edit` | 기관 수정 | ADMIN | `PUT /api/institutions/{id}` |
| `/institution-types` | 유형 목록 | Authenticated | `GET /api/institution-types` |
| `/institution-types/[id]` | 유형 상세 | Authenticated | `GET /api/institution-types/{id}` |
| `/institution-types/new` | 유형 등록 | ADMIN | `POST /api/institution-types` |
| `/institution-types/[id]/edit` | 유형 수정 | ADMIN | `PUT /api/institution-types/{id}` |

### 5.1 사용자 흐름

```
Anonymous → Login → 기관 목록 → 행 클릭 → 기관 상세
                                → (ADMIN) 등록 → 제출 → 목록
                                → (ADMIN) 수정 → 제출 → 상세
                                → (ADMIN) 삭제 → code+name 확인 → 목록
                 → Logout → Login

         Sign Up → Login
```

## 6. UI 디자인 원칙

| 원칙 | 내용 |
|------|------|
| 톤 | 전문적, 신뢰감, 차분함 — 엔터프라이즈 대시보드 스타일 |
| 색상 | Primary Blue (`#2563EB`), 뉴트럴 그레이, 시맨틱 Red/Green/Amber |
| 그라데이션 | 없음. 플랫 단색만. AI 감성 지양. |
| 깊이감 | 미묘한 박스 그림자와 보더로 표현 |
| 레이아웃 | 상단 고정 네비게이션 + 중앙 정렬 컨텐츠 (`max-w-5xl`) |
| 타이포그래피 | Geist Sans (기본), Geist Mono (타임스탬프) |
| 반응형 | 모바일 우선. 640px 이하 스택, 1024px 이상 전체 레이아웃. |
| 다크 모드 | 범위 외 |

> 상세 디자인 명세: `docs-ui/ui-design-plan.md`

## 7. 데이터 모델

### 7.1 User

| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 사용자 식별자 |
| username | string | 로그인 ID |
| role | "USER" \| "ADMIN" | 역할 |
| createdAt | string | 계정 생성 시각 |

### 7.2 Institution

| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 기관 식별자 |
| name | string | 기관명 (최대 200자) |
| code | string | 기관 코드 (최대 50자, `^[A-Z0-9_-]+$`) |
| institutionType | InstitutionType | 기관 유형 (FK) |
| address | string | 주소 (최대 500자) |
| phone | string \| null | 대표 전화 (최대 30자) |
| email | string \| null | 대표 이메일 (최대 100자) |
| website | string \| null | 홈페이지 URL (최대 500자) |
| representative | string \| null | 대표자 (최대 100자) |
| establishedDate | string \| null | 설립일 (YYYY-MM-DD) |
| createdAt | string | 생성 시각 |
| updatedAt | string | 수정 시각 |

### 7.3 InstitutionType

| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 유형 식별자 |
| code | string | 유형 코드 (최대 50자, `^[A-Z0-9_]+$`) |
| name | string | 유형 명칭 (최대 100자) |
| description | string \| null | 설명 (최대 255자) |
| sortOrder | number | 정렬 순서 |
| active | boolean | 사용 여부 |
| createdAt | string | 생성 시각 |
| updatedAt | string | 수정 시각 |

### 7.4 폼 검증 규칙 요약

| 필드 | 규칙 |
|------|------|
| username | 필수, 4-50자, 고유 |
| password | 필수, 최소 8자 |
| role | 필수, `USER` 또는 `ADMIN` |
| 기관.name | 필수, 최대 200자 |
| 기관.code | 필수, 최대 50자, `^[A-Z0-9_-]+$`, 활성 기관 내 고유 |
| 기관.institutionTypeId | 필수, 활성 유형만 가능 |
| 기관.address | 필수, 최대 500자 |
| 기관.email | 선택, 이메일 형식, 최대 100자 |
| 기관.website | 선택, URL 형식, 최대 500자 |
| 유형.code | 필수, 최대 50자, `^[A-Z0-9_]+$`, 고유 |
| 유형.name | 필수, 최대 100자 |

## 8. 백엔드 API 통합

### 8.1 인증

JSESSIONID 쿠키 기반 세션 인증. 로그인 이후 브라우저가 자동으로 쿠키 전송. `credentials: "include"` 필수.

```
POST /api/auth/signup    — 회원가입 (public)
POST /api/auth/login     — 로그인·세션 생성 (public)
POST /api/auth/logout    — 로그아웃·세션 무효화 (authenticated)
GET  /api/auth/status    — 현재 세션 상태 확인 (authenticated)
```

### 8.2 기관 CRUD

```
GET    /api/institutions         — 활성 기관 목록 (authenticated)
GET    /api/institutions/{id}    — 기관 상세 (authenticated)
POST   /api/institutions         — 기관 등록 (ADMIN)
PUT    /api/institutions/{id}    — 기관 수정 (ADMIN, 전체 필드)
DELETE /api/institutions/{id}    — 기관 Soft Delete (ADMIN, body에 code+name 필수)
```

### 8.3 기관 유형 CRUD

```
GET    /api/institution-types         — 활성 유형 목록 (authenticated)
GET    /api/institution-types/{id}    — 유형 상세 (authenticated)
POST   /api/institution-types         — 유형 등록 (ADMIN)
PUT    /api/institution-types/{id}    — 유형 수정 (ADMIN)
DELETE /api/institution-types/{id}    — 유형 비활성화 (ADMIN, active=false)
```

### 8.4 응답 형식

```json
{
  "status": 200,
  "message": "조회 성공",
  "data": { }
}
```

### 8.5 에러 처리

| HTTP | UI 동작 |
|------|---------|
| 400 | 폼 필드 인라인 검증 메시지 표시 |
| 401 | 로그인 페이지로 리다이렉트 |
| 403 | 기관 목록으로 리다이렉트 + "접근 권한이 없습니다" 알림 |
| 404 | "기관을 찾을 수 없습니다" 메시지 표시 |
| 409 | 중복/확인 불일치 필드에 에러 표시 |
| 500 | 범용 에러 알림 |

### 8.6 CSRF

- 서버가 `XSRF-TOKEN` 쿠키를 발급 (HttpOnly=false)
- 클라이언트는 POST/PUT/DELETE 요청 시 해당 값을 `X-XSRF-TOKEN` 헤더로 포함
- `lib/api.ts`에 공통 처리

## 9. 프로젝트 구조 (예정)

```
institution-ui/
├── app/
│   ├── layout.tsx                # Root layout (폰트, nav, 글로벌 스타일)
│   ├── page.tsx                  # /institutions 또는 /login으로 리다이렉트
│   ├── globals.css
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── institutions/
│   │   ├── page.tsx              # 목록
│   │   ├── new/page.tsx          # 등록 (ADMIN)
│   │   └── [id]/
│   │       ├── page.tsx          # 상세
│   │       └── edit/page.tsx     # 수정 (ADMIN)
│   └── institution-types/
│       ├── page.tsx
│       ├── new/page.tsx
│       └── [id]/
│           ├── page.tsx
│           └── edit/page.tsx
├── components/
│   ├── NavBar.tsx
│   ├── Alert.tsx
│   ├── ConfirmModal.tsx
│   ├── InstitutionForm.tsx
│   └── InstitutionTypeForm.tsx
├── lib/
│   ├── api.ts                    # fetch 래퍼 + CSRF 처리
│   └── types.ts
├── public/
├── docs-ui/
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── package.json
└── package-lock.json
```

## 10. 범위

### 10.1 In Scope

| 분류 | 항목 |
|------|------|
| 인증 UI | 로그인, 회원가입, 로그아웃, 라우트 보호, CSRF 처리 |
| 기관 CRUD UI | 목록, 상세, 등록, 수정, 삭제 확인 |
| 유형 CRUD UI | 목록, 상세, 등록, 수정, 비활성화 |
| 역할 기반 UI | role에 따라 ADMIN 버튼 표시/숨김 |
| 폼 검증 | 백엔드 규칙과 일치하는 클라이언트 검증 |
| 에러 처리 | API 에러 인라인·알림 표시 |
| 반응형 디자인 | 모바일/태블릿/데스크톱 |
| 단위 테스트 | 주요 컴포넌트 Jest + RTL |
| 통합 테스트 | 핵심 시나리오 Playwright |

### 10.2 Out of Scope

| 항목 | 사유 |
|------|------|
| 페이지네이션/검색/필터 | 백엔드 미지원 (향후 확장) |
| 다크 모드 | 초기 범위 외 |
| 다국어 (i18n) | 한국어 단일 언어 |
| 배포/CI-CD | 별도 인프라 작업 |
| 사용자 관리 UI | 회원가입으로 자가 가입, 관리자 콘솔 없음 |

## 11. 의존성

| # | 의존성 | 상세 |
|---|--------|------|
| 1 | 백엔드 API 가동 | 모든 데이터는 Spring Boot API에서 수급 |
| 2 | CORS 설정 | 백엔드가 프론트엔드 origin 허용 필요 |
| 3 | 세션 쿠키 | `JSESSIONID` SameSite 정책 정렬 |
| 4 | CSRF 쿠키 | `XSRF-TOKEN` HttpOnly=false로 발급 |

## 12. 위험 및 완화

| # | 위험 | 완화 방안 |
|---|------|-----------|
| 1 | 개발 중 백엔드 API 미가동 | Mock 데이터 또는 MSW 사용 |
| 2 | CORS 이슈 | Spring Security CORS 설정, 필요 시 Next.js rewrites 프록시 |
| 3 | 세션 쿠키 크로스 오리진 미전송 | `credentials: "include"` + SameSite 정책 확인 |
| 4 | CSRF 토큰 누락으로 403 | `lib/api.ts`에서 공통 주입, 쿠키 파싱 유틸 작성 |
| 5 | Next.js 16 학습 데이터 불일치 | 코드 작성 전 `node_modules/next/dist/docs/` 확인 |

## 13. 결과물

| ID | 결과물 | 설명 |
|----|--------|------|
| D-01 | 소스 코드 | 전체 Next.js 애플리케이션 소스 |
| D-02 | 로그인/회원가입 | 검증·에러 처리 포함 인증 페이지 |
| D-03 | 기관 목록 | 활성 기관 테이블 뷰 |
| D-04 | 기관 상세 | 전체 필드 상세 뷰 + 관리자 액션 |
| D-05 | 기관 등록/수정 폼 | 클라이언트 검증 포함 CRUD 폼 |
| D-06 | 기관 삭제 흐름 | 확인 모달 + Soft Delete |
| D-07 | 유형 CRUD 페이지 | InstitutionType Master 관리 |
| D-08 | 네비게이션/레이아웃 | 반응형 nav, role 뱃지, 레이아웃 셸 |
| D-09 | 단위 테스트 | Jest + RTL 테스트 스위트 |
| D-10 | 통합 테스트 | Playwright 시나리오 |
| D-11 | 문서 | `docs-ui/` 하위 전체 문서 |

### 13.1 기능 ID ↔ 결과물 매핑

| 기능 ID | 결과물 ID | 경로 |
|---------|-----------|------|
| UI-AUTH-01 | D-02 | `/login` |
| UI-AUTH-02 | D-02 | `/signup` |
| UI-AUTH-03 | D-02, D-08 | 네비게이션 로그아웃 |
| UI-AUTH-04 | D-01, D-02 | 라우트 보호 |
| UI-AUTH-05 | D-01 | CSRF (`lib/api.ts`) |
| UI-INST-01 | D-03 | `/institutions` |
| UI-INST-02 | D-04 | `/institutions/[id]` |
| UI-INST-03 | D-05 | `/institutions/new` |
| UI-INST-04 | D-05 | `/institutions/[id]/edit` |
| UI-INST-05 | D-06 | 삭제 모달 |
| UI-TYPE-01~05 | D-07 | `/institution-types/**` |

## 14. 관련 문서

| 문서 | 위치 | 설명 |
|------|------|------|
| 프로젝트 정보 | `docs-ui/institution_INFO-ui.md` | 프론트엔드 전체 개요 |
| UI 디자인 계획 | `docs-ui/ui-design-plan.md` | 색상·레이아웃·컴포넌트·와이어프레임 |
| 기능 명세 | `docs-ui/functional-specification-ui.md` | 화면별 동작 및 에러 처리 |
| SRS | `docs-ui/SRS-ui.md` | 요구사항 정의 |
| SOW | `docs-ui/SOW-ui.md` | 범위·결과물·승인 기준 |
| WBS | `docs-ui/WBS-ui.md` | 작업 분해 및 일정 |
| 백엔드 제안서 | `../institution/docs/01-기획/project-proposal.md` | |
| 백엔드 SRS | `../institution/docs/01-기획/SRS.md` | |
| 백엔드 API 레퍼런스 | `../institution/docs/02-설계/API-reference.md` | |
| 백엔드 기능 명세 | `../institution/docs/02-설계/functional-specification.md` | |