# Codex Flywheel

Codex가 PR을 리뷰하고 코멘트를 남기면, 그 **남겨진 PR 리뷰 코멘트**를 읽어서 단순 코드 수정이 아니라
**Claude Code 하네스(`.claude/`) 자체를 계속 조정·수정**한다. 같은 *종류*의 지적이 다음 PR에서 안 나오게
하네스(규칙·체크리스트·훅·에이전트·스킬·CLAUDE.md)를 키운다 → 사이클마다 하네스가 똑똑해진다(flywheel).

```
Claude Code PR ─► [driver] codex exec ─► 구조화 findings ─► gh 로 PR에 코멘트 게시
                                                                  │
   [skill /codex-flywheel] PR의 [codex] 코멘트 fetch ◄────────────┘
        │ ledger 접어 재발/멱등 계산 → policy.md로 가장 싼 산출물 결정
        │ flywheel/harness-update-<date> 에 편집 + ledger.jsonl append
        ▼
   하네스 PR open/update ─► 사람 리뷰/머지 ─► 다음 사이클 더 똑똑한 하네스
```

## 구성요소
| 경로 | 역할 |
|---|---|
| `scripts/codex-flywheel.sh` | **muscle.** `codex exec --output-schema`로 PR diff를 리뷰하고 findings를 PR에 게시(인라인 best-effort + 권위 있는 요약 코멘트의 `<!-- flywheel-findings ... -->` JSON 블록). 하네스는 절대 안 고침. |
| `.claude/skills/codex-flywheel/SKILL.md` | **brain.** 게시된 코멘트를 fetch→증류→편집→ledger→PR. `/codex-flywheel`, `/loop`로 구동. |
| `.claude/flywheel/policy.md` | 의사결정 트리·재발 게이트·승격 사다리·안전 파이프라인·자동/사람 매트릭스. |
| `.claude/flywheel/config.json` | 임계값(권고 훅 ≥3, 차단 훅 ≥5), 편집 예산, 브랜치 프리픽스, 편집 허용/보호 경로. |
| `.claude/flywheel/schema.json` | `codex exec`가 따라야 할 findings JSON 스키마. |
| `.claude/flywheel/rubric.md` | Codex에 주는 리뷰 지침(WEFLOW 규칙 기준으로만 판단). |
| `.claude/flywheel/ledger.jsonl` | append-only. finding별 1줄. 멱등성(`finding_id`)·재발(`fingerprint`) 원천. |
| `.claude/flywheel/fixtures/` | 승격된 훅의 good/bad 픽스처(연결 전 게이트). |

## 실행
```bash
# 0) 드라이런 — PR 없이 HEAD vs main 리뷰, 게시 안 함(스모크/검증용)
scripts/codex-flywheel.sh --dry-run

# 1) 한 사이클(온디맨드): 현재 브랜치의 열린 PR을 리뷰·게시 → 하네스로 증류
/codex-flywheel              # 스킬(권위 흐름). 내부에서 driver를 호출.
scripts/codex-flywheel.sh 42 # driver만: PR #42에 코멘트 게시까지

# 2) 반복(로컬, 권장): 30분마다 한 사이클
/loop 30m /codex-flywheel
#   스킬에 --auto 를 주면 push/PR 단계의 확인을 건너뛴다(무인 루프용).
```

## 스케줄/CI
- **로컬 우선(권장).** Codex는 `~/.codex`(로그인 계정)로 인증된다. CI에선 `OPENAI_API_KEY` 시크릿과 헤드리스 Claude 러너가 필요해 마찰이 크다. 하네스 PR은 어차피 사람 리뷰용이라 로컬 트리거로 손해가 없다.
- **선택: GitHub Actions(미배포 스케치).** `on: pull_request_review` → codex 설치 → `OPENAI_API_KEY` → `scripts/codex-flywheel.sh ${{ github.event.pull_request.number }}`. brain(스킬) 단계는 헤드리스 Claude 러너가 생기면 추가.

## 계보
PR 코멘트 fetch 패턴은 사용자 레벨 `/apply-pr-comments`와 동일하다(`gh pr list --head`, `gh api /pulls/{n}/comments`·`/reviews`). 다른 점: `apply-pr-comments`는 *코드*를 고치고, flywheel은 *하네스*를 고친다.

## 안전(요약 — 상세는 policy.md)
자기 기계 수정 금지 · append-only · 값 재서술 금지 · 가장 싼 수정 우선 · 훅은 재발 시에만(픽스처/`bash -n`/카브아웃 게이트) · 차단 훅·settings 연결·agent/skill 편집은 사람 승인 · 머지는 항상 사람.
