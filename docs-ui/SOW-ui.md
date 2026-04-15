# 작업 기술서 (SOW) — institution-ui

**문서 버전:** 1.0
**작성일:** 2026-04-15

## 1. 목적

본 SOW는 연구기관 관리 시스템 프론트엔드(institution-ui)의 작업 범위·결과물·기술 요구사항·승인 기준을 정의한다.

## 2. 프로젝트 목표

Spring Boot 백엔드(REST API)를 소비하는 Next.js 기반 웹 애플리케이션을 개발하여, 내부 사용자(USER/ADMIN)가 브라우저를 통해 연구기관 정보를 관리할 수 있도록 한다.

## 3. 작업 범위

### 3.1 In Scope

| # | 항목 | 비고 |
|---|------|------|
| 1 | Next.js 16 App Router 프로젝트 스캐폴딩 | TypeScript strict, Tailwind CSS 4 |
| 2 | 인증 UI (로그인, 회원가입, 로그아웃) | 세션 기반, CSRF 처리 포함 |
| 3 | 라우트 보호 및 role 기반 분기 | `/api/auth/status` 활용 |
| 4 | 기관 CRUD UI | 목록, 상세, 등록, 수정, 삭제(확인 모달) |
| 5 | 기관 유형 CRUD UI | Master 테이블 관리, 비활성화 |
| 6 | 폼 검증 | 백엔드 규칙 일치 |
| 7 | 에러 처리 및 알림 | 400·401·403·404·409·500 UI 분기 |
| 8 | 반응형 레이아웃 | 모바일/태블릿/데스크톱 |
| 9 | 단위 테스트 | Jest + RTL |
| 10 | 통합 테스트 | Playwright |
| 11 | 문서화 | `docs-ui/` 전체 |

### 3.2 Out of Scope

| 항목 | 사유 |
|------|------|
| 페이지네이션/검색/필터 | 백엔드 미지원 |
| 다크 모드 | 범위 외 |
| 다국어 | 한국어 단일 |
| 사용자 관리 콘솔 | 회원가입으로 자가 가입 |
| 배포 및 CI/CD | 별도 인프라 작업 |
| 백엔드 개발 | 별도 프로젝트 (institution) |

## 4. 결과물

| ID | 결과물 | 설명 |
|----|--------|------|
| D-01 | 프로젝트 스캐폴드 | Next.js 16 + TS + Tailwind 4 + ESLint + Jest + Playwright |
| D-02 | 루트 레이아웃 | 폰트, 전역 스타일, 네비게이션 바 |
| D-03 | 로그인 페이지 | `/login` |
| D-04 | 회원가입 페이지 | `/signup` |
| D-05 | 기관 목록 페이지 | `/institutions` |
| D-06 | 기관 상세 페이지 | `/institutions/[id]` |
| D-07 | 기관 등록 페이지 | `/institutions/new` (ADMIN) |
| D-08 | 기관 수정 페이지 | `/institutions/[id]/edit` (ADMIN) |
| D-09 | 기관 삭제 모달 | 확인 모달 컴포넌트 |
| D-10 | 유형 목록 페이지 | `/institution-types` |
| D-11 | 유형 상세 페이지 | `/institution-types/[id]` |
| D-12 | 유형 등록·수정 페이지 | `/institution-types/new`, `/institution-types/[id]/edit` (ADMIN) |
| D-13 | 공통 컴포넌트 | NavBar, Alert, ConfirmModal, Form 공용 |
| D-14 | API 클라이언트 | `lib/api.ts` (CSRF, credentials, 에러 처리) |
| D-15 | 타입 정의 | `lib/types.ts` |
| D-16 | 단위 테스트 | 주요 컴포넌트·유틸 테스트 |
| D-17 | 통합 테스트 | 엔드투엔드 시나리오 |
| D-18 | 문서 | `docs-ui/` 일체 |

### 4.1 소스 코드 구조

```
institution-ui/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── institutions/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── edit/page.tsx
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
│   ├── InstitutionTypeForm.tsx
│   └── RoleBadge.tsx
├── lib/
│   ├── api.ts
│   ├── types.ts
│   ├── auth.ts
│   └── csrf.ts
├── __tests__/
├── e2e/
├── public/
├── docs-ui/
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts (또는 postcss.config.mjs)
├── eslint.config.mjs
├── jest.config.ts
├── playwright.config.ts
├── package.json
└── package-lock.json
```

## 5. 작업 분해 구조 (요약)

상세 Phase·Task·시간: `docs-ui/WBS-ui.md`

| Phase | 목표 | 시간 |
|-------|------|------|
| P1 | 프로젝트 설정 & 인프라 | 2.0h |
| P2 | 레이아웃 & 네비게이션 | 1.5h |
| P3 | 인증 (로그인·회원가입·로그아웃·라우트 보호·CSRF) | 2.5h |
| P4 | 기관 목록 & 상세 | 2.5h |
| P5 | 기관 등록·수정·삭제 | 2.0h |
| P6 | 기관 유형 CRUD | 2.0h |
| P7 | 통합·테스트·문서 | 2.0h |

총 소요시간: 약 14.5h (2일 기준)

## 6. 기술 요구사항

### 6.1 기술 스택

| 항목 | 값 |
|------|-----|
| 프레임워크 | Next.js 16.2.1 (App Router) |
| UI | React 19.2.4 |
| 언어 | TypeScript 5.x |
| 스타일링 | Tailwind CSS 4.x |
| 테스트 (단위) | Jest + React Testing Library |
| 테스트 (통합) | Playwright |
| Lint | ESLint 9.x + eslint-config-next |
| 패키지 | npm |
| 폰트 | Geist Sans, Geist Mono |

