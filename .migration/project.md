# project — Radix UI → Base UI (whole project)

2026-10-10 · golden pair via the shadcn CLI (base-vega, RTL) for the ui
wrappers, transformation engine for consumers · migrated, build green.

## Dependency swap

- `src/components/ui/*` replaced with shadcn **base-vega** wrappers (shadcn
  4.21.4, `@base-ui/react` 1.9). Vega is the base style closest to the old
  new-york look. Kept and migrated by hand: form, faceted, sortable,
  custom-video-player, international-demo, sonner; chart stays on our
  recharts-2 version (no radix). New: toast, questionnaire (`@shadcn/react`).
- `src/app/globals.css` imports `shadcn/tailwind.css` (data-open/checked/…
  custom variants the base wrappers rely on).
- Removed: `radix-ui`, `@radix-ui/react-{dialog,direction,icons,select,slot,
  tooltip,use-controllable-state}`, `vaul` (drawer is Base UI now).
- `"use client"` added to the useRender wrappers (attachment, badge,
  breadcrumb, bubble, button-group, item, marker) — useRender uses refs and
  these render inside server components here.

## App-code sweep

Per-area reports in this folder: templates, tablecn, table, shell, modules,
atoms. Typecheck: zero errors beyond the pre-existing baseline (271, AI SDK /
dictionaries / prisma). `pnpm build` green.

## Verify by hand

Each area report ends with a one-minute checklist. Shared behavior deltas:
checkbox/radio menu items no longer close menus; tabs activate on click/Enter
(arrow keys move focus only); tooltip delay lives on the trigger.

0 wrappers remain on Radix.
