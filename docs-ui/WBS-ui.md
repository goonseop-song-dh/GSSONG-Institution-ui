# 작업 분해 구조 (WBS) — institution-ui

**문서 버전:** 1.0
**작성일:** 2026-04-15

## 1. 스케줄 개요

| 항목 | 내용 |
|------|------|
| 총 기간 | 약 2일 (14.5시간 실작업) |
| Phase 수 | 7 |
| 병렬 가능 여부 | 순차적 (P1→P2→...→P7) |

## 2. Phase 요약

| Phase | 제목 | 예상 시간 | 누적 |
|-------|------|-----------|------|
| P1 | 프로젝트 설정 & 인프라 | 2.0h | 2.0h |
| P2 | 레이아웃 & 네비게이션 | 1.5h | 3.5h |
| P3 | 인증 | 2.5h | 6.0h |
| P4 | 기관 목록 & 상세 | 2.5h | 8.5h |
| P5 | 기관 등록·수정·삭제 | 2.0h | 10.5h |
| P6 | 기관 유형 CRUD | 2.0h | 12.5h |
| P7 | 통합·테스트·문서 | 2.0h | 14.5h |

## 3. 상세 작업 스케줄

### Phase 1: 프로젝트 설정 & 인프라 (2.0h)

| Task | 설명 | 시간 | 결과물 |
|------|------|------|--------|
| P1-T1 | `npx create-next-app` (App Router, TS, Tailwind) | 15m | package.json, 기본 구조 |
| P1-T2 | ESLint, Prettier 설정 | 15m | eslint.config.mjs |
| P1-T3 | Jest + RTL 설정 | 20m | jest.config.ts, jest.setup.ts |
| P1-T4 | Playwright 설정 | 20m | playwright.config.ts |
| P1-T5 | Geist 폰트 설정 (`app/layout.tsx`) | 10m | 폰트 적용 |
| P1-T6 | `lib/types.ts` — User, Institution, InstitutionType 타입 | 15m | 타입 정의 |
| P1-T7 | `lib/api.ts` — fetch 래퍼, credentials, 에러 처리 | 20m | API 클라이언트 |
| P1-T8 | `lib/csrf.ts` — 쿠키 파싱, X-XSRF-TOKEN 주입 | 15m | CSRF 유틸 |

### Phase 2: 레이아웃 & 네비게이션 (1.5h)

| Task | 설명 | 시간 | 결과물 |
|------|------|------|--------|
| P2-T1 | `app/layout.tsx` — 루트 레이아웃, 전역 스타일 | 20m | D-02 일부 |
| P2-T2 | `components/NavBar.tsx` | 30m | NavBar |
| P2-T3 | `components/RoleBadge.tsx` | 10m | role 뱃지 |
| P2-T4 | `components/Alert.tsx` — 성공/에러/경고 | 20m | Alert |
| P2-T5 | `app/page.tsx` — 인증 확인 후 리다이렉트 | 10m | 루트 리다이렉트 |

### Phase 3: 인증 (2.5h)

| Task | 설명 | 시간 | 결과물 |
|------|------|------|--------|
| P3-T1 | `lib/auth.ts` — status 확인, 클라이언트 상태 | 20m | 인증 유틸 |
| P3-T2 | `app/login/page.tsx` | 40m | D-03 |
| P3-T3 | `app/signup/page.tsx` | 30m | D-04 |
| P3-T4 | 로그아웃 버튼 동작 (NavBar) | 15m | 로그아웃 |
| P3-T5 | 라우트 보호 래퍼 또는 각 페이지에서 status 확인 | 25m | 보호 |
| P3-T6 | CSRF 헤더 검증 (실제 요청으로) | 20m | 검증 |

### Phase 4: 기관 목록 & 상세 (2.5h)

| Task | 설명 | 시간 | 결과물 |
|------|------|------|--------|
| P4-T1 | `app/institutions/page.tsx` — 목록 | 40m | D-05 |
| P4-T2 | 모바일 카드 뷰 대체 | 20m | 반응형 |
| P4-T3 | `app/institutions/[id]/page.tsx` — 상세 | 40m | D-06 |
| P4-T4 | 404 처리 | 15m | 404 |
| P4-T5 | ADMIN 액션 버튼 표시 분기 | 15m | role 분기 |

### Phase 5: 기관 등록·수정·삭제 (2.0h)

| Task | 설명 | 시간 | 결과물 |
|------|------|------|--------|
| P5-T1 | `components/InstitutionForm.tsx` (공용) | 40m | 폼 컴포넌트 |
| P5-T2 | `app/institutions/new/page.tsx` | 20m | D-07 |
| P5-T3 | `app/institutions/[id]/edit/page.tsx` | 20m | D-08 |
| P5-T4 | `components/ConfirmModal.tsx` | 20m | 모달 |
| P5-T5 | 삭제 플로우 (상세에서 모달 호출) | 20m | D-09 |

### Phase 6: 기관 유형 CRUD (2.0h)

| Task | 설명 | 시간 | 결과물 |
|------|------|------|--------|
| P6-T1 | `app/institution-types/page.tsx` — 목록 | 25m | D-10 |
| P6-T2 | `app/institution-types/[id]/page.tsx` — 상세 | 20m | D-11 |
| P6-T3 | `components/InstitutionTypeForm.tsx` | 25m | 폼 |
| P6-T4 | `/new` 및 `/[id]/edit` 페이지 | 25m | D-12 |
| P6-T5 | 비활성화 모달 | 15m | 비활성화 |
| P6-T6 | 기관 등록 폼의 유형 드롭다운 연동 | 10m | 통합 |

