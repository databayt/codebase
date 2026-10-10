# modules — Radix -> Base UI consumer migration

2026-10-10. I migrated the consumer code by hand against consumer-props.md and checked every prop and part against `node_modules/@base-ui/react` d.ts. Area: `src/app/**` (minus `(root)/tablecn`, `(blocks)/table` and the untracked view/templates), the `src/components/{leads,chatgpt,sales,assistant-ui,upwork,emails,billingsdk,auth,scraper,community,chatbot,report-issue}` folders, and the loose `src/components/*.tsx` files (minus docs-copy-page). Result: no `radix-ui` / `@radix-ui/*` imports remain in this area, and no wrapper `asChild` remains in it.

## Files changed

### src/app
- `[lang]/layout.tsx`: `DirectionProvider dir=` changed to `direction=`.
- `[lang]/tablecn/layout.tsx`: `TooltipProvider delayDuration={120}` changed to `delay={120}`. This is NOT the excluded `(root)/tablecn` path, but please tell the tablecn owner.
- `[lang]/(root)/atoms/[[...slug]]/page.tsx`: 4x `Button asChild > Link` changed to `render={<Link/>} nativeButton={false}`, and 2x `Badge asChild > a` changed to `render={<a/>}`.
- `[lang]/(root)/docs/[[...slug]]/page.tsx`: the same 6 changes as the atoms page.
- `[lang]/(root)/docs/apps.tsx`: `Button asChild > a` changed to `render` plus `nativeButton={false}`.
- `[lang]/(root)/examples/layout.tsx`: 2x `Button asChild > Link` changed to `render` plus `nativeButton={false}`.
- `[lang]/(root)/templates/page.tsx`: `Button asChild > Link` changed to `render` plus `nativeButton={false}`.
- `[lang]/(root)/examples/playground/page.tsx`: added `items` to Select so SelectValue shows the label.
- `[lang]/(expose)/(protected)/setting/page.tsx`: added `items` (role labels) to Select.

### components: hand-rolled radix imports (16 files)
- `assistant-ui|chatgpt|sales/tooltip-icon-button.tsx`: removed `Slottable` (`@radix-ui/react-slot`). `TooltipTrigger asChild > Button` is now `TooltipTrigger render={<Button … ref/>}`, with the children inline.
- `chatgpt|sales/Shadcn.tsx`: removed the `TooltipContentProps` type import from `@radix-ui/react-tooltip`. It now uses `ComponentPropsWithRef<typeof TooltipContent>["side"]`. `TooltipTrigger asChild` changed to `render`.
- `assistant-ui|chatgpt|sales/threadlist-sidebar.tsx`: `GitHubLogoIcon` from `@radix-ui/react-icons` swapped for `RxGithubLogo` from `react-icons/rx`. That is the same Radix glyph set, and react-icons is already a dependency. 2x `SidebarMenuButton asChild > Link` changed to `render={<Link/>}`.
- `auth/error-card.tsx`, `auth/error/error-card.tsx`, `auth/form-error.tsx`, `auth/error/form-error.tsx`: `ExclamationTriangleIcon` changed to `RxExclamationTriangle` (react-icons/rx).
- `auth/form-success.tsx`: `CheckCircledIcon` changed to `RxCheckCircled`.
- `auth/user-button.tsx`: `ExitIcon` changed to `RxExit`.
- `scraper/extractor.tsx`, `scraper/single.tsx`: `LinkedInLogoIcon` changed to `RxLinkedinLogo`.

### components: call sites
- `assistant-ui|chatgpt|sales/attachment.tsx`, `chatgpt|sales/attachment-old.tsx` (5 files):
  - `DialogTrigger asChild {children}` changed to `render={children as ReactElement} nativeButton={false}`, because it renders a div tile.
  - `TooltipTrigger asChild > div` changed to `render={<div/>}`.
  - `AvatarFallback delayMs` changed to `delay`.
- `chatgpt|sales/thread-selector.tsx`: `DropdownMenuTrigger asChild > Button` changed to `render`.
- `chatgpt/ModelPicker.tsx`: `onValueChange` now guards `null` (Base widens it to `string | null`).
- `auth/back-button.tsx`: `Button asChild > Link` changed to `render` plus `nativeButton={false}`.
- `auth/login-button.tsx`: `DialogTrigger asChild={asChild}` is now `asChild ? <DialogTrigger render={children}/> : <DialogTrigger>{children}</DialogTrigger>`. The public `asChild` prop is kept, and nothing in the repo consumes it.
- `billingsdk/update-plan-dialog.tsx`, `billingsdk/cancel-subscription-dialog.tsx`: `DialogTrigger asChild > Button` changed to `render`. On the close button, `data-[state=open]:` changed to `data-open:`.
- `emails/content.tsx`: `DialogTrigger asChild` changed to `render`.
- `emails/ai/follow-up.tsx`: 2x Slider `onValueChange(([v]) => …)` changed to `(v) => typeof v === "number" ? v : v[0]`, because Base passes `number | readonly number[]`.
- `leads/all.tsx`: 4x `DropdownMenuTrigger asChild` changed to `render`. `DropdownMenuItem asChild > Link` changed to `render={<Link/>}`.
- `leads/bulk-operations.tsx`, `leads/export-handler.tsx`, `leads/mobile-lead-card.tsx`, `leads/students/columns.tsx`:
  - `DropdownMenuTrigger asChild` changed to `render`.
  - `DropdownMenuLabel` is now wrapped in `DropdownMenuGroup`. Base `Menu.GroupLabel` throws "MenuGroupContext is missing" outside a Group: a runtime crash that tsc does not catch.
