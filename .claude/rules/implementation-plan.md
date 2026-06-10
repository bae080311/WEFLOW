# WEFLOW 재구성 구현 계획 (implementation plan)

> 작업 순서를 단계로 쪼갠 계획. **공유 컴포넌트/데이터 계층을 먼저** 만들어 재작업을 최소화한다. 아키텍처는 **FSD(Feature-Sliced Design)**.
> 관련 문서: 요구사항 `requirements-weflow.md`, 디자인 `design-system.md`, 규칙 `coding-rules.md`, 검증 `verification-checklist.md`.

## 확정 스택 / 결정
- **Next.js 16.2.6 (App Router) + React 19 + React Compiler ON**, **TypeScript**, **Tailwind v4**(`@theme` 토큰), **lucide-react**, **npm**.
- **아키텍처: FSD** — 레이어 `app > views > widgets > features > entities > shared`, import는 위→아래만.
- 데이터: **Repository 인터페이스(port) + Supabase 어댑터**(Postgres + Realtime + Auth). localStorage 어댑터는 로컬/폴백.
- 엑셀: **xlsx(SheetJS)**, admin에서만 dynamic import.
- 테스트: **Vitest + React Testing Library**(유닛·컴포넌트, jsdom), **Playwright**(E2E). PDF 규정값을 단언.
- scripts: `dev` / `build` / `lint` / `typecheck`(`tsc --noEmit`) / `test`(vitest) / `test:coverage`(vitest --coverage, **임계 80%**) / `test:e2e`(playwright).

## 권장 폴더 구조 (FSD 타깃)
```
public/                      # P0 이관: cases_*.jpg(28), logo_icon.png, main_icon.png, favicon.ico
src/                         # ── Feature-Sliced Design 레이어 (import 위→아래) ──
  app/                       # [app] Next App Router 라우팅 + 전역(providers/globals)
    layout.tsx  globals.css  providers/ModalProvider.tsx
    page.tsx  services/ pricing/ cases/ cases/[slug]/ reservation/ diagnosis/ landing/ privacy/ terms/   # 라우트는 thin → views 조합
    admin/ (layout.tsx 독립 셸 + page.tsx)
  views/                     # [pages*] 페이지 조합 (Next 'pages' 라우터 충돌 회피 위해 views로 명명)
    {home,services,pricing,cases,reservation,diagnosis,landing,admin}/{ui/*, index.ts}
  widgets/                   # [widgets] 독립 합성 블록
    {header,footer,bottom-bar,form-modal,pricing-cards,process-steps,delivery-flow,diagnosis-checklist,review-marquee,admin-dashboard}/{ui, index.ts}
  features/                  # [features] 사용자 상호작용(행위)
    {inquiry-form,reservation-form,admin-status-control,admin-auth,excel-export}/{ui, model, index.ts}
  entities/                  # [entities] 비즈니스 엔티티(모델+API)
    {reservation,inquiry,case,pricing-plan,review}/{model, api, ui, index.ts}
  shared/                    # [shared] 재사용 기반 (최하위)
    ui/{Button,Card,Chip,Section,Modal,PriceTag,Table,StatusBadge}
    lib/{cn,datetime,validation,excel,events}
    config/{links,company,env}        # 전역 텍스트/링크/회사정보
    api/{supabaseClient,repository(port),localStorageAdapter}
    fonts/Pretendard*
```
> 세그먼트: `ui · model · lib · api · config` + 슬라이스별 `index.ts`(public API). 슬라이스 내부 경로 직접 import 금지(반드시 `index.ts` 경유). 페이지별 텍스트는 해당 `views`/`entities`의 `config`/`model`에, 전역 텍스트는 `shared/config`.

---

## 단계별 계획

각 단계 형식: **목표 / 생성 / 수정 / 검증 / 완료 기준**.

### P0 — 자산 이관 (선행)
- 목표: 콘텐츠 자산 확보.
- 생성: `public/cases_*.jpg`(28), `logo_icon.png`, `main_icon.png`, `favicon.ico`, `src/shared/fonts/Pretendard-{Regular,Medium,Bold}.woff2`.
- 수정: —
- 검증: `ls public/` 28개 케이스 이미지 + 로고; 폰트 존재.
- 완료: `entities/case` 데이터가 참조할 이미지 경로가 전부 resolve.

