---
name: codex-flywheel
description: Codex가 PR에 남긴 리뷰 코멘트를 읽어 Claude 하네스(.claude)를 계속 조정·수정하는 플라이휠 한 사이클을 실행한다. PR이 준비됐을 때 "플라이휠 돌려줘 / codex 리뷰로 하네스 고쳐줘", 또는 /loop 로 주기 실행할 때 사용. 코드가 아니라 하네스(규칙·체크리스트·훅·에이전트·스킬·CLAUDE.md)를 재발 게이트에 따라 가장 싸게 고친다.
---

# Codex Flywheel — 한 사이클

Codex 리뷰 코멘트 → 하네스 개선. 정책은 항상 `.claude/flywheel/policy.md`, 임계값은 `.claude/flywheel/config.json`을 **읽고** 따른다. 절대 규칙: **자기 기계(`.claude/flywheel/**`, `scripts/codex-flywheel.sh`) 수정 금지**, append-only, 값 재서술 금지, 머지는 사람.

인자: `--auto`(push/PR 확인 생략, /loop용), 선택 `PR#`.

## 절차

### 1. PR 해석
```bash
BR=$(git rev-parse --abbrev-ref HEAD)
PR=${1:-$(gh pr list --head "$BR" --state open --json number -q '.[0].number')}
```
PR이 없고 브랜치가 `chore/harness`면 사용자에게 **dogfood PR 생성**을 제안(`gh pr create --base main --head chore/harness`). 그 외 PR 없으면 중단·보고.

### 2. 드라이버 실행 (Codex 리뷰 게시)
```bash
bash scripts/codex-flywheel.sh "$PR"
```
driver가 `codex exec`로 diff를 리뷰하고 findings를 PR에 게시한다(인라인 best-effort + 권위 요약 코멘트의 `<!-- flywheel-findings ... -->` JSON 블록). 실패하면 로그를 보고 중단.

### 3. 게시된 [codex] findings fetch (= 남겨진 PR 리뷰 코멘트)
```bash
OR=$(gh repo view --json nameWithOwner -q .nameWithOwner)
{ gh api "/repos/$OR/issues/$PR/comments" --paginate -q '.[].body'
  gh api "/repos/$OR/pulls/$PR/reviews"   --paginate -q '.[].body'; } > /tmp/fw-bodies.txt
/usr/bin/python3 - <<'PY' > /tmp/fw-findings.json
import re, json
t = open('/tmp/fw-bodies.txt').read()
m = re.findall(r'<!--\s*flywheel-findings\r?\n(.*?)\r?\n-->', t, re.S)
print(m[-1] if m else '{"findings":[]}')
PY
```
`/tmp/fw-findings.json` = 권위 있는 구조화 findings. 이것이 **이번 사이클 입력**이다.

### 4. ledger 접기 (멱등성 + 재발)
```bash
/usr/bin/python3 - <<'PY'
import json
seen={}; counts={}; wontfix=set()
try: f=open('.claude/flywheel/ledger.jsonl')
except FileNotFoundError: f=[]
for line in f:
    line=line.strip()
    if not line: continue
    r=json.loads(line); st=r.get('status'); fid=r.get('finding_id'); fp=r.get('fingerprint')
    seen[fid]=st
    if st=='rejected': continue
    counts.setdefault(fp,set()).add(fid)
    if st=='wontfix': wontfix.add(fp)
print(json.dumps({'seen':seen,'counts':{k:len(v) for k,v in counts.items()},'wontfix':list(wontfix)}, ensure_ascii=False))
PY
```
- **멱등성**: finding_id가 `seen`에 `applied|rejected|wontfix`로 있으면 SKIP. class fingerprint가 `wontfix`면 SKIP.
- **recurrence** = `counts[fingerprint]`(과거 같은 class의 서로 다른 finding 수). 새 finding은 여기에 자기 자신을 더해 사다리 rung 판단.

