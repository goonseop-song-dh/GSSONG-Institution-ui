# 소프트웨어 요구사항 명세서 (SRS) — institution-ui

**문서 버전:** 1.0
**작성일:** 2026-04-15

## 1. 서론

### 1.1 목적

본 문서는 연구기관 관리 시스템의 프론트엔드 (institution-ui)에 대한 기능·비기능 요구사항을 정의한다. 개발·QA·이해관계자가 요구사항을 명확히 이해하고, 검증 기준으로 활용함을 목적으로 한다.

### 1.2 범위

institution-ui는 백엔드 Spring Boot REST API를 소비하는 Next.js 기반 웹 클라이언트로, 다음 기능을 포함한다:

- 세션 기반 인증 UI (로그인, 회원가입, 로그아웃)
- 연구기관(Institution) CRUD UI
- 기관 유형(InstitutionType) Master CRUD UI
- 역할 기반(USER/ADMIN) UI 제어
- 클라이언트 사이드 폼 검증 및 에러 표시
- 반응형 레이아웃

### 1.3 정의 및 약어

| 용어 | 정의 |
|------|------|
| USER | 조회 전용 역할 |
| ADMIN | 전체 CRUD 가능 역할 |
| Soft Delete | 물리 삭제 대신 `deleted=true` 플래그로 처리하는 논리 삭제 |
| JSESSIONID | Spring Security 세션 쿠키 |
| XSRF-TOKEN / X-XSRF-TOKEN | CSRF 방어를 위한 쿠키·헤더 쌍 |
| SRS | Software Requirements Specification |
| SPA | Single Page Application (App Router 기반) |

## 2. 전체 설명

### 2.1 시스템 컨텍스트

```
+-----------+    HTTPS     +------------------+     JPA    +------------+
| Browser   | <-------->  | institution-ui   | <------->  | Backend    |
| (User)    |   (cookie)  | (Next.js)        |   (REST)   | (Spring)   |
+-----------+             +------------------+            +------------+
                                                                |
                                                                v
                                                         +------------+
                                                         | PostgreSQL |
                                                         +------------+
```

institution-ui는 별도 저장소로 관리되며, 백엔드 API와 네트워크를 통해 통신한다.

### 2.2 사용자 클래스

| 클래스 | 역할 | 주요 사용 시나리오 |
|--------|------|--------------------|
| Anonymous | 미인증 | 회원가입, 로그인 |
| USER | 일반 사용자 | 기관·유형 조회 |
| ADMIN | 관리자 | 기관·유형 전체 CRUD |

### 2.3 운영 환경

| 항목 | 값 |
|------|-----|
| 브라우저 | Chrome, Edge, Safari, Firefox 최신 버전 |
| 화면 해상도 | 모바일 (320px+), 태블릿 (640px+), 데스크톱 (1024px+) |
| 백엔드 연동 | Spring Boot 3.x REST API (세션 인증) |

### 2.4 제약사항

- Next.js App Router만 사용 (Pages Router 금지)
- TypeScript strict, `any` 금지
- Tailwind CSS만으로 스타일링 (CSS-in-JS 라이브러리 금지)
- 그라데이션 및 AI 감성 스타일 금지 (플랫 단색만)
- 비밀번호·토큰을 `localStorage`·`sessionStorage`에 저장 금지

### 2.5 가정

- 백엔드 API는 CORS에서 프론트엔드 origin을 허용한다
- 백엔드가 `JSESSIONID`와 `XSRF-TOKEN` 쿠키를 SameSite 적절값으로 발급한다
- 초기 InstitutionType Master 데이터(UNIVERSITY, GOVT_RESEARCH, CORP_RESEARCH, ETC)가 시드되어 있다

## 3. 기능 요구사항

### 3.1 인증

#### 3.1.1 로그인 (UI-AUTH-01)

