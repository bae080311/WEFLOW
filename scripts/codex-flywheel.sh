#!/usr/bin/env bash
# Codex Flywheel — driver (the "muscle").
# Runs a Codex review of a PR via `codex exec --output-schema`, then posts the
# structured findings back to the PR:
#   - best-effort inline review comments (one per finding with path+line)
#   - one authoritative summary comment carrying an embedded JSON block that the
#     /codex-flywheel skill parses (<!-- flywheel-findings ... -->)
# This script NEVER edits the harness — distillation is the skill's job.
# bash 3.2-safe (no mapfile / associative arrays / ${x^^}). JSON via /usr/bin/python3.
#
# Usage:
#   scripts/codex-flywheel.sh [PR_NUMBER]      # review the PR (resolve from branch if omitted), post comments
#   scripts/codex-flywheel.sh --dry-run        # review HEAD vs base, print findings, post NOTHING (no PR needed)
#   scripts/codex-flywheel.sh --base <branch> [PR]   # override base branch
# Env: FLYWHEEL_DRY_RUN=1 forces dry-run.
set -euo pipefail

PY=/usr/bin/python3
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
FW="$ROOT/.claude/flywheel"
SCHEMA="$FW/schema.json"
RUBRIC="$FW/rubric.md"
CONFIG="$FW/config.json"

DRY="${FLYWHEEL_DRY_RUN:-0}"
PR=""
BASE_OVERRIDE=""

# --- arg parse (simple, order-independent) ---
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY=1 ;;
    --base) shift; BASE_OVERRIDE="${1:-}" ;;
    -h|--help) sed -n '2,16p' "$0"; exit 0 ;;
    *) PR="$1" ;;
  esac
  shift
done

log() { printf 'flywheel: %s\n' "$1" >&2; }
need() { command -v "$1" >/dev/null 2>&1 || { log "missing dependency: $1"; exit 2; }; }
need codex; need gh; need git
[ -f "$SCHEMA" ] || { log "missing $SCHEMA"; exit 2; }
[ -f "$RUBRIC" ] || { log "missing $RUBRIC"; exit 2; }

# --- read config into shell vars (with defaults) ---
eval "$(
"$PY" - "$CONFIG" <<'PY'
import json, sys
try:
    c = json.load(open(sys.argv[1]))
except Exception:
    c = {}
def g(k, d): return str(c.get(k, d))
print("MARKER=%r" % g("comment_marker", "[codex]"))
print("EFFORT=%r" % g("model_reasoning_effort", "high"))
print("DIFFCAP=%r" % g("diff_char_cap", "120000"))
PY
)"

# --- resolve repo / branch / base / PR ---
BR="$(git -C "$ROOT" rev-parse --abbrev-ref HEAD)"
OWNER_REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"

if [ "$DRY" != "1" ]; then
  if [ -z "$PR" ]; then
    PR="$(gh pr list --head "$BR" --state open --json number -q '.[0].number' 2>/dev/null || true)"
  fi
  [ -z "$PR" ] && { log "no open PR for branch '$BR' — create one or pass PR# (or use --dry-run)"; exit 3; }
  BASE="${BASE_OVERRIDE:-$(gh pr view "$PR" --json baseRefName -q .baseRefName)}"
  HEAD_SHA="$(gh pr view "$PR" --json headRefOid -q .headRefOid)"
else
  PR="${PR:-0}"
  BASE="${BASE_OVERRIDE:-main}"
  HEAD_SHA="$(git -C "$ROOT" rev-parse HEAD)"
fi

# --- compute the diff (base...head, merge-base form) ---
git -C "$ROOT" fetch -q origin "$BASE" 2>/dev/null || true
DIFF="$(git -C "$ROOT" diff "origin/$BASE...HEAD" 2>/dev/null || git -C "$ROOT" diff "$BASE...HEAD" 2>/dev/null || true)"
if [ -z "$DIFF" ]; then
  log "empty diff for $BASE...HEAD — nothing to review"; exit 0
fi
DIFF="$(printf '%s' "$DIFF" | head -c "$DIFFCAP")"

