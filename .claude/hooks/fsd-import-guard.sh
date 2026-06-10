#!/usr/bin/env bash
# WEFLOW FSD import-direction guard (PostToolUse: Write|Edit)
# 규칙(coding-rules §10): import는 위→아래만 — app > views > widgets > features > entities > shared.
# 편집 파일이 자기보다 '상위' 레이어를 import하면 차단(exit 2)하고 Claude에 피드백한다.
# 별칭 `@/<layer>/...` import만 검사(프로젝트 규칙: `@/*`→`src/*`). 슬라이스 내부 상대경로는 무시.
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
case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx) ;;
  *) exit 0 ;;
esac
case "$FILE" in
  */src/*) ;;
  *) exit 0 ;;
esac

/usr/bin/python3 - "$FILE" <<'PY'
import sys, re
f = sys.argv[1]
rank = {'shared': 0, 'entities': 1, 'features': 2, 'widgets': 3, 'views': 4, 'app': 5}
m = re.search(r'/src/([^/]+)/', f)
if not m or m.group(1) not in rank:
    sys.exit(0)
cur = m.group(1)
try:
    src = open(f, encoding='utf-8').read()
except Exception:
    sys.exit(0)
# `from '@/<layer>'`, `import '@/<layer>'`, `import('@/<layer>')`
specs = re.findall(r'''(?:from|import)\s*\(?\s*['"]@/([^/'"]+)''', src)
viol = sorted({l for l in specs if l in rank and rank[l] > rank[cur]})
if viol:
    print(f"🚫 FSD import 방향 위반: '{cur}' 레이어 파일이 상위 레이어({', '.join(viol)})를 import했습니다.", file=sys.stderr)
    print(f"   파일: {f}", file=sys.stderr)
    print("   허용 방향: app > views > widgets > features > entities > shared (위→아래만).", file=sys.stderr)
    print("   → 공통 로직은 하위 레이어로 내리거나, 조합은 상위 레이어에서 하세요.", file=sys.stderr)
    sys.exit(2)
PY