| 항목 | 내용 |
|------|------|
| 경로 | `/login` |
| 접근 | Public |
| 입력 | username (필수), password (필수) |
| 동작 | `POST /api/auth/login` 호출. 200 성공 시 세션 저장 후 `/institutions`로 리다이렉트. |
| 실패 처리 | 401: "자격 증명이 올바르지 않습니다" 인라인 알림. 400: 필드별 검증 메시지. |
| UI 요소 | 로고, 제목, username/password 입력, 로그인 버튼, "회원가입" 링크 |

#### 3.1.2 회원가입 (UI-AUTH-02)

| 항목 | 내용 |
|------|------|
| 경로 | `/signup` |
| 접근 | Public |
| 입력 | username (4-50자), password (≥8자), role (USER/ADMIN 선택) |
| 동작 | `POST /api/auth/signup` 호출. 201 성공 시 `/login`으로 이동 + "가입 완료" 알림. |
| 실패 처리 | 409: "이미 사용 중인 사용자명입니다". 400: 필드별 검증 메시지. |

#### 3.1.3 로그아웃 (UI-AUTH-03)

| 항목 | 내용 |
|------|------|
| 접근 | Authenticated |
| 트리거 | 네비게이션 바 로그아웃 버튼 |
| 동작 | `POST /api/auth/logout` 호출 후 `/login`으로 리다이렉트 |

#### 3.1.4 라우트 보호 (UI-AUTH-04)

- 보호 경로 접근 시 `GET /api/auth/status`로 인증 확인
- 401 응답 시 `/login`으로 리다이렉트
- ADMIN 전용 경로에서 role 확인, 불일치 시 `/institutions`로 리다이렉트 + 403 알림

#### 3.1.5 CSRF 처리 (UI-AUTH-05)

- `lib/api.ts`의 fetch 래퍼가 쿠키에서 `XSRF-TOKEN` 읽어 `X-XSRF-TOKEN` 헤더로 포함
- POST/PUT/DELETE 모든 요청에 자동 적용 (단, `/api/auth/signup`, `/api/auth/login`은 예외)

### 3.2 네비게이션 바

| 항목 | 내용 |
|------|------|
| 표시 조건 | 인증된 페이지에서만 표시 (로그인/회원가입 페이지는 비표시) |
| 좌측 | 로고 + "연구기관 관리" |
| 중앙 | "기관 목록", "기관 유형" 링크 |
| 우측 | 사용자명, role 뱃지 (USER/ADMIN), 로그아웃 버튼 |
| 높이 | `h-16` 고정 상단 |

### 3.3 기관 관리

#### 3.3.1 기관 목록 (UI-INST-01)

| 항목 | 내용 |
|------|------|
| 경로 | `/institutions` |
| 접근 | USER, ADMIN |
| 데이터 | `GET /api/institutions` — 활성 기관 전체, 최신순 |
| 컬럼 | 기관명, 코드, 유형, 대표자, 설립일 |
| 행 클릭 | `/institutions/{id}` 상세로 이동 |
| 우측 상단 | (ADMIN) "기관 등록" 버튼 |
| 빈 목록 | "등록된 기관이 없습니다" 안내 |

#### 3.3.2 기관 상세 (UI-INST-02)

| 항목 | 내용 |
|------|------|
| 경로 | `/institutions/[id]` |
| 접근 | USER, ADMIN |
| 데이터 | `GET /api/institutions/{id}` |
| 표시 | 라벨-값 레이아웃, 전체 필드, createdAt/updatedAt |
| 액션 | (ADMIN) "수정", "삭제" 버튼 |
| 404 | "기관을 찾을 수 없습니다" + 목록으로 돌아가기 |

#### 3.3.3 기관 등록 (UI-INST-03)

