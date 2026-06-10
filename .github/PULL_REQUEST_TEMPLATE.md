<!-- 제목 규칙: feat|fix|chore|docs|refactor|test|style: 요약 -->

## 요약
<!-- 무엇을, 왜 바꿨는지 1~3줄 -->

## 관련 이슈
<!-- Closes #00 / Refs #00 -->

## 변경 종류
- [ ] ✨ feat (기능)
- [ ] 🐞 fix (버그)
- [ ] ♻️ refactor (동작 동일, 구조 개선)
- [ ] 🎨 style / design (토큰·반응형·인터랙션)
- [ ] 🧪 test
- [ ] 📝 docs
- [ ] 🔧 chore (하네스·설정·도구)

## 작업 단계
<!-- implementation-plan.md 기준. 예: P6 Pricing -->

## 변경 내용
<!-- 주요 파일/슬라이스별로 -->
-

## 검증 (verification-checklist 기준)
> 스캐폴드(P1) 전이면 명령 항목은 `N/A`로 표기.

- [ ] `npm run build` / `lint` / `typecheck` green
- [ ] `npm run test` green + **커버리지 ≥80%** (`test:coverage`)
- [ ] PDF 규정값 단언 테스트 존재 (가격 8카드·시간 20슬롯·폼 필수/동의·CTA 라우트·상태/엑셀 등 해당 시)
- [ ] **FSD import 방향**(app→views→widgets→features→entities→shared) 위반 0, 슬라이스 `index.ts` 경유
- [ ] **하드코딩 색상(hex) 0** · WEFLOW 브랜드 토큰만 · 그라디언트는 승인된 3종만
- [ ] 모든 CTA 실제 연결(route/external/modal/tel), dead link·데모 링크 0
- [ ] **모바일 패리티**(320·390·414px) — 잘림/가로 스크롤/렉 없음, 탭 타깃 ≥44px
- [ ] Pretendard 적용 · hover/focus-visible/active 상태 구현
- [ ] 시크릿(Supabase 키·관리자 계정) 미노출 (ENV)

## 스크린샷 (UI 변경 시)
| 데스크탑 | 모바일 |
|---|---|
|  |  |

## 리뷰 노트
<!-- 리뷰어가 집중해서 볼 곳, 알려진 한계, 후속 작업 -->
