# Codex Flywheel 정책 (distillation policy)

> `/codex-flywheel` 스킬이 **매 실행마다 읽는** 규칙. Codex가 PR에 남긴 리뷰 코멘트(finding)를
> "가장 싼 지속적 수정"으로 하네스에 반영하는 의사결정 트리 + 재발 게이트 + 안전장치다.
> 임계값/경로는 `config.json`에서 읽는다. 충돌 시 우선순위: 이 정책 > 추측.

---

## 0. 절대 규칙 (먼저)
- **자기 기계는 절대 수정 금지.** `config.json:edit_targets_protect`(`.claude/flywheel/**`, `scripts/codex-flywheel.sh`)는 finding 대상이어도 건드리지 않는다.
- **유효 수정 대상**은 `config.json:edit_targets_allow`뿐: `.claude/rules/*`, `verification-checklist.md`, `.claude/agents/*`, `.claude/skills/*`, `.claude/hooks/*`, `.claude/settings.json`, `CLAUDE.md`.
- **값은 재서술 금지.** 가격/슬롯/링크 등 수치는 PDF·`requirements §5/§7/§8`을 *가리키게* 한다(중복 정의 금지).
- **append-only.** 규칙 파일을 통째로 다시 쓰지 않는다. 한 줄/한 불릿을 추가하고 끝에 `<!-- flywheel:<fp> pr<N> -->` 태그를 단다.
- **사람이 머지를 게이트한다.** 모든 변경은 `flywheel/harness-update-<date>` 브랜치 + PR로만 나간다(직접 main 금지).

---

## 1. 게이트 A — 멱등성 (idempotency)
finding의 `finding_id`가 ledger에 이미 `applied|rejected|wontfix`로 있으면 → **SKIP**.
`class`가 `wontfix`로 동결돼 있으면 → **SKIP**(재론 금지).
그 외에는 `fingerprint`(= class 단위)로 ledger를 접어 `recurrence`(같은 class의 과거 비거부 finding 수)를 구한다.

## 2. 게이트 B — 시스템적 vs 일회성
- **systemic = true** 조건(하나라도): finding이 기존 규칙을 명시적으로 위반 / "항상·모든·전반" 류 일반화 가능 / 다른 파일에서도 재현 가능 / Codex가 `systemic:true` 또는 `harness_hint`에 규칙·`harness-gap` 표기. → **§3으로**.
- **one-off**(국소 로직 버그·오타·단일 카피 교정 등 하네스로 못 막는 것): **ledger-only**로 기록(`decision:code-only`), 하네스는 건드리지 않는다. 코드 수정은 `apply-pr-comments`에 위임.

## 3. 게이트 C — 어떤 하네스 산출물? (싼 것부터, 위→아래 첫 매치)
| finding 신호 | 첫 발생 (가장 싼 지속 수정) | 재발 시 (recurrence↑) |
|---|---|---|
| 규칙은 있는데 모호해 위반 발생 | 소유 `rules/*.md`의 해당 줄을 **명확화**(불릿 추가) | `verification-checklist.md`에 **결정적 점검 줄** 추가 |
| 리뷰어가 늘 해야 하는데 체크리스트에 없음 | `verification-checklist.md` **줄 추가** | 해당 **agent** 절차에 추가(`weflow-qa-verifier`/`toss-design-reviewer`) |
| 소스에서 **기계적으로 탐지 가능**(hex·FSD import·secret·dead `#` 링크·테스트 파일 누락) | 체크리스트 줄 + agent 메모 | `recurrence≥advisory_hook_at` → **권고 훅**(exit 0); `≥blocking_hook_at` → **차단 훅 + settings.json 연결**(사람 승인) |
| 워크플로/프로세스 갭(예: 타입 고치기 전 빌드 먼저) | `CLAUDE.md` 프로세스 또는 관련 **skill**에 줄 추가 | 동일 강화, 필요 시 Stop 훅 |
| 하네스로 못 막는 일회성/질문 | **ledger-only**(수정 없음) | 게이트 넘으면 승격 |

원칙: **건너뛰기 금지**(체크리스트 → 규칙 불릿 → 권고 훅 → 차단 훅 순). **severity는 우선순위만 올리고 자동화 레벨은 못 올린다.** DRY 취향·반응형 감각·Next.js16 뉘앙스처럼 **신뢰성 있게 기계 탐지 불가**한 class는 영구히 텍스트에 캡(훅 승격 금지).

