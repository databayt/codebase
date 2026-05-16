# ─────────────────────────────────────────────────────────────────
# DEPRECATED — moved to databayt/kun
#
# This installer is no longer maintained here. The Kun engine config
# installer now lives in its own home repository:
#
#   https://github.com/databayt/kun/.claude/scripts/install.ps1
#
# Canonical paste (forwards via the kun.databayt.org domain):
#
#   irm https://kun.databayt.org/install | iex
#
# This file remains only as a redirect for any old paste a user might
# have bookmarked. It exits non-zero so accidental usage is obvious.
# Tombstoned 2026-05-16. See databayt/kun#26 for rationale.
# ─────────────────────────────────────────────────────────────────

Write-Host ''
Write-Host '⚠️  Kun installer has moved to databayt/kun' -ForegroundColor Yellow
Write-Host '   Update your paste to:' -ForegroundColor Yellow
Write-Host '     irm https://kun.databayt.org/install | iex' -ForegroundColor Cyan
Write-Host '   (or direct: irm https://raw.githubusercontent.com/databayt/kun/main/.claude/scripts/install.ps1 | iex)' -ForegroundColor Gray
Write-Host ''
Write-Host 'This shim does NOT install anything. Exiting.' -ForegroundColor Red
exit 1
