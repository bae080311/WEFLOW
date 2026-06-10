---
name: weflow-apply-review
description: 현재 PR에 남겨진 리뷰 코멘트(Codex·사람)를 가져와 코드에 반영한다. systemic(재발 가능) 지적은 하네스 담당이라 /codex-flywheel로 넘기고, code-only(이번 PR 버그)만 WEFLOW 하네스 규칙대로 고친 뒤 weflow-verify로 재검증한다. "PR 리뷰 반영해줘 / 리뷰 코멘트 고쳐줘" 류 요청에 매칭.
---

# WEFLOW PR 리뷰 반영

PR 리뷰 코멘트 → **코드 수정**(이번 PR을 실제로 고침). 하네스 수정은 `/codex-flywheel` 담당이며, 이 스킬은 그 코드 짝이다.
기준: `.claude/rules/{coding-rules,design-system,requirements-weflow}.md`. 충돌 시 PDF > requirements > 참고.

> 범용 `apply-pr-comments`와 다른 점: (1) systemic vs code-only **분류·라우팅**, (2) WEFLOW 하네스 규칙 준수, (3) 반영 후 **weflow-verify 재검증**.

인자: 선택 `PR#`, `--commit`(반영 후 커밋까지).

## 절차

### 1. PR + 코멘트 수집
```bash
OR=$(gh repo view --json nameWithOwner -q .nameWithOwner)
PR=${1:-$(gh pr list --head "$(git rev-parse --abbrev-ref HEAD)" --state open --json number -q '.[0].number')}
gh api "/repos/$OR/pulls/$PR/comments"  --paginate -q '[.[]|{id,path,line,body,user:.user.login}]' > /tmp/rv-inline.json
gh api "/repos/$OR/pulls/$PR/reviews"   --paginate -q '[.[]|select(.body!="")|{id,body,user:.user.login}]' > /tmp/rv-reviews.json
gh api "/repos/$OR/issues/$PR/comments" --paginate -q '[.[]|{id,body,user:.user.login}]' > /tmp/rv-issue.json
```
Codex 요약 코멘트의 구조화 블록이 있으면 그대로 신뢰:
```bash
/usr/bin/python3 - <<'PY' > /tmp/rv-codex.json
import re,json
t=open('/tmp/rv-reviews.json').read()+open('/tmp/rv-issue.json').read()
m=re.findall(r'<!--\s*flywheel-findings\r?\n(.*?)\r?\n-->', t, re.S)
print(m[-1] if m else '{"findings":[]}')
PY
```

### 2. 분류 (코멘트마다)
- **systemic** = Codex finding의 `systemic:true`(`class` 보유) 또는 "항상/모든 페이지/규칙상" 류 일반 지적 → **반영하지 않음.** 목록에 모아 `/codex-flywheel` 실행을 제안(하네스가 담당).
- **code-only** = 이번 PR의 국소 버그·오타·로직·특정 파일 수정 요청 → **§3에서 코드 수정.**
- **discussion/question** = 질문·논의 → 수정 없이 요약(필요 시 답글).

### 3. 코드 수정 (code-only만, 하네스 규칙 준수)
PR 브랜치 working tree에서 직접 수정한다. 각 수정은 반드시:
- **색상은 토큰만**(hex 금지), **FSD import 방향**(app→…→shared)·슬라이스 `index.ts` 경유, **CTA 실제 연결**(빈 `#` 금지), **TS 타입 명확**, **DRY**(중복은 공통 컴포넌트), 모바일 패리티 유지.
- 코멘트가 가리키는 `path:line`을 Read로 확인 후 최소 변경. 추측 금지 — 모호하면 discussion으로 분류.
- 한 코멘트가 여러 곳에 영향이면 일관되게 함께 수정.

### 4. 재검증
- `weflow-verify` 스킬(또는 `weflow-qa-verifier` 에이전트)로 변경 범위 점검: 정적(색상/CTA/FSD)·명령(`build/lint/typecheck/test`, 스캐폴드 전이면 N/A).
- 가드 훅(color/fsd/secret)이 깨끗한지 확인. 실패하면 고치고 재검증(우회 금지).

### 5. (선택) 답글 / 커밋
- 반영한 인라인 코멘트에 답글:
```bash
gh api -X POST "/repos/$OR/pulls/$PR/comments/COMMENT_ID/replies" -f body="반영했습니다: <요약> (커밋 SHA)"
```
- `--commit`이면: 브랜치에서 `git add` 후 커밋(메시지 `fix: address PR #PR review`, Co-Authored-By 트레일러). 푸시는 사용자 확인 후. **main 직접 커밋 금지.**

## 출력
- 표: `코멘트 · 분류(code-only/systemic/discussion) · 조치 · 파일:라인`.
- **systemic → /codex-flywheel로 위임** 항목 분리 명시(여기서 안 고침).
- 적용 diff 요약 + weflow-verify 결과. 미반영은 추측 없이 사유와 함께.
