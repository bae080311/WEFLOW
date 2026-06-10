# WEFLOW 코딩 규칙 (coding rules)

> 이 프로젝트에서 Claude Code가 반드시 따르는 규칙. 작업 전 `requirements-weflow.md`·`design-system.md`·`implementation-plan.md`를 확인한다.

## 프로세스
1. **대규모 변경 전 현재 구조를 먼저 확인**한다(관련 파일/패턴 탐색 후 작업).
2. **한 번에 너무 많은 파일을 무작정 수정하지 않는다.** `implementation-plan.md`의 단계 경계를 지키고, 한 단계 내 응집된 변경만 한다.
3. 구현 후 **`npm run build` + `lint` + `typecheck` + `test`를 실행**한다. 실패 시 **원인과 수정 방향을 기록**하고 고친다(무시·우회 금지).
4. 작업 완료 전 `verification-checklist.md`의 해당 항목을 점검한다.

## 디자인 (WEFLOW 브랜드 + 토스식 구조)
5. **모든 UI는 `design-system.md` 기준**을 따른다. 컬러/비주얼은 **WEFLOW 브랜드**(시안→블루 그라디언트·다크 네이비·앰버 액센트), 구조는 토스식(타이포·간격·일관성).
6. **색상·간격·타이포는 토큰으로만 사용**한다. 컴포넌트에 hex/임의 px **하드코딩 금지**(토큰·브랜드 헬퍼는 `globals.css`에만). `color-guard` 훅이 위반을 경고한다.
7. **Pretendard 전역 적용**, weight 400/500/700만, 타이포 스케일을 토큰으로 관리.
8. **그라디언트는 `design-system.md` 3종(시안→블루/카드/앰버)만**, 글로우는 절제, **5색 이상 동시 강조·임의 다색 그라디언트·아이콘 남발 금지**. 인트로/랜딩/히어로는 화려·예쁘게(그라디언트·글로우·fluid 타이포·진입 애니메이션 적극), 콘텐츠/폼/관리자는 정돈·가독성 우선.
9. **모든 인터랙티브 요소에 hover / focus(-visible) / active 상태**를 구현하고, **강한 반응형**(모바일=PC 동일 콘텐츠, 잘림/렉 없음)을 항상 적용한다.

## 구조 / 아키텍처 (FSD — Feature-Sliced Design)
10. **FSD 레이어를 준수**한다: `app > views > widgets > features > entities > shared`. **import는 위→아래로만**(상위 레이어가 하위만 참조), **같은 레이어 슬라이스끼리 직접 import 금지**(조합은 상위 레이어에서).
    - `app` = Next App Router 라우팅 + 전역(providers/globals). 라우트 파일은 thin → `views` 조합만.
    - `views` = 페이지 조합(FSD pages; Next 'pages' 라우터 충돌 회피용 명칭).
    - `widgets` = 독립 합성 블록(Header/Footer/BottomBar/FormModal/PricingCards/ProcessSteps 등).
    - `features` = 사용자 상호작용(InquiryForm/ReservationForm/admin-status-control/admin-auth/excel-export 등).
    - `entities` = 비즈니스 엔티티(reservation/inquiry/case/pricing-plan/review — model+api+ui).
    - `shared` = 재사용 기반(ui 키트·lib·config·api·fonts).