## 4. 게이트 D — 충돌/중복 사전점검
추가 전 유사도 검사(대상 파일에서 같은 `fp` 태그/유사 문장). 근접 중복이면 줄을 추가하지 말고 **recurrence만 올린다**. 기존 규칙과 모순되면 → `needs_human`(자동 해소 금지). 파일이 size cap을 넘으면 → `needs_human "consolidate"`.

---

## 5. 재발 게이트 + 승격 사다리 (정확히)
- **class key / fingerprint**: 같은 종류 이슈는 같은 `class` 슬러그(드라이버가 `fingerprint = sha1("class:"+class)[:8]`로 고정). 파일/값이 달라도 같은 class면 같은 재발로 센다.
- **recurrence**: ledger에서 같은 fingerprint의 **서로 다른 finding_id**(비거부) 개수.
- **사다리**: rung0 체크리스트 줄/규칙 불릿(count 1) → rung1 규칙 불릿(count 2) → rung2 **권고 훅**(count ≥ `advisory_hook_at`, *기계 탐지 가능할 때만*) → rung3 **차단 훅**(count ≥ `blocking_hook_at` **그리고** 권고 훅이 실제 true-positive·무 false-positive 입증, 사람 승인).
- **수렴 점검**: 차단 훅이 이미 있는데도 recurrence가 계속 오르면 → 새 산출물 만들지 말고 `needs_human "hook ineffective"`.

## 6. 훅 생성 안전 파이프라인 (훅을 만들/고칠 때 필수)
승격으로 훅을 쓸 때 settings.json에 연결하기 **전에** 모두 통과해야 한다:
1. 기존 훅 모양 그대로: `#!/usr/bin/env bash` + `set -euo pipefail` + stdin을 `/usr/bin/python3`로 파싱 + `*/.claude/*|*/node_modules/*|*/.git/*` 카브아웃 + 권고는 `exit 0`(+`hookSpecificOutput.additionalContext`), 차단은 `exit 2`(stderr). **bash 3.2 안전**(mapfile/`declare -A`/`${x^^}` 금지).
2. `bash -n <hook>` 구문 통과.
3. `fixtures/<hook>/good.*`(통과: exit 0·무출력)·`bad.*`(의도 신호: 권고 JSON 파싱 가능 / 차단 exit 2) 작성·실행해 기대대로 동작.
4. 카브아웃 존재 단언 + `src/**` 드라이런에서 ~20% 초과 오탐이면 거부.
5. 권고 훅 *작성*까지만 자동, **settings.json 연결과 권고→차단 승격은 사람 승인**(`needs_human`).

## 7. 자동 vs 사람 승인
- **자동 적용(브랜치 커밋)**: 체크리스트 줄·규칙 불릿·CLAUDE.md 메모·**권고 훅 작성**(미연결).
- **`needs_human`(커밋 전 확인)**: `config.json:human_gated_actions` — 차단 훅, settings.json 연결, agent/skill 편집, 모순, size cap 초과.
- 어느 경우든 **머지는 항상 사람**. PR 본문에 fingerprint·recurrence·rung·추가한 정확한 텍스트·fixture 결과를 적는다.

---

## 8. 워크드 예시 (finding → 정확한 하네스 편집)
- **E1** footer `href="#"` (dead-link, 첫 발생) → `verification-checklist.md` B에 점검 줄 1개.
- **E2** dead-link class가 count 3 → 권고 훅 `cta-deadlink-guard.sh`(color-guard 모양), fixtures 동반.
- **E3** `entities`가 상대경로로 `features` import (fsd-import, count 3) → `fsd-import-guard.sh` 확장(사람 승인).
- **E4** 가격 카드 복붙(dup-component, DRY) → 규칙 불릿만(`coding-rules §12`). 훅 승격 금지(신뢰 탐지 불가).
- **E5** 카드 1개 라벨 오타(one-off) → code-only, 하네스 변경 없음.
- **E6** 소스에 `service_role` 키(hardcoded-secret, high) → `secret-guard.sh` 정규식 강화(사람 승인·차단) + 즉시 체크리스트 H 줄.