### P1 — 하네스 / 스캐폴드
- 목표: 부팅되는 Next16+TS+Tailwind v4 앱 + FSD 레이어 골격.
- 생성: `package.json`(+scripts: dev/build/lint/typecheck/test/test:e2e), `next.config.mjs`(`reactCompiler:true`), `postcss.config.mjs`, `tsconfig.json`(`@/*`→`src/*`), `eslint.config.mjs`, `vitest.config.ts`+`vitest.setup.ts`(jsdom·RTL·coverage threshold 80%), `playwright.config.ts`, `src/app/{layout.tsx,page.tsx,globals.css}`, 빈 레이어 디렉터리(`views/widgets/features/entities/shared`).
- 검증: `npm run dev`로 빈 페이지 표시, `npm run build && npm run lint && npm run typecheck && npm run test` 통과(샘플 테스트 1개 포함).
- 완료: 빈 홈에서 5개 명령 모두 green.

### P2 — 디자인 시스템 (WEFLOW 브랜드 토큰 + shared/ui)
- 목표: 토큰 기반(하드코딩 hex 0).
- 생성: `shared/lib/cn.ts`; `shared/ui/{Button,Card,Chip,Section,Modal,PriceTag,Table,StatusBadge}`; `src/app/fonts.ts`(Pretendard, `shared/fonts` 참조).
- 수정: `globals.css`(`@theme` WEFLOW 브랜드 토큰 + 그라디언트/글로우 헬퍼 + Pretendard 연결), `app/layout.tsx`(폰트 variable).
- 검증: 임시 styleguide로 Button/Card/Chip/PriceTag 다크 브랜드 테마·Pretendard·브랜드 그라디언트(시안→블루)·hover 글로우 확인. `grep -rE '#[0-9a-fA-F]{3,8}' src/shared/ui` → globals 외 0건.
- 완료: 컴포넌트가 design-system.md 사양 일치, hover/focus/active 구현.

### P3 — 공통 레이아웃 (widgets: Header/Footer/BottomBar/FormModal)
- 목표: 모든 페이지 공통 크롬 + 전역 문의 모달.
- 생성: `widgets/{header,footer,bottom-bar,form-modal}/ui`; `app/providers/ModalProvider.tsx`; `shared/config/{links,company}.ts`(네비·푸터·외부링크·회사정보).
- 수정: `app/layout.tsx`(`ModalProvider`로 Header/main/Footer/BottomBar/FormModal 조합).
- 검증: 네비 6개·순서, 푸터 회사정보(신서준/884-07-03480/contact@weflowlab.kr/연중무휴24시간), BottomBar 4개 고정, CTA로 모달 open/close(esc·backdrop·focus trap), 외부링크 정확.
- 완료: 플레이스홀더 페이지에서 레이아웃·모달·모바일 바 정상.

### P4 — Home
- 목표: 섹션 조합 + CTA 라우팅.
- 생성: `views/home/ui/*`(Hero/Benefits/Cases/Process/Diagnosis/Review); `widgets/{review-marquee,delivery-flow,diagnosis-checklist}/ui`; `entities/review/{model}`(후기 데이터).
- 수정: `app/page.tsx`(→ `views/home`).
- 검증: 히어로(제목/부제/CTA3/칩3), 케어 6혜택, 4단계 흐름, 성공사례 박스(살펴보기→/diagnosis)+썸네일5+더보기, 제작진행과정↔6단계 **양옆**(모바일 스택), 진단 체크리스트→/diagnosis, 후기 마퀴+더보기→모달.
- 완료: 홈 CTA가 §8 라우팅표대로, 모바일 패리티.

### P5 — Service
- 목표: 6단계 + 광고운영 시스템. **`widgets/process-steps` 정립**.
- 생성: `views/services/ui/*`(ProcessSection/AdOpsSystemSection); `widgets/process-steps/ui`; 서비스 텍스트(`views/services/config`).
- 수정: `app/services/page.tsx`; Home Process가 `widgets/process-steps` 사용하도록.
- 검증: 6단계(설명 포함), 광고운영 8항목.
- 완료: Service 렌더 + Home 재사용(중복 없음).

### P6 — Pricing
- 목표: 8카드/3그룹/취소선·크라운. **`widgets/pricing-cards`+`shared/ui/PriceTag` 정립**.
- 생성: `entities/pricing-plan/model`(8카드: 정가/할인가/기능/그룹/highlighted); `widgets/pricing-cards/ui`; `views/pricing/ui/*`(Intro/Groups/Notes).
- 수정: `app/pricing/page.tsx`; `shared/ui/PriceTag` 확정.
- 검증: 3중 택1 안내, 1열 카드, A3/B3/C2=8, 가격 정확(requirements §5), MASTER·WEFLOW CARE 크라운·색상, 하단 안내.
- 완료: 카드 데이터 단일 소스(`entities/pricing-plan`)에서 Pricing·Landing 재사용.

