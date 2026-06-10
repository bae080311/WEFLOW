# WEFLOW

WEFLOW 마케팅 웹사이트 **전면 재구성** 프로젝트. 핵심 메시지: **"문의로 이어지는 홈페이지를 만듭니다."**
현재 레포는 **신규 구축(greenfield)** 상태이며, 이 문서가 작업 허브다. 작업 전 `.claude/rules/`를 먼저 읽는다.

## 하네스 문서 (작업 규칙 — 항상 우선)
- `@.claude/rules/coding-rules.md` — Claude Code가 지켜야 할 규칙(필독)
- `@.claude/rules/design-system.md` — WEFLOW 브랜드 컬러 + 토스식 구조(토큰·타이포·간격·컴포넌트·반응형)
- `.claude/rules/requirements-weflow.md` — 요구사항(페이지·CTA 라우팅표·폼·관리자·가격 8카드·외부링크)
- `.claude/rules/implementation-plan.md` — 단계별 구현 계획(P0~P12)·재사용 맵·리스크
- `.claude/rules/verification-checklist.md` — 작업 완료 전 검증(A~H)

## 스택 (확정)
- **Next.js 16.2.6 (App Router) + React 19 + React Compiler ON** · **TypeScript** · **Tailwind v4**(`@theme` 토큰) · **npm**
- **아키텍처: FSD(Feature-Sliced Design)** — `app > views > widgets > features > entities > shared`.
- 데이터: **Repository 인터페이스(port) + Supabase 어댑터**(Postgres + Realtime + Auth), localStorage 폴백. 컴포넌트는 entity service만 호출.
- 엑셀: **xlsx(SheetJS)**, admin에서만 dynamic import.
- 테스트: **Vitest + React Testing Library**(유닛·컴포넌트) · **Playwright**(E2E). PDF 규정값 단언, `npm run test` green이 완료 기준.
- 별칭 `@/*` → `src/*`.

## 명령어
| 목적 | 명령 |
|---|---|
| 개발 | `npm run dev` |
| 빌드 | `npm run build` |
| 린트 | `npm run lint` |
| 타입체크 | `npm run typecheck` (`tsc --noEmit`) |
| 테스트 | `npm run test` (Vitest + RTL) |
| 커버리지 | `npm run test:coverage` (**≥80% 유지**) |
| E2E | `npm run test:e2e` (Playwright) |
> 스캐폴드(P1) 전에는 `package.json`이 없어 위 명령은 실행 불가. 구현 후에는 매번 build/lint/typecheck/test를 돌리고 실패 원인을 기록한다.

## 디렉터리 (FSD 레이어 — import는 위→아래만)
- `src/app` — Next App Router 라우팅 + 전역(providers/globals). 라우트는 thin → `views` 조합.
- `src/views` — 페이지 조합(FSD pages; Next 'pages' 라우터 충돌 회피용 명칭).
- `src/widgets` — 독립 합성 블록(Header/Footer/BottomBar/FormModal/PricingCards/ProcessSteps/ReviewMarquee/AdminDashboard…).
- `src/features` — 사용자 상호작용(InquiryForm/ReservationForm/admin-status-control/admin-auth/excel-export).
- `src/entities` — 비즈니스 엔티티(reservation/inquiry/case/pricing-plan/review — model+api+ui).
- `src/shared` — 재사용 기반(ui 키트·lib·config·api·fonts).
- 슬라이스 세그먼트 `ui·model·lib·api·config` + `index.ts`(public API). `public/`=케이스 이미지·로고. 상세 `implementation-plan.md`.

## 디자인 (요약 — 상세 design-system.md)
- **컬러 = WEFLOW 브랜드**(reference 추출, 토스 팔레트 아님): 시그니처 **시안 `#22d3ee`→블루 `#2563eb` 그라디언트**, 다크 네이비 베이스 `#0a0f1e`/표면 `#0f172a`·`#1e293b`, 라이트 텍스트 `#f1f5f9`/뮤트 `#90a1b9`, 프리미엄 앰버 `#f59e0b`→`#d97706`, semantic 성공 `#22c55e`/경고 `#ff8b1a`/위험 `#fb2c36`.
- **구조 = 토스식**: Pretendard(400/500/700), 4px 그리드, 컴포넌트 일관성, 명확한 위계, 모든 인터랙티브에 hover/focus/active.
- **인트로/랜딩/히어로는 화려·예쁘게**: 풀블리드 그라디언트·시안 글로우·fluid 타이포·진입 애니메이션. 콘텐츠/폼/관리자는 정돈.
- **강한 반응형**(모바일=PC 동일 콘텐츠, 잘림/렉 없음) + 부드러운 모션(`prefers-reduced-motion` 존중).
- **색상은 토큰으로만**(hex 하드코딩 금지, `color-guard` 훅 경고). 그라디언트는 §design-system 3종만, 글로우 절제, 5색+ 동시 강조 금지.

## 핵심 규칙
- 🧱 **FSD 준수**: import 방향(app→…→shared)·같은 레이어 직접 import 금지·슬라이스 public API(`index.ts`).
- 🧩 **컴포넌트를 최대한 재사용해 중복 제거(DRY)** — 동일·유사 UI/로직은 즉시 widgets/shared로 추출·import(복사-붙여넣기 금지, 작성 전 기존 것부터 탐색), 콘텐츠는 슬라이스 config/model 분리, **CTA는 실제 경로/링크 연결**, 저장은 entity service/repository 계층 분리, TS 타입 명확.
- 🧪 **항상 PDF를 source of truth로 참조**하고 **테스트코드를 꼼꼼히 작성**(Vitest/RTL/Playwright, PDF 규정값 단언) → `npm run test` green + **커버리지 ≥80%**(`test:coverage`)로 마무리.
- 🔐 시크릿(Supabase 키·관리자 계정)은 ENV(`.env.local`), 커밋 금지.

## Next.js 16 주의
이 버전의 Next.js는 학습 데이터와 API/구조가 다를 수 있다. 코딩 전 `node_modules/next/dist/docs/`의 관련 가이드를 확인하고 deprecation을 따른다. React 19 컴파일러(`reactCompiler:true`)하에서 렌더는 순수하게, side effect는 `useEffect`로.

## 하네스 도구 (.claude)
- **rules/** — 위 5개 규칙 문서.
- **agents/** — `toss-design-reviewer`(디자인 검토), `weflow-qa-verifier`(체크리스트 QA).
- **skills/** — `weflow-new-page`(페이지/섹션 생성), `weflow-verify`(검증).
- **hooks/** — `color-guard.sh`(하드코딩 색상 경고) · `fsd-import-guard.sh`(FSD import 방향 위반 차단) · `secret-guard.sh`(시크릿 하드코딩 차단/경고). `settings.json`의 PostToolUse(Write|Edit)에 연결.
- **settings.json** — 권한 allowlist + 훅 연결.

## 참고 (구조 + 컬러 참고)
참고 레포 `github.com/lmg90219679-eng/weflow-web` / 라이브 `weflow-web.vercel.app`: **구조(FSD스러운 레이어)·콘텐츠·브랜드 컬러를 참고**한다. 누락 페이지(`/diagnosis`, `/admin`, `/cases/[slug]`)·데이터 계층은 신규 구축. 케이스 이미지/로고/favicon은 참고 레포 `public/`에서 이관(P0).