# --- build prompt (rubric + PR meta + diff) and run codex ---
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
PROMPT="$TMP/prompt.txt"
OUT="$TMP/findings.json"
CODEXLOG="$TMP/codex.log"

{
  cat "$RUBRIC"
  printf '\n\n## This PR\n- repo: %s\n- pr: %s\n- range: %s...HEAD\n\n' "$OWNER_REPO" "$PR" "$BASE"
  printf 'Read .claude/rules/*.md and CLAUDE.md for the standards, then review ONLY the diff below.\n\n## DIFF\n```diff\n%s\n```\n' "$DIFF"
} > "$PROMPT"

log "running codex review of PR #$PR ($BASE...HEAD), effort=$EFFORT ..."
if ! codex exec -C "$ROOT" -s read-only \
      --output-schema "$SCHEMA" \
      -o "$OUT" \
      -c model_reasoning_effort="$EFFORT" \
      - < "$PROMPT" >"$CODEXLOG" 2>&1; then
  log "codex exec failed:"; tail -n 20 "$CODEXLOG" >&2; exit 4
fi
[ -f "$OUT" ] || { log "codex produced no output file"; tail -n 20 "$CODEXLOG" >&2; exit 4; }

# --- enrich findings, post inline (unless dry), emit summary.md ---
SUMMARY="$TMP/summary.md"
"$PY" - "$OUT" "$PR" "$MARKER" "$OWNER_REPO" "$HEAD_SHA" "$DRY" <<'PY' > "$SUMMARY"
import json, sys, hashlib, subprocess
out, pr, marker, repo, head, dry = sys.argv[1:7]
try:
    data = json.load(open(out))
except Exception:
    data = {}
findings = data.get("findings", []) or []

def finding_id(f):
    s = "%s|%s|%s|%s|%s" % (pr, f.get("class",""), f.get("path",""), f.get("line",""), f.get("title",""))
    return hashlib.sha1(s.encode("utf-8")).hexdigest()[:12]

def fingerprint(f):  # class-level: same class recurring across files/PRs collapses here
    return hashlib.sha1(("class:" + f.get("class","")).encode("utf-8")).hexdigest()[:8]

for f in findings:
    f["finding_id"] = finding_id(f)
    f["fingerprint"] = fingerprint(f)
    f["pr"] = pr

# best-effort inline comments (skipped in dry-run)
if dry != "1":
    for f in findings:
        p, ln = f.get("path"), f.get("line")
        if not (p and ln):
            continue
        body = "%s `%s` **[%s]** %s\n\n%s\n\n<!-- flywheel:%s fp:%s -->" % (
            marker, f.get("class",""), f.get("severity",""), f.get("title",""),
            f.get("body",""), f["finding_id"], f["fingerprint"])
        subprocess.run(
            ["gh","api","-X","POST","/repos/%s/pulls/%s/comments" % (repo, pr),
             "-f","body=%s" % body, "-f","commit_id=%s" % head,
             "-f","path=%s" % p, "-F","line=%d" % int(ln), "-f","side=RIGHT"],
            check=False, capture_output=True)

# authoritative summary (always emitted; posted by shell unless dry)
lines = ["%s Codex flywheel review — %d finding(s)" % (marker, len(findings)), ""]
for i, f in enumerate(findings, 1):
    loc = ""
    if f.get("path"):
        loc = " — `%s`%s" % (f["path"], (":%s" % f["line"]) if f.get("line") else "")
    lines.append("%d. **[%s] %s**%s — %s" % (
        i, f.get("severity",""), f.get("class",""), loc, f.get("title","")))
lines += ["", "<!-- flywheel-findings",
          json.dumps({"pr": pr, "findings": findings}, ensure_ascii=False),
          "-->"]
sys.stdout.write("\n".join(lines) + "\n")
PY

NFOUND="$(grep -cE '^[0-9]+\. ' "$SUMMARY" 2>/dev/null || echo 0)"

if [ "$DRY" = "1" ]; then
  log "DRY-RUN — $NFOUND finding(s); not posting. Summary:"
  cat "$SUMMARY"
  exit 0
fi

gh pr comment "$PR" --body-file "$SUMMARY" >/dev/null
log "posted $NFOUND finding(s) to PR #$PR"
