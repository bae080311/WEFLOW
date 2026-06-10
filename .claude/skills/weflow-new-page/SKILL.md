---
name: weflow-new-page
description: WEFLOW 페이지나 섹션을 하네스 규칙(FSD)대로 새로 만들거나 수정한다. App Router 라우트 추가, views/<page> 페이지 조합, widgets 재사용, 슬라이스 config/model 콘텐츠 분리, CTA 라우팅 연결, WEFLOW 브랜드 토큰·Pretendard·반응형 적용이 필요할 때 사용. "페이지 만들어줘 / 섹션 추가 / 라우트 추가" 류 요청에 매칭.
---

# WEFLOW 페이지/섹션 생성

WEFLOW의 페이지·섹션을 **하네스 규칙(FSD)** 에 맞게 만든다. 새 코드를 짜기 전에 항상 기존 widgets/shared/entities를 먼저 찾아 재사용한다.

## 먼저 읽기
- `.claude/rules/requirements-weflow.md` — 해당 페이지의 필수 섹션·CTA·라우팅(§8)·폼 모델
- `.claude/rules/design-system.md` — 토큰/컴포넌트 variant
- `.claude/rules/implementation-plan.md` — FSD 폴더 구조·재사용 맵·해당 단계
- `.claude/rules/coding-rules.md` — 전 규칙(FSD import 방향 포함)

## 절차
1. **요구 확인**: requirements §3에서 대상 페이지의 섹션 목록·CTA·데이터를 추출.
2. **재사용 탐색**: `src/widgets`, `src/shared/ui`, `src/entities`에서 이미 있는 것(PricingCards/ProcessSteps/ReviewMarquee/InquiryForm 등) 확인 → **복사 금지, 슬라이스 `index.ts`로 import**.
3. **구성/콘텐츠 분리**: 텍스트·리스트는 소유 슬라이스의 `config`/`model`(전역 텍스트·링크·회사정보는 `shared/config`)에, 페이지 UI는 `src/views/<page>/ui/*`에, 라우트는 `src/app/<route>/page.tsx`(thin)에서 `views` 조합.
4. **디자인**: WEFLOW 브랜드 토큰만 사용(hex 금지), `shared/ui`(Button/Card/Chip 등) 사용, hover/focus/active 구현, 그라디언트는 브랜드 3종만·글로우 절제. 인트로/랜딩/히어로는 화려·예쁘게, 콘텐츠/폼은 정돈.
5. **CTA 연결**: §8 라우팅표대로 route/external/modal/tel 실제 연결. dead link·데모 링크 금지.
6. **모바일**: 반응형 분기(스택/가로스크롤/inline). 320~414px 점검.
7. **데이터 제출**(폼 페이지면): entity service(`entities/reservation/api`·`entities/inquiry/api`) 경유 → 관리자 반영.
8. **테스트 작성(PDF 기준)**: 새 컴포넌트/로직마다 co-located `*.test.ts(x)`를 꼼꼼히 작성하고, PDF가 규정한 값(가격·슬롯·필드·라우트·상태)을 단언. 폼/라우팅은 RTL/Playwright로.
9. **검증**: `npm run lint && npm run typecheck && npm run test && npm run build` 모두 green. 디자인은 `toss-design-reviewer`, 종합 QA는 `weflow-qa-verifier` 에이전트로 점검.
10. **FSD 준수**: import는 위→아래(app→views→widgets→features→entities→shared)만, 같은 레이어 직접 import 금지.

## 하드 룰
- 🚫 그라디언트·과도한 그림자·하드코딩 색상 금지. ✅ TS 타입 명확, 공통 UI 컴포넌트화, FSD 레이어 준수.