| 항목 | 내용 |
|------|------|
| 경로 | `/institutions/new` |
| 접근 | ADMIN 전용 |
| 입력 | name, code, institutionTypeId (드롭다운 — 활성 유형만), address, phone, email, website, representative, establishedDate |
| 동작 | `POST /api/institutions` |
| 성공 | 상세 페이지로 이동 + "등록되었습니다" 알림 |
| 에러 | 409 (코드 중복): code 필드 에러 / 400: 필드별 검증 메시지 / 400 (비활성 유형): "비활성화된 기관 유형은 사용할 수 없습니다" |

#### 3.3.4 기관 수정 (UI-INST-04)

| 항목 | 내용 |
|------|------|
| 경로 | `/institutions/[id]/edit` |
| 접근 | ADMIN 전용 |
| 사전 채움 | 기존 값으로 폼 초기화 |
| 동작 | `PUT /api/institutions/{id}` (전체 필드 교체) |
| 성공 | 상세 페이지로 이동 + "수정되었습니다" 알림 |

#### 3.3.5 기관 삭제 (UI-INST-05)

| 항목 | 내용 |
|------|------|
| 트리거 | 상세 페이지 "삭제" 버튼 (ADMIN) |
| 확인 모달 | code + name 재입력 요구 |
| 동작 | `DELETE /api/institutions/{id}` body `{code, name}` |
| 성공 | 목록으로 이동 + "삭제되었습니다" 알림 |
| 불일치 | 409 "삭제 확인 정보가 일치하지 않습니다" 모달 내 에러 |
| ESC 키 | 모달 닫기 |

### 3.4 기관 유형 관리

#### 3.4.1 유형 목록 (UI-TYPE-01)

| 항목 | 내용 |
|------|------|
| 경로 | `/institution-types` |
| 접근 | USER, ADMIN |
| 데이터 | `GET /api/institution-types` — 활성 유형, sortOrder 오름차순 |
| 컬럼 | 코드, 명칭, 설명, 정렬순서, 활성여부 |

#### 3.4.2 유형 상세 (UI-TYPE-02)
| 경로 | `/institution-types/[id]` / 전체 필드 표시 |

#### 3.4.3 유형 등록 (UI-TYPE-03) — ADMIN
| `POST /api/institution-types` / 409: 코드 중복 에러 |

#### 3.4.4 유형 수정 (UI-TYPE-04) — ADMIN
| `PUT /api/institution-types/{id}` |

#### 3.4.5 유형 비활성화 (UI-TYPE-05) — ADMIN
| `DELETE /api/institution-types/{id}` → `active=false` / 확인 모달 "비활성화하면 신규 기관 등록 시 선택할 수 없습니다" |

## 4. 비기능 요구사항

### 4.1 사용성

| ID | 요구사항 |
|----|----------|
| NFR-USA-01 | 모든 폼은 실시간 인라인 검증 메시지 표시 |
| NFR-USA-02 | 성공/실패 알림은 3초 후 자동 소멸 (또는 명시적 닫기) |
| NFR-USA-03 | 삭제는 반드시 확인 모달 경유 |
| NFR-USA-04 | 버튼 로딩 상태 표시 (스피너 또는 "처리 중…") |
| NFR-USA-05 | 빈 목록/에러 상태에 명확한 안내 메시지 |

### 4.2 성능

| ID | 요구사항 |
|----|----------|
| NFR-PER-01 | 초기 페이지 로드 3초 이내 (LAN 환경) |
| NFR-PER-02 | 폼 제출 반응 500ms 이내 시작 (로딩 상태 표시) |

### 4.3 반응형

| ID | 요구사항 |
|----|----------|
| NFR-RES-01 | 모바일 (320-639px): 네비게이션 축약, 테이블 카드 스택 |
| NFR-RES-02 | 태블릿 (640-1023px): 중간 레이아웃 |
| NFR-RES-03 | 데스크톱 (1024px+): 전체 레이아웃 |

### 4.4 접근성

