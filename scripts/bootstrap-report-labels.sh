#!/usr/bin/env bash
# Bootstrap the 11 report-scoring labels across all databayt product repos.
#
# Idempotent — re-running is safe. Labels that already exist get their color
# and description updated (gh label edit), missing labels get created.
#
# Usage:
#   bash scripts/bootstrap-report-labels.sh                # all 5 repos
#   bash scripts/bootstrap-report-labels.sh databayt/kun   # one repo
#
# Requirements: gh CLI authenticated with issues:write on each target repo.

set -euo pipefail

DEFAULT_REPOS=(
  databayt/hogwarts
  databayt/kun
  databayt/souq
  databayt/mkan
  databayt/shifa
)

if [ "$#" -gt 0 ]; then
  REPOS=("$@")
else
  REPOS=("${DEFAULT_REPOS[@]}")
fi

# Label definitions (name, color, description). Keep in sync with
# /Users/abdout/codebase/src/lib/report/labels.ts (REPORT_LABELS).
LABELS=(
  "report|d93f0b|User-reported issue via Report an Issue dialog"
  "verified-report|0e8a16|Pre-validated bug, eligible for auto-fix"
  "low-confidence|fbca04|Borderline report, not auto-processed"
  "needs-human|b60205|Requires human triage before auto-fix"
  "corroborated|5319e7|Multiple independent reports on same page"
  "severity/critical|b60205|Data loss, security, total outage"
  "severity/high|d93f0b|Core feature broken for many users"
  "severity/medium|fbca04|Noticeable bug, workaround exists"
  "severity/low|c2e0c6|Cosmetic, edge case"
  "lang/ar|1d76db|Report written in Arabic"
  "lang/en|0052cc|Report written in English"
)

ensure_label() {
  local repo="$1" name="$2" color="$3" desc="$4"
  if gh label list --repo "$repo" --limit 200 --json name --jq '.[].name' | grep -qx "$name"; then
    gh label edit "$name" --repo "$repo" --color "$color" --description "$desc" >/dev/null
    echo "  · updated $name"
  else
    gh label create "$name" --repo "$repo" --color "$color" --description "$desc" >/dev/null
    echo "  + created $name"
  fi
}

for repo in "${REPOS[@]}"; do
  echo "→ $repo"
  for entry in "${LABELS[@]}"; do
    IFS='|' read -r name color desc <<<"$entry"
    ensure_label "$repo" "$name" "$color" "$desc"
  done
done

echo "Done."