### 6.2 코딩 표준

- App Router만 사용, Pages Router 금지
- Server Component 기본, `"use client"`는 인터랙션 필요 시만
- TypeScript strict, `any` 금지
- API 타입은 `lib/types.ts`에 중앙 정의
- `fetch` 호출은 `lib/api.ts` 래퍼 사용

### 6.3 디자인 표준

- 플랫 단색, 그라데이션 금지
- Primary: `#2563EB`
- 카드: `bg-white rounded-lg shadow-sm border border-gray-200 p-6`
- 버튼: `h-10 px-4 text-sm font-medium rounded-lg`
- 폼 입력: `border-gray-300 rounded-lg`

상세: `docs-ui/ui-design-plan.md`

## 7. 승인 기준

### 7.1 인증

- [ ] AC-01: `/login`에서 올바른 자격증명 → `/institutions`로 이동
- [ ] AC-02: 잘못된 자격증명 → "자격 증명이 올바르지 않습니다" 알림
- [ ] AC-03: `/signup`에서 새 계정 생성 → `/login`으로 이동
- [ ] AC-04: 중복 username → "이미 사용 중인 사용자명입니다"
- [ ] AC-05: 로그아웃 → `/login`으로 이동, 보호 경로 접근 차단
- [ ] AC-06: 미인증 상태로 보호 경로 접근 → `/login`으로 리다이렉트
- [ ] AC-07: POST/PUT/DELETE 요청에 `X-XSRF-TOKEN` 헤더 자동 포함

### 7.2 네비게이션

- [ ] AC-08: 로그인/회원가입 페이지에는 nav 비표시
- [ ] AC-09: 인증 페이지에 nav 표시 (기관/유형 링크, 사용자명, role 뱃지, 로그아웃)
- [ ] AC-10: role에 따라 ADMIN 전용 링크/버튼 표시·숨김

### 7.3 기관 목록

- [ ] AC-11: 활성 기관만 표시 (최신순)
- [ ] AC-12: 빈 목록에 안내 메시지
- [ ] AC-13: 행 클릭 시 상세로 이동
- [ ] AC-14: ADMIN은 "기관 등록" 버튼 표시

### 7.4 기관 상세

- [ ] AC-15: 전체 필드와 타임스탬프 표시
- [ ] AC-16: ADMIN은 수정/삭제 버튼 표시
- [ ] AC-17: 404 응답 시 안내 메시지

### 7.5 기관 등록

- [ ] AC-18: InstitutionType 드롭다운에 활성 유형만
- [ ] AC-19: 필수 필드 검증 (name, code, type, address)
- [ ] AC-20: code 형식 검증 (`^[A-Z0-9_-]+$`)
- [ ] AC-21: 409 중복 코드 에러 표시
- [ ] AC-22: 성공 시 상세로 이동 + 알림

### 7.6 기관 수정

- [ ] AC-23: 기존 값으로 폼 사전 채움
- [ ] AC-24: PUT 전체 필드 교체
- [ ] AC-25: 성공 시 상세로 이동 + 알림

### 7.7 기관 삭제

- [ ] AC-26: 확인 모달에서 code + name 재입력 요구
- [ ] AC-27: 불일치 시 모달 내 에러 표시
- [ ] AC-28: 성공 시 목록 이동 + 알림
- [ ] AC-29: ESC로 모달 닫기

### 7.8 기관 유형 CRUD

- [ ] AC-30: 활성 유형만 목록 표시
- [ ] AC-31: ADMIN 등록/수정/비활성화 가능
- [ ] AC-32: 비활성화 시 신규 기관 등록에서 선택 불가

### 7.9 폼 검증

- [ ] AC-33: 필수 필드 누락 시 인라인 메시지
- [ ] AC-34: 길이/형식 위반 시 인라인 메시지
- [ ] AC-35: 백엔드 400 응답 필드 매핑

### 7.10 에러 처리

- [ ] AC-36: 401 → 로그인 리다이렉트
- [ ] AC-37: 403 → 목록 리다이렉트 + 알림
- [ ] AC-38: 500 → 범용 알림

### 7.11 디자인 & 반응형

- [ ] AC-39: 그라데이션 없음 확인
- [ ] AC-40: 모바일 레이아웃 확인 (640px 이하 스택)
- [ ] AC-41: 데스크톱 레이아웃 확인 (1024px 이상)
- [ ] AC-42: 포커스 링 일관성

### 7.12 테스트

- [ ] AC-43: 단위 테스트 통과 (Jest)
- [ ] AC-44: 통합 테스트 통과 (Playwright)
- [ ] AC-45: `npm run lint` 경고 0
- [ ] AC-46: `npm run build` 성공

## 8. 가정 및 의존성

| # | 항목 |
|---|------|
| 1 | 백엔드 API 가동 상태 유지 |
| 2 | 백엔드 CORS·CSRF·세션 쿠키 설정 완료 |
| 3 | 초기 InstitutionType Master 데이터 시드 완료 |
| 4 | 테스트 계정 (admin/admin1234, user01/user1234) 생성 완료 |

## 9. 위험 및 완화

| # | 위험 | 완화 |
|---|------|------|
| 1 | 백엔드 스펙 변경 | 백엔드 문서 변경 시 정합성 점검 후 일괄 반영 |
| 2 | CSRF 토큰 누락으로 403 | `lib/api.ts` 공통 주입, 단위 테스트로 검증 |
| 3 | Next.js 16 학습 불일치 | 공식 문서 우선 확인 |

## 10. 서명

| 역할 | 이름 | 서명 | 날짜 |
|------|------|------|------|
| 발주자 | | | |
| 수행자 | | | |