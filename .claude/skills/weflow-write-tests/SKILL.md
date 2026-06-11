---
name: weflow-write-tests
description: WEFLOW 코드에 하네스 규칙대로 테스트를 작성한다. Vitest+RTL(유닛·컴포넌트)·Playwright(E2E)로 co-locate, PDF 규정값(가격 8카드·시간 20슬롯·폼 필드/동의·CTA 라우트·상태/엑셀)을 단언하고 커버리지 ≥80%를 맞춘다. "테스트 작성해줘 / 테스트 짜줘 / 커버리지 올려줘 / 이 컴포넌트 테스트" 류 요청에 매칭.
---

# WEFLOW 테스트 작성

코드(컴포넌트/유틸/엔티티/위젯/폼/라우팅)에 **PDF를 source of truth로 한** 테스트를 꼼꼼히 작성한다. `npm run test` green + 커버리지 ≥80%가 완료 기준(coding-rules §22~25).

## 먼저 읽기
- `.claude/rules/coding-rules.md` §22~25 — 테스트 규칙(PDF 단언·co-locate·green·커버리지 80)
- `.claude/rules/implementation-plan.md` "테스트 전략" — 단계별 무엇을 단언할지(20슬롯·8카드·폼·라우팅·admin·엑셀)
- `.claude/rules/requirements-weflow.md` — 단언할 **정확값**(§5 가격, §3-5 시간 그리드, §8 CTA, §9 폼 모델)
- 대상 코드의 실제 export/props (추측 금지, 먼저 읽기)

## 프로젝트 테스트 규약 (반드시 준수)
- **프레임워크/위치**: Vitest + React Testing Library(jsdom) 유닛·컴포넌트는 슬라이스에 **co-locate**(`Foo.tsx` → `Foo.test.tsx`). E2E는 `e2e/*.spec.ts`(Playwright). 설정: `vitest.config.ts`(include `src/**`), `vitest.setup.ts`, `playwright.config.ts`.
- **`css: false`** 환경이다 → 계산된 색상/픽셀을 단언하지 말고 **클래스 문자열(`toHaveClass`/`className.toContain`)·role·동작·접근성**을 단언한다.
- **Next mock은 `vitest.setup.ts`에 이미 있음**: `next/link`(→`<a>`, props 통과)·`next/navigation`(`usePathname`=`vi.fn(()=>"/")`, `useRouter`/`useSearchParams`)·`next/image`(→`<img>`). 라우트별 active 테스트는 `vi.mocked(usePathname).mockReturnValue("/x")`로 덮어쓴다.
- **쿼리 우선순위**: `getByRole`(name) > `getByLabelText`(폼) > `getByText`. 중복 매칭은 `within(container)`로 스코프. 링크는 `getByRole("link",{name}).toHaveAttribute("href", ...)`.
- **상호작용**: `userEvent`(click/type/selectOptions/keyboard). 키보드 트랩/Esc 등 핸들러 검증은 `fireEvent.keyDown(document, {key})`로 결정적으로.
- **React 19(컴파일러 ON)**: 렌더 순수, 부수효과는 `useEffect`. 모달/드로어는 portal·focus trap을 RTL로(`role="dialog"`, Esc 닫힘, backdrop 클릭, `document.body.style.overflow`). 테스트 환경엔 컴파일러 미적용이므로 effect 정합성을 컴파일러에 의존하지 말 것(콜백은 ref/`useCallback`로 안정화 가정).
- **클린업**: body 스타일·전역을 만지는 테스트는 `afterEach`로 복원. mock은 `beforeEach`에서 리셋.
- **타입**: `any` 금지. 픽스처는 실제 모델 타입을 import.

## 무엇을 단언하나 (PDF 규정값 — 항상)
- **가격 8카드**: 정가→할인가 정확(498000→249000 / 1,980,000→990,000 / 2,980,000→1,490,000 / 170,000→89,000~ / 378,000~→189,000~ / 678,000~→339,000~ / 298,000→149,000~ / 158,000→79,000~), 그룹 수(제작3·케어3·광고2), 크라운=MASTER·WEFLOW CARE.
- **시간 그리드**: 09:00–18:30 30분 = **20슬롯(5×4)**, 오늘이면 현재 시각 이전 비활성, 직접입력 ↔ 그리드 상호배타.
- **폼**: 필수(이름·연락처·제작종류·업종·동의 true), 라벨↔컨트롤 연결, `aria-invalid`/`describedby`, 제출 시 service 호출. 제작종류 4옵션·placeholder 기본 선택(required 유효).
- **CTA/라우팅(§8)**: 목적지 정확, dead `#`·외부 데모 링크 0, 외부는 `target=_blank rel=noopener`. 케이스 자세히보기=내부 `/cases/[slug]`.
- **상태/엑셀(admin)**: 기본 상태=대기, 완료/진행중/삭제 반영, 탭 필터, 엑셀 2시트(예약·문의) 한글.
- **제출→관리자 반영**: 제출이 entity service에 기록되는지(E2E면 관리자 노출까지).
- **콘텐츠 금지**: 의료/병원 문구·이미지 없음(denylist 단언).

## 절차
1. 대상 코드의 export/props/분기를 읽고, requirements에서 해당 **정확값**을 추출.
2. co-located `*.test.tsx` 작성: 렌더 → 핵심 분기/variant → a11y → 상호작용 → PDF값 단언.
3. 미커버 분기(에러·빈 배열·경계) 추가로 ≥80% 확보. 공통 유틸/훅(`useFocusTrap` 등)은 별도 결정적 테스트.
4. `npx vitest run <경로>`로 빠르게 확인 → 전체 `npm run test` → `npm run test:coverage`(lines/functions/branches/statements ≥80).
5. green + 임계 통과로 마무리. 미작성·실패·임계 미달로 끝내지 말 것.

## 하드 룰
- ✅ PDF 규정값 단언 · co-locate · 커버리지 ≥80% · `css:false`에 맞는 단언.
- 🚫 계산 스타일 단언, `any`, 추측 props, mock 누락(Next 모듈은 setup mock 사용), 스냅샷 남발.