### P7 — 폼(features) + 데이터/서비스 계층 (P8~P10 선행)
- 목표: 영속 seam + 재사용 폼.
- 생성: `shared/api/{supabaseClient,repository(port),localStorageAdapter}`; `entities/reservation/{model,api}`, `entities/inquiry/{model,api}`(service); `features/admin-auth/{model}`; `shared/lib/{datetime,validation,excel,events}`; `features/{inquiry-form,reservation-form}/ui`(DatePicker/TimeGrid 포함, 필드는 `shared/ui`).
- 수정: `widgets/form-modal`이 `features/inquiry-form` 렌더.
- 검증: entity service create→list→updateStatus→remove 동작(Supabase); `datetime`이 20슬롯 생성·과거 비활성; `excel.exportCombined()` 한글 정상 다운로드(예약/문의 2시트); 폼 검증(이름·연락처·동의) 후 service 기록.
- 완료: CRUD가 Repository 포트로 동작, 폼 제출 정상.

### P8 — Reservation
- 목표: 예약 페이지가 예약 엔티티에 기록.
- 생성: `views/reservation/ui`(reservation-form 조합); 예약 텍스트(`views/reservation/config`).
- 수정: `app/reservation/page.tsx`(→ `views/reservation`).
- 검증: 세로 달력, 20슬롯 5×4, 오늘이면 과거 비활성, 직접입력, 4필드+드롭다운, 동의 필수, 제출 후 `entities/reservation` 목록에 표시.
- 완료: 제출 예약이 영속·새로고침 후 유지·관리자 표시.

### P9 — Diagnosis (신규)
- 목표: 무료진단 페이지가 문의 엔티티에 기록.
- 생성: `views/diagnosis/ui`(inquiry-form 조합, source=diagnosis); 진단 텍스트(`views/diagnosis/config`).
- 수정: `app/diagnosis/page.tsx`(→ `views/diagnosis`).
- 검증: 필드 일치, 제출→inquiry(source=diagnosis), 영속.
- 완료: 진단 제출이 문의 목록·관리자 표시.

### P10 — Admin (신규, 로그인·실시간·엑셀)
- 목표: 두 엔티티 대시보드 + 실시간 상태 + 엑셀.
- 생성: `app/admin/{layout.tsx(독립 셸),page.tsx}`; `views/admin/ui`; `widgets/admin-dashboard/ui`(ReservationTable/InquiryTable/StatusTabs); `features/{admin-status-control,excel-export,admin-auth}/ui`.
- 수정: `entities/{reservation,inquiry}`가 `shared/lib/events`/Realtime 구독.
- 검증: 로그인 게이트; 상단 전체엑셀/새로고침/로그아웃; 탭 대기·진행중·완료·전체 필터(실시간); 예약 테이블(상태·이름·연락처·접수일·희망일정·관리 + 펼침 상세) 완료/진행중/삭제 실시간; 문의 테이블(상태·이름·연락처·접수일·관리 + 펼침); 개별/전체 엑셀; **크로스 디바이스/탭**: 한 곳에서 제출 → 관리자에 반영.
- 완료: 예약→관리자, 진단→관리자 end-to-end, 상태 버튼 영속, 엑셀(개별·전체) 한글 정상.

### P11 — Landing (전부 widgets 재사용 + sticky 폼)
- 목표: widgets 조합 + 우측 sticky 문의 폼.
- 생성: `views/landing/ui/*`(LandingHero/LandingFeatures/LandingSticky); 랜딩 텍스트(`views/landing/config`).
- 수정: `app/landing/page.tsx`(→ `views/landing`).
- 검증: 제목/부제, CTA2(모달/`/cases`), 우측 sticky `features/inquiry-form`(source=landing), 가치 섹션 7개, **재사용** pricing-cards8/process-steps6/review-marquee전부/diagnosis-checklist, 동일 Footer, 모바일에서 폼 inline 전환.
- 완료: Landing에 중복 섹션 코드 0 — 전부 widgets + 슬라이스 config.

### P12 — QA / 반응형 / 빌드 검증
- 목표: 전역 요구 검증(→ `verification-checklist.md`).
- 검증: 모든 CTA 라우팅, 모바일 패리티(홈/가격/케이스/예약/관리자), React19 컴파일러 빌드 clean, Pretendard FOUT/CLS 없음, FSD import 방향 위반 0, **전체 테스트 green(`npm run test` + `npm run test:e2e`)**, `npm run build && lint && typecheck` green, favicon/og.
- 완료: 전역/크로스컷 요구 충족.

---