11. **슬라이스 세그먼트**는 `ui · model · lib · api · config`로 나누고, 외부 노출은 슬라이스 `index.ts`(public API)로만 한다(내부 경로 직접 import 금지).
12. **컴포넌트를 최대한 재사용하여 코드 중복을 없앤다(DRY).** 동일·유사 UI/로직이 2곳 이상 나오면 **즉시 공통 컴포넌트로 추출** → `widgets/`(원자 단위는 `shared/ui`)에 두고 슬라이스 `index.ts`로 import. **복사-붙여넣기 금지.** Landing "퍼오기" 섹션(가격카드·프로세스·후기·진단 체크리스트 등)은 반드시 단일 컴포넌트를 재사용한다(재사용 맵 준수). 새 섹션 작성 전 기존 widgets/shared/entities에 재사용 가능한 것이 있는지 먼저 탐색한다.
13. **콘텐츠 분리**: 긴 텍스트/리스트는 컴포넌트에 하드코딩하지 말고 소유 슬라이스의 `config`/`model`(전역 텍스트·링크·회사정보는 `shared/config`)로 분리 — 추후 수정·CMS 연동 용이.
14. **TypeScript 타입을 명확히** 둔다. 데이터 모델(Reservation/Inquiry/Status/ProjectType)은 해당 `entities/*/model`에 단일 정의, `any` 지양.
15. **저장은 `entities/*/api` + `shared/api` 계층으로 분리**한다. 컴포넌트는 `window.localStorage`/SDK를 직접 만지지 않고 entity service를 호출. 영속은 **Repository 포트(`shared/api`) + 어댑터**(기본 Supabase, 폴백 localStorage)로 두어 **DB 교체가 어댑터 1개 교체**가 되게 한다. 임시 데이터·시드도 service 경유.

## 라우팅 / CTA
16. **라우팅 경로와 CTA는 실제로 연결**한다. 빈 `#`/dead link 금지. 모든 버튼·자세히보기·더보기는 `requirements-weflow.md` §8 라우팅표대로 route/external/modal/tel 연결.
17. 외부 링크는 `requirements-weflow.md` §7 값 그대로, `target="_blank" rel="noopener noreferrer"`.
18. 사용자 제출(예약/무료진단/랜딩/모달)은 **반드시 관리자 페이지에 반영**되게 entity service에 기록한다.

## 모바일
19. **모바일 반응형을 항상 고려**한다. PC와 동일 콘텐츠, 렉/글자·이미지 잘림/가로 스크롤 깨짐 없음. 320~414px 점검. 탭 타깃 ≥44px.

## Next.js 16 주의
20. 본 프로젝트의 Next.js 16은 학습 데이터와 API/구조가 다를 수 있다. 코딩 전 `node_modules/next/dist/docs/`의 관련 가이드를 확인하고 deprecation 경고를 따른다. React 19 컴파일러(`reactCompiler:true`) 하에서 렌더는 순수하게, side effect는 `useEffect`로.

## 테스트 (PDF 기준 — 항상)
22. **모든 작업은 PDF 메뉴얼(`~/Desktop/위플로우+재구성+메뉴얼.hwp (1).pdf`)을 source of truth로 참조**한다. `requirements-weflow.md`는 PDF 요약이며, 값·문구·흐름이 모호하면 **PDF 원본을 확인**한다.
23. **기능 구현 시 테스트코드를 꼼꼼히 작성**한다 — Vitest + React Testing Library(유닛·컴포넌트), Playwright(E2E). 테스트는 **PDF가 규정한 값을 단언**한다: 가격 8카드(정가→할인가), 시간 20슬롯(09:00–18:30/30분·오늘 과거 비활성), 폼 필드/필수·동의, 라우트·CTA 목적지(§8), 상태(대기/진행중/완료)·삭제·상세·엑셀(2시트·한글), 제출→관리자 반영.
24. 테스트는 슬라이스에 **co-locate**(`*.test.ts(x)`), E2E는 `e2e/*.spec.ts`. **`npm run test`가 green이어야 작업을 마무리**한다(완료 기준의 일부). 미작성·실패 상태로 마무리 금지.
25. **테스트 커버리지 80% 이상 유지** — lines·functions·branches·statements 모두 ≥80%를 Vitest `coverage.thresholds`로 강제한다. `npm run test:coverage` 통과가 완료 기준. (대상: `src/{shared,entities,features,widgets,views}/**`. 제외: `*.config.*`, `*.d.ts`, `src/app/**`(thin 라우트), barrel `index.ts`, `e2e/**`.) 임계 미달로 마무리 금지.

## 시크릿
26. Supabase 키·관리자 계정 등 **시크릿은 ENV(.env.local)**로 두고 **커밋 금지**. `.env.example`만 커밋.
