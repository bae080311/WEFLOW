# .claude/hooks

`settings.json`의 `hooks.PostToolUse`(matcher `Write|Edit`)에 연결되는 가드 스크립트.
편집 대상 파일 경로를 stdin JSON에서 읽어 검사한다. 하네스 문서(`.claude/`)·`CLAUDE.md`·`README.md`·`.env*`·`node_modules`는 제외한다.

| 스크립트 | 역할 | 동작 |
|---|---|---|
| `color-guard.sh` | 토큰 정의처 외의 하드코딩 hex 색상 검출 | **권고**(exit 0 + additionalContext) — WEFLOW 토큰 사용 안내 |
| `fsd-import-guard.sh` | FSD import 방향 위반(상위 레이어 import) 검출 (`@/<layer>` 별칭 기준) | **차단**(exit 2) — coding-rules §10 |
| `secret-guard.sh` | Supabase 키/JWT/service_role(고신뢰)·하드코딩 자격증명(중신뢰) 검출 | 고신뢰 **차단**(exit 2) / 중신뢰 **권고**(exit 0) — coding-rules §21 |

> 선택(요청 시 추가 가능): 편집 파일 `eslint --fix`/`prettier` 자동 적용(PostToolUse), 턴 종료 시 `build/lint/typecheck` 게이트(Stop 훅). 스캐폴드(P1) 이후 의미 있음.

- 실행권한 필요: `chmod +x .claude/hooks/*.sh`.
- JSON 파싱은 `/usr/bin/python3`(macOS 기본) 사용.
- 훅은 세션 시작 시 로드된다. `settings.json` 수정 후에는 세션 재시작 또는 `/hooks`로 재적용.