## 재사용 맵 (Landing "퍼오기" = 단일 컴포넌트)
| 공유 블록 | 위치 | 정립 단계 | 재사용처 | 데이터 |
|---|---|---|---|---|
| `pricing-cards`(8) | widgets | P6 | Pricing, Landing | `entities/pricing-plan` |
| `process-steps`(6) | widgets | P5 | Service, Home, Landing | `views/services/config` |
| `delivery-flow`(4) | widgets | P4 | Home, Landing | `views/home/config` |
| `diagnosis-checklist`(✓4) | widgets | P4 | Home, Landing | `views/home/config` |
| `review-marquee` | widgets | P4 | Home, Landing | `entities/review` |
| `inquiry-form` | features | P7 | form-modal, Diagnosis, Landing sticky | `entities/inquiry/api` |
| `header`/`footer`/`bottom-bar` | widgets | P3 | 전 페이지 | `shared/config` |
> 규칙: 가장 먼저 필요한 단계에서 만들고, 이후 페이지는 슬라이스 `index.ts`로 **import만**(복사 금지).

---

## 테스트 전략 (PDF 기준 — 항상)
- **프레임워크**: Vitest + React Testing Library(유닛·컴포넌트, jsdom), Playwright(E2E).
- **위치**: 슬라이스에 co-locate(`*.test.ts`/`*.test.tsx`), E2E는 `e2e/*.spec.ts`. 설정 `vitest.config.ts`·`vitest.setup.ts`·`playwright.config.ts`.
- **항상 PDF를 기준으로 단언**(값·문구·흐름), 각 단계에서 해당 테스트를 함께 작성:
  - `shared/lib/datetime`(P7): 20슬롯(09:00–18:30/30분), 오늘이면 과거 비활성, 직접입력 우선.
  - `shared/lib/validation`(P7): 이름·연락처 필수, 동의 `true` 강제.
  - `shared/lib/excel`(P7): 예약/문의 2시트, 한글 안전, 전체+개별.
  - `entities/*/api` repository(P7): create/list/updateStatus/remove, 기본 상태=대기.
  - `widgets/pricing-cards`(P6): 8카드·정가→할인가(498k→249k / 1,980k→990k / …), MASTER·WEFLOW CARE 크라운.
  - `features/{inquiry-form,reservation-form}`(P7~9): 필수/동의 검증, 제출 시 service 호출, TimeGrid 5×4·과거 비활성.
  - admin(P10): 상태 변경/삭제/상세 펼침/탭 필터/엑셀.
  - 라우팅·CTA(E2E, P12): §8 라우팅표대로 이동, 예약/진단 제출→관리자 반영, 모바일 스모크.
- **커버리지 ≥80% 유지**: `vitest.config.ts`의 `coverage.thresholds`(lines/functions/branches/statements 80)로 강제. 대상 `src/{shared,entities,features,widgets,views}/**`, 제외 `*.config.*`·`*.d.ts`·`src/app/**`·barrel `index.ts`·`e2e/**`.
- **완료 기준**: 각 단계에서 해당 테스트 작성 + `npm run test` green + `npm run test:coverage` 임계(80%) 통과. 미작성·실패·임계 미달로 마무리 금지.

---

## 빌드 리스크 & 재작업 트랩
1. **Tailwind v4 `@theme`**: config 파일 없음 → 토큰은 `globals.css`. 토큰명↔유틸명 확인 후 페이지 작업. hex 하드코딩 금지(grep/훅).
2. **Pretendard(Next16)**: Geist 대신 self-host woff2 + `next/font/local` + `display:swap` + preload(FOUT/CLS 방지). 원격 `@import`는 layout shift 위험.
3. **React 19 컴파일러**: 렌더 순수 유지, side effect는 `useEffect`. TimeGrid/마퀴/관리자 실시간이 위험 구간. `'use no memo'` 탈출구 금지.
4. **시간 그리드 과거 비활성**: 서버시각≠사용자시각 → 하이드레이션 불일치. "now"는 mount 후 클라이언트에서 계산(또는 client-only).
5. **실시간 동기화**: Supabase Realtime 구독(크로스 디바이스). localStorage 폴백 시 `storage` 이벤트는 *다른* 탭만 발화 → 인탭 pub/sub 별도. SSR `typeof window` 가드.
6. **모바일 패리티**: 홈 양옆 박스→세로 스택, 가격 1열, 관리자 테이블 가로 스크롤/카드형, 랜딩 sticky→inline. 320~414px 점검. 마퀴 `prefers-reduced-motion`.
7. **한글 엑셀**: xlsx는 네이티브 OK. CSV 폴백 시 UTF-8 BOM 필수. 전체 = 2시트.
8. **FSD + Next 충돌**: FSD `pages` 레이어는 Next 'pages' 라우터와 충돌 → **`views`로 명명**. import 방향(위→아래)·슬라이스 public API(`index.ts`) 위반 주의.
9. **자산 갭(P0)**: 이미지 누락 시 `next/image` 빌드 실패 가능 → P0 선행.
10. **`cases/[slug]`**: 메뉴얼은 상세 페이지 암시(참고 레포엔 없음) → `entities/case`에 `slug`+상세 콘텐츠를 미리 정의.
