---
name: weflow-verify
description: WEFLOW 작업 결과를 검증 체크리스트로 점검한다. 한 단계 구현 완료 후 또는 PR/배포 전에 CTA 동작, 폼→관리자 반영, 모바일 패리티, 엑셀, 디자인 토큰/Pretendard, build/lint/typecheck를 확인할 때 사용. "검증해줘 / QA / 체크리스트 돌려줘" 류 요청에 매칭.
---

# WEFLOW 검증

`.claude/rules/verification-checklist.md`를 기준으로 현재 작업을 점검한다.

## 절차
1. **범위 결정**: 전체 QA인지, 특정 페이지/기능(예약·관리자·랜딩 등)인지 파악 → 해당 체크리스트 섹션 선별.
2. **정적 검증(grep/read)**:
   - 디자인(G): `grep -rnE '#[0-9a-fA-F]{3,8}' src | grep -v globals.css` → 0; `grep -rni 'gradient' src` → 0; Pretendard 적용; hover/focus/active.
   - CTA(B): 모든 버튼/링크가 실제 route/external/modal/tel(빈 `#`·데모 링크 금지).
   - 폼/관리자(D/E): 필드·검증·컬럼·상태버튼·상세·탭·엑셀.
3. **명령 검증(F)**: `npm run build && npm run lint && npm run typecheck && npm run test && npm run test:coverage`(+E2E 단계면 `npm run test:e2e`). PDF 규정값 단언 테스트 존재·green + **커버리지 ≥80%** 확인. (스캐폴드 전이면 N/A.)
4. **데이터 영속(H)**: 제출이 entity service→Supabase로 기록되고 배포/다른 기기에서 관리자에 반영되는지(코드 경로 + 가능 시 실행).
5. **세부 감사 위임**: 디자인은 `toss-design-reviewer`, 종합은 `weflow-qa-verifier` 에이전트 활용.

## 출력
- 체크리스트 항목별 ✅/❌/➖ → 실패 상세(`파일:라인`, 원인, 수정 방향) → 실행 명령·결과. 미확인 항목은 추측 없이 사유와 함께 표기.
