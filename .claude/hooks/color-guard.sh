#!/usr/bin/env bash
# WEFLOW hardcoded-color guard (PostToolUse: Write|Edit) — 권고(non-blocking)
# WEFLOW 색상 토큰만 사용(design-system.md). 토큰 정의 파일 외에서 hex 색상 리터럴이 보이면 경고.
# 차단하지 않고 additionalContext로 Claude에 알린다.

set -euo pipefail
INPUT="$(cat)"

FILE="$(printf '%s' "$INPUT" | /usr/bin/python3 -c '
import sys, json
try:
    j = json.load(sys.stdin); t = j.get("tool_input", {}) or {}
    print(t.get("file_path") or t.get("path") or "")
except Exception:
    print("")
')"

[ -z "$FILE" ] && exit 0
[ ! -f "$FILE" ] && exit 0

# 토큰 정의처/하네스/메타는 제외.
case "$FILE" in
  */.claude/*|*/node_modules/*|*/.git/*|*globals.css|*tokens.css|*/fonts.ts) exit 0 ;;
esac

# 색상이 들어갈 수 있는 소스만 검사.
case "$FILE" in
  *.ts|*.tsx|*.jsx|*.css) ;;
  *) exit 0 ;;
esac

HITS="$(grep -nE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?\b' "$FILE" 2>/dev/null || true)"

if [ -n "$HITS" ]; then
  MSG="$(printf '⚠️ 하드코딩된 색상(hex)이 감지되었습니다 — WEFLOW 색상 토큰(bg-primary, text-text, bg-surface, 브랜드 그라디언트 헬퍼 등)을 사용하세요. design-system.md 참조.\n파일: %s\n%s' "$FILE" "$HITS")"
  /usr/bin/python3 -c '
import json, sys
msg = sys.argv[1]
print(json.dumps({"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": msg}}, ensure_ascii=False))
' "$MSG"
fi
exit 0