### Phase 7: 통합·테스트·문서 (2.0h)

| Task | 설명 | 시간 | 결과물 |
|------|------|------|--------|
| P7-T1 | 단위 테스트 작성 (주요 컴포넌트) | 40m | D-16 |
| P7-T2 | Playwright 시나리오 (로그인→등록→수정→삭제) | 30m | D-17 |
| P7-T3 | role 분기 시나리오 | 15m | 통합 |
| P7-T4 | `npm run build` 통과, lint 경고 0 | 15m | 빌드 |
| P7-T5 | README.md, CLAUDE.md 작성 | 20m | 문서 |

## 4. 간트 차트 (텍스트)

```
Hour  0    2    4    6    8    10   12   14
      |----|----|----|----|----|----|----|
P1    [##]
P2        [#]
P3          [##]
P4              [##]
P5                  [##]
P6                      [##]
P7                          [##]
```

## 5. 임계 경로

P1 → P2 → P3 → P4 → P5 → P6 → P7 (전 Phase 순차)

의존 이유:
- P2는 P1의 `lib/` 선행 필요
- P3은 레이아웃(P2) 및 API 클라이언트(P1) 필요
- P4는 인증(P3) 이후 보호 경로 접근 가능
- P5는 P4의 InstitutionForm 공용화 기반
- P6은 독립적이지만 P5 패턴 재사용 효율 ↑
- P7은 모든 기능 완료 후 가능

## 6. 결과물-작업 매핑

| 결과물 ID | 책임 Phase |
|-----------|------------|
| D-01 | P1 |
| D-02 | P2 |
| D-03, D-04 | P3 |
| D-05, D-06 | P4 |
| D-07, D-08, D-09 | P5 |
| D-10, D-11, D-12 | P6 |
| D-13, D-14, D-15 | P1, P2, P5 |
| D-16, D-17 | P7 |
| D-18 | Phase 1 (사전) |

## 7. 완료 체크리스트

### Phase 1 (8)
- [ ] Next.js 프로젝트 생성
- [ ] TypeScript strict 설정
- [ ] Tailwind CSS 동작 확인
- [ ] ESLint 경고 0
- [ ] Jest 샘플 테스트 통과
- [ ] Playwright 샘플 테스트 통과
- [ ] `lib/api.ts` 기본 동작
- [ ] CSRF 유틸 동작

### Phase 2 (5)
- [ ] Root layout 렌더링
- [ ] NavBar 표시 (인증 페이지에서만)
- [ ] RoleBadge 스타일
- [ ] Alert 컴포넌트 동작
- [ ] 루트 경로 리다이렉트

### Phase 3 (7)
- [ ] 로그인 성공 → `/institutions`
- [ ] 로그인 실패 → 에러 표시
- [ ] 회원가입 성공 → `/login`
- [ ] 중복 username 에러
- [ ] 로그아웃 동작
- [ ] 미인증 보호 경로 차단
- [ ] CSRF 헤더 자동 주입

### Phase 4 (7)
- [ ] 기관 목록 표시
- [ ] 빈 목록 안내
- [ ] 행 클릭 → 상세
- [ ] 기관 상세 전체 필드
- [ ] 404 처리
- [ ] ADMIN 액션 버튼 표시
- [ ] USER 액션 버튼 숨김

### Phase 5 (8)
- [ ] 등록 폼 검증
- [ ] 활성 유형 드롭다운
- [ ] 등록 성공 → 상세 이동
- [ ] 코드 중복 에러
- [ ] 수정 폼 사전 채움
- [ ] 수정 성공
- [ ] 삭제 모달 동작
- [ ] 삭제 불일치 에러

### Phase 6 (7)
- [ ] 유형 목록
- [ ] 유형 상세
- [ ] 유형 등록
- [ ] 유형 수정
- [ ] 유형 비활성화
- [ ] 비활성 유형 기관 등록 제외
- [ ] 유형 코드 중복 에러

### Phase 7 (8)
- [ ] 단위 테스트 주요 컴포넌트
- [ ] Playwright 핵심 시나리오
- [ ] role 분기 시나리오
- [ ] 중복/에러 시나리오
- [ ] `npm run build` 통과
- [ ] Lint 경고 0
- [ ] README/CLAUDE.md 완성
- [ ] 반응형 검증 (모바일/데스크톱)

**총 50개 체크포인트**

## 8. 위험 버퍼

- 각 Phase 15% 버퍼 내장
- P3(인증)·P4(목록/상세)가 복잡도 높음 — 초과 시 P7 문서 시간 조정
- Next.js 16 공식 문서 불일치 시 `node_modules/next/dist/docs/` 참조

## 9. 관련 문서

| 문서 | 위치 |
|------|------|
| 프로젝트 제안서 | `docs-ui/project-proposal-ui.md` |
| SOW | `docs-ui/SOW-ui.md` |
| SRS | `docs-ui/SRS-ui.md` |
| 기능 명세 | `docs-ui/functional-specification-ui.md` |
| UI 디자인 | `docs-ui/ui-design-plan.md` |