- `leads/card.tsx`: `DropdownMenuTrigger asChild` changed to `render`.
- `leads/form.tsx`:
  - Slider `value[0]` now handles the number-or-array value.
  - The status and source Selects got `items={LEAD_STATUS}` and `items={LEAD_SOURCE}`.
- `leads/modal/lead-form-content.tsx`: the 3 Selects got `items={…_OPTIONS}`.
- `leads/prompt.tsx`: Select got `items` holding the same icon+label nodes, so the trigger looks as it did before.
- `leads/students/enrollment.tsx`, `leads/students/information.tsx`:
  - `PopoverTrigger asChild > FormControl > Button` was restructured to `FormControl > PopoverTrigger render={<Button/>}`, so FormControl's id and aria props still reach the button.
  - information.tsx: the gender Select got `items`.
- `upwork/chat-message.tsx`:
  - `CollapsibleTrigger asChild > button` changed to `render`.
  - `CollapsibleContent forceMount` changed to `keepMounted`.
  - `group-data-[state=open]:rotate-90` changed to `group-data-open:rotate-90`.
- `upwork/generator.tsx`: `peer-data-[state=checked]` and `[&:has([data-state=checked])]` changed to `peer-data-checked` and `[&:has([data-checked])]` (radio tone cards).
- `upwork/model.tsx`, `upwork/all.tsx`: added Select `items`, including the "all" option.
- `chatbot/chat-window.tsx`: the `[data-radix-scroll-area-viewport]` query changed to `[data-slot="scroll-area-viewport"]`. Without this, auto-scroll silently stopped working.

## Left alone
- `@assistant-ui/react` primitives (`ThreadPrimitive.*`, `ComposerPrimitive.*`, `ActionBarPrimitive.*`, `AssistantModalPrimitive.*`, and so on) keep their own `asChild` and `data-[state=…]` classes in `*/thread.tsx`, `*/thread-list.tsx` and `*/assistant-modal.tsx`. That is assistant-ui's API, which is Radix-based internally, not our wrappers. Their Slot merges props onto our Base Button, which is fine.
- `Calendar onSelect` in the leads/students forms is react-day-picker, not a menu.
- `chatgpt/CLONE.md` and `sales/CLONE.md` mention `@radix-ui/*` in prose only.
- I did not touch the excluded paths. Other agents' diffs show in `(blocks)/table/layout.tsx` and `docs-copy-page.tsx`.

## Behavior changes (flagged, not patched)
1. **Select labels:** Base `SelectValue` shows the raw value unless the Root has `items`. I added `items` to every Select in this area that renders `<SelectValue/>`. ModelPicker passes explicit children, and the row-level status Select in upwork/all renders its own badge, so neither needs it.
2. **Tabs:** Base activates tabs manually on keyboard arrows (radix activated on focus). This affects playground, leads/featured, leads/detail, upwork/generator, upwork/content, emails/content, emails/ai/{campaigns,content,analytics}, scraper/{content,single}. I did not add `activateOnFocus`.
3. **upwork ReasoningBlock:** with `keepMounted`, the panel gets `hidden` as soon as it closes. The framer-motion collapse animation on close may no longer play (opening still animates). Radix `forceMount` kept the panel visible.
4. **Radix-icons to react-icons/rx:** same glyphs. Sizing differs only where no size class is set: `auth/error/error-card.tsx` was 15px and is now 1em.
5. **Dropdown labels:** each is now wrapped in a `role=group` div. There is no visual change.
6. **Menu item close-on-click:** Base defaults are the same for plain items. No CheckboxItem or RadioItem is used in this area.

## Gaps / leftovers for the lead (IMPORTANT)
- **RSC crash risk, ui-layer fix needed.** `ui/badge.tsx` (and `breadcrumb`, `item`, `marker`, `button-group`, `bubble`, `attachment`) call `useRender` directly with no `"use client"`. `useRender` calls `useRef`, which the react-server build does not export (it exports only use, useCallback, useDebugValue, useId and useMemo). Any **server component** rendering these crashes at runtime. Server pages in this area that import them:
  - `(root)/atoms/[[...slug]]/page.tsx` and `(root)/docs/[[...slug]]/page.tsx` (Badge)
  - `(root)/examples/tasks/page.tsx`
  - `(marketing)/blog/contributors/page.tsx` and `/[slug]/page.tsx`
  - `(root)/blocks/invoice/view/[id]/page.tsx`
  - `(blocks)/leads/[id]/page.tsx`

  Suggested fix: add `"use client"` to those ui wrappers (one line each, outside my area). Button, Input, Accordion and others are safe because they render `@base-ui` components, which carry `'use client'`.
- `leads/students/*` depend on `ui/form.tsx` `FormControl`, which is still Slot-based and owned by the form agent. My restructure assumes FormControl keeps wrapping its single child, which the whole app relies on.
- No radix imports remain in this area.

## tsc
Non-baseline errors in my path regex: **0 caused by the migration** (started at 70, the first count also included the two validator errors below).

The two remaining entries are `.next/types/validator.ts(877)` and `.next/dev/types/validator.ts(877)`: `(root)/templates/layout.tsx` declares `params: Promise<{lang: Locale}>`, but Next's generated LayoutProps says `string`. I never modified that file (last commit 2025-11-29). These come from regenerated Next route types, not from radix, and are not in the baseline only because the baseline has no `.next` lines.