### 5. 증류 (finding마다 — policy.md 트리)
`policy.md` §2~§7을 적용해 finding을 **가장 싼 산출물**로 매핑한다. 요약:
- one-off/하네스로 못 막음 → **ledger-only**(`decision:code-only`), 하네스 변경 없음(코드 수정은 `apply-pr-comments`).
- 모호한 규칙 위반 → 소유 `rules/*.md` 줄 명확화.
- 늘 해야 할 점검 누락 → `verification-checklist.md` 줄 추가.
- 기계 탐지 가능 + `recurrence ≥ advisory_hook_at` → **권고 훅 작성**(§6 안전 파이프라인). `≥ blocking_hook_at` → 차단 훅 + settings 연결(**needs_human**).
- 프로세스 갭 → `CLAUDE.md`/관련 skill 줄.
규칙: 건너뛰기 금지, severity는 우선순위만, 신뢰 탐지 불가 class는 텍스트 캡. `config.json:edit_budget_per_run` 초과분은 `deferred`로 기록(다음 사이클).

### 6. 편집 적용 (하네스 브랜치)
```bash
git switch -c "flywheel/harness-update-$(date +%Y%m%d)" 2>/dev/null || git switch "flywheel/harness-update-$(date +%Y%m%d)"
```
- 편집 대상은 `config.json:edit_targets_allow`만, `edit_targets_protect`는 금지(가드 위반 시 그 finding은 `rejected:protected`).
- **append-only**: 파일을 통째로 재작성하지 말고 한 줄/불릿 추가. 각 추가 줄 끝에 `<!-- flywheel:<fp> pr<PR> -->` 태그(중복/추적용). 한국어 산문(규칙/체크리스트), agent/skill은 YAML frontmatter 유지, 훅은 `color-guard.sh` 모양 그대로.
- 추가 전 §4 게이트 D 중복검사: 같은 `fp` 태그가 이미 있으면 줄 추가 대신 recurrence만 올린다.
- **훅을 만들면 §6 안전 파이프라인 필수**: `bash -n`, `fixtures/<hook>/{good,bad}` 작성·실행, `*/.claude/*` 카브아웃 단언, `src/**` 드라이런 오탐 점검. 통과 못 하면 wiring 보류(`needs_human`).
- **needs_human 작업**(차단 훅·settings.json 연결·agent/skill 편집·모순·size cap): 자동 커밋하지 말고 변경안만 준비해 보고에 분리.

### 7. ledger append (finding마다 1줄)
```bash
# 인자 순서: PR FID FP CLASS SEV DECISION ARTIFACT REC STATUS  (모두 실제 값으로)
/usr/bin/python3 - "$PR" "FID" "FP" "CLASS" "SEV" "DECISION" "ARTIFACT" "REC" "STATUS" <<'PY' >> .claude/flywheel/ledger.jsonl
import json, sys
pr,fid,fp,cls,sev,dec,art,rec,st = sys.argv[1:10]
print(json.dumps({"cycle":"PR"+pr,"pr":pr,"finding_id":fid,"fingerprint":fp,
  "class":cls,"severity":sev,"decision":dec,"artifact":art,
  "recurrence":int(rec),"status":st}, ensure_ascii=False))
PY
```
status ∈ `applied|deferred|needs_human|code-only|rejected|wontfix`.

### 8. 커밋 / PR (사람 게이트)
- 자동 적용(텍스트·권고 훅 작성)만 스테이지·커밋. `needs_human`은 제외.
```bash
git add .claude CLAUDE.md
git commit -m "chore(harness): distill codex PR #$PR review into harness

<요약>

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
- `--auto`가 아니면 **push/PR 전에 사용자 확인**. 확인되면:
```bash
git push -u origin HEAD
gh pr view "flywheel/harness-update-$(date +%Y%m%d)" >/dev/null 2>&1 \
  || gh pr create --base main --title "Harness update from Codex review of PR #$PR" \
       --body "$(printf 'Distilled findings into harness.\n\n## Changes\n<table>\n\n## Ledger\n.claude/flywheel/ledger.jsonl\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)')"
```
이미 PR이 있으면 push가 업데이트(재생성 금지 = 멱등).

## 출력
- finding별 표: `class · severity · recurrence · 결정(decision) · 산출물(artifact) · 상태`.
- `deferred`(예산 초과)·`needs_human`(승인 대기) 항목 분리 명시.
- 적용한 정확한 추가 줄 diff 요약, 생성/업데이트한 하네스 PR 링크. 미확인은 추측 없이 사유와 함께.
