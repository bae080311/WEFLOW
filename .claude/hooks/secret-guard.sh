#!/usr/bin/env bash
# WEFLOW secret guard (PostToolUse: Write|Edit)
# 규칙(coding-rules §21): 시크릿은 ENV(.env.local), 커밋 금지.
# 소스에 Supabase 키/JWT/service_role(고신뢰) → 차단(exit 2). 일반 자격증명 리터럴(중신뢰) → 경고.
# .env*·.claude·node_modules는 제외(.env*는 시크릿을 담는 정상 위치).
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
  */.claude/*|*/node_modules/*|*/.git/*|*.env|*.env.*) exit 0 ;;
esac
case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.json) ;;
  *) exit 0 ;;
esac

/usr/bin/python3 - "$FILE" <<'PY'
import sys, re, json
f = sys.argv[1]
try:
    lines = open(f, encoding='utf-8').read().splitlines()
except Exception:
    sys.exit(0)
ph   = re.compile(r'(process\.env|import\.meta\.env|example|placeholder|xxx|your[-_]|<|changeme|dummy|TODO)', re.I)
jwt  = re.compile(r'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}')
srole = re.compile(r'service[_-]?role', re.I)
cred = re.compile(r'''(password|passwd|secret|api[_-]?key|access[_-]?token|token|credential)\s*[:=]\s*['"][^'"]{4,}['"]''', re.I)
high, med = [], []
for i, l in enumerate(lines, 1):
    if jwt.search(l) or (srole.search(l) and any(len(s) >= 40 for s in re.findall(r'''['"]([^'"]+)['"]''', l))):
        high.append((i, l.strip()[:120]))
    elif cred.search(l) and not ph.search(l):
        med.append((i, l.strip()[:120]))
def show(items):
    return "\n".join(f"   {i}: {t}" for i, t in items)
if high:
    print("🚫 시크릿 하드코딩 의심(JWT/Supabase 키/service_role) — ENV(.env.local)로 옮기고 커밋 금지:", file=sys.stderr)
    print(f"   파일: {f}", file=sys.stderr)
    print(show(high), file=sys.stderr)
    sys.exit(2)
if med:
    msg = "⚠️ 자격증명 하드코딩 의심 — ENV(process.env)로 분리하세요. 파일: %s\n%s" % (f, show(med))
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": msg}}, ensure_ascii=False))
PY