| ID | 요구사항 |
|----|----------|
| NFR-ACC-01 | 모든 입력에 `<label>` 연결 |
| NFR-ACC-02 | 포커스 링 표시 |
| NFR-ACC-03 | 키보드 탐색 가능 (Tab, Enter, Esc) |
| NFR-ACC-04 | 에러 메시지는 `aria-live` 영역으로 알림 |

### 4.5 보안

| ID | 요구사항 |
|----|----------|
| NFR-SEC-01 | 비밀번호 input은 `type="password"` |
| NFR-SEC-02 | 인증 정보 localStorage/sessionStorage 저장 금지 |
| NFR-SEC-03 | CSRF 토큰을 변경 요청에 자동 포함 |
| NFR-SEC-04 | 쿠키는 서버가 HttpOnly/SameSite 설정 관리 |
| NFR-SEC-05 | 사용자 입력은 React 기본 XSS 방어 활용 (`dangerouslySetInnerHTML` 금지) |

### 4.6 유지보수성

| ID | 요구사항 |
|----|----------|
| NFR-MNT-01 | TypeScript strict, `any` 금지 |
| NFR-MNT-02 | API 응답 타입은 `lib/types.ts`에 중앙 정의 |
| NFR-MNT-03 | API 호출은 `lib/api.ts`에 집중 |
| NFR-MNT-04 | ESLint 경고 0 유지 |

## 5. 데이터 검증 규칙

> 7.4절 (project-proposal-ui.md)와 11절 (테스트 전략) 참조.

## 6. 에러 코드 매핑

| Code | HTTP | UI 표시 |
|------|------|---------|
| VALIDATION_ERROR | 400 | 필드별 인라인 메시지 |
| INSTITUTION_TYPE_INACTIVE | 400 | "비활성화된 기관 유형은 사용할 수 없습니다" |
| UNAUTHORIZED | 401 | 로그인 페이지 리다이렉트 |
| INVALID_CREDENTIALS | 401 | "자격 증명이 올바르지 않습니다" |
| ACCESS_DENIED | 403 | "접근 권한이 없습니다" + 목록 리다이렉트 |
| INSTITUTION_NOT_FOUND | 404 | "기관을 찾을 수 없습니다" |
| INSTITUTION_TYPE_NOT_FOUND | 404 | "기관 유형을 찾을 수 없습니다" |
| DUPLICATE_USERNAME | 409 | "이미 사용 중인 사용자명입니다" |
| DUPLICATE_INSTITUTION_CODE | 409 | "이미 사용 중인 기관 코드입니다" |
| DUPLICATE_INSTITUTION_TYPE_CODE | 409 | "이미 사용 중인 유형 코드입니다" |
| DELETE_MISMATCH | 409 | "삭제 확인 정보가 일치하지 않습니다" |
| INTERNAL_SERVER_ERROR | 500 | "서버 오류가 발생했습니다" |

## 7. 테스트 전략

### 7.1 단위 테스트 (Jest + React Testing Library)

- 컴포넌트 렌더링, 이벤트 핸들링, 검증 로직
- `lib/api.ts` fetch 모킹
- 목표 커버리지: 주요 컴포넌트·폼 80% 이상

### 7.2 통합 테스트 (Playwright)

- 로그인 → 기관 등록 → 수정 → 삭제 엔드투엔드
- role 분기 시나리오 (USER vs ADMIN)
- 에러 시나리오 (중복 코드, 삭제 불일치, 권한 없음)

## 8. 관련 문서

| 문서 | 위치 |
|------|------|
| 프로젝트 제안서 | `docs-ui/project-proposal-ui.md` |
| 기능 명세 | `docs-ui/functional-specification-ui.md` |
| UI 디자인 계획 | `docs-ui/ui-design-plan.md` |
| SOW | `docs-ui/SOW-ui.md` |
| WBS | `docs-ui/WBS-ui.md` |
| 백엔드 SRS | `../institution/docs/01-기획/SRS.md` |