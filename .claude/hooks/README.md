# .claude/hooks

`settings.json`의 `hooks.PostToolUse`(matcher `Write|Edit`)에 연결되는 가드 스크립트.
편집 대상 파일 경로를 stdin JSON에서 읽어 검사한다. 하네스 문서(`.claude/`)·`CLAUDE.md`·`README.md`·`.env*`·`node_modules`는 제외한다.

| 스크립트 | 역할 | 동작 |
|---|---|---|
| `color-guard.sh` | 토큰 정의처 외의 하드코딩 hex 색상 검출 | **권고**(exit 0 + additionalContext) — WEFLOW 토큰 사용 안내 |

- 실행권한 필요: `chmod +x .claude/hooks/*.sh`.
- JSON 파싱은 `/usr/bin/python3`(macOS 기본) 사용.
- 훅은 세션 시작 시 로드된다. `settings.json` 수정 후에는 세션 재시작 또는 `/hooks`로 재적용.
