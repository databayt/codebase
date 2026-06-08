# ReportIssue Widget

One-textarea bug report widget. Posts a GitHub issue with label `report` to the repo configured via `GITHUB_REPO`. The `/report` skill in kun consumes the label and auto-fixes.

## Install

Clone into target repo as `src/components/atom/report-issue/`:

```bash
cp -r /Users/abdout/codebase/src/components/atom/report-issue-widget \
      <repo>/src/components/atom/report-issue
```

Mount in root layout / footer:

```tsx
import { ReportIssue } from "@/components/atom/report-issue"

<ReportIssue />            // text variant (underlined link)
<ReportIssue variant="icon" /> // icon variant (Bug icon)
```

## Env

```bash
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...  # PAT with repo:issues:write
GITHUB_REPO=databayt/<repo-name>      # where issues are filed
```

## Auth integration (optional)

The action accepts a second `getReporter` argument so the issue body includes the signed-in user. In a repo with NextAuth, wrap the action:

```ts
// src/components/atom/report-issue/action.ts (in target repo)
import { auth } from "@/auth"
import { reportIssue as base } from "./base-action"
export async function reportIssue(data: Parameters<typeof base>[0]) {
  return base(data, async () => (await auth())?.user ?? null)
}
```

Repos without auth: the action falls back to `Anonymous`.

## Issue format

- Title: first 80 chars of description
- Label: `report`
- Body: description, page URL, ISO time, reporter, browser, viewport, direction

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"text" \| "icon"` | `"text"` | Trigger style |
| `labels` | object | English | Pass localized strings (link, title, placeholder, submit, submitting, success, error) |
