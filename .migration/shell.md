# shell — Radix to Base UI consumer migration

2026-10-10. I migrated the call sites by hand against consumer-props.md, class-mapping.md and the Base UI 1.9 `.d.ts` files. Chrome files (header-01/02, sidebar-01, docs shell) changed only where the API required it. The dirs dial-in-detail/ and one-visual-many-sizes/ were not touched.

**Result: 0 tsc errors outside the baseline in my paths.** Before I started there were 40. I compared by file and message, with line numbers stripped, using `migration/shell-diff.sh`.
**Leftover check is clean.** `asChild`, `radix-ui` and `@radix-ui` have no matches in the 151 assigned files. The two `radix-ui.com` URL strings in `docs/awesome-shadcn/constants.ts` are content, not imports.

## Changed

### Chrome (protected)
- `template/header-01/github-link.tsx`: Button `asChild` + Link became `render={<Link …/>}` with `nativeButton={false}`.
- `template/header-01/lang-switcher.tsx`: same change as github-link.
- `template/header-01/mobile-nav.tsx`:
  - PopoverTrigger `asChild` became `render={<Button …/>}`.
  - `--radix-popper-available-height/width` became `--available-height/width`.
  - Two class additions keep the look the same:
    - `ring-0` on the content. The new popover wrapper draws its edge with `ring-1` instead of `border`, and this consumer already removed the edge with `border-none`.
    - `aria-expanded:bg-transparent` on the trigger. The new ghost variant adds `aria-expanded:bg-muted`, and this consumer already forces a transparent background in every state.
- `template/header-01/command-menu.tsx`: the `DialogProps` type import from `@radix-ui/react-dialog` became `Dialog.Root.Props` from `@base-ui/react/dialog` (type-only import).
- `template/header-02/taxonomy-header.tsx`: GitHub Button changed to `render={<Link/>}` with `nativeButton={false}`.
- `template/sidebar-01/content.tsx`: SidebarMenuButton changed to `render={<Link/>}`. `data-[active=true]:` became `data-active:`, because Base useRender state emits a bare `data-active` attribute.

### Docs shell
- `docs/docs-sidebar.tsx`, `docs/atoms-sidebar.tsx`: SidebarMenuButton changed to `render={<Link className="block w-full"/>}`. The Link's className still merges the same way it did under Slot.
- `docs/toc.tsx`:
  - DropdownMenuTrigger changed to `render={<Button/>}`.
  - DropdownMenuItem changed to `render={<a href/>}`.
  - Added `w-auto` to DropdownMenuContent. The new wrapper sets `w-(--anchor-width)`, which would squeeze the list to the width of the "On this page" button.
- `docs/copy-button.tsx`, `docs/code-block-command.tsx`:
  - TooltipTrigger changed to `render={<Button/>}`.
  - Tabs `data-[state=active]:` became `data-active:`. The consumer override must use the same variant as the wrapper's `data-active:bg-background` for twMerge to let it win.
- `docs/atom-preview.tsx`, `mdx-components.tsx` (TabsTrigger): `data-[state=active]:` became `data-active:`.
- `mdx-components.tsx`: the MDX `Accordion` now strips `type`/`collapsible` and maps `type="multiple"` to `multiple`. `content/docs/(root)/accordion.mdx` still uses the Radix API in live demos, and content is outside my paths.
- `docs/code-collapsible-wrapper.tsx`:
  - The `asChild` div trigger became `render={<div/>}` with `nativeButton={false}`.
  - `forceMount` became `keepMounted`, plus a `render` function that drops the `hidden` attribute. Base adds `hidden` to a closed kept-mounted panel, and Tailwind preflight's `[hidden]{display:none!important}` would hide the clipped preview. Radix forceMount kept it visible.
  - `data-[state=closed]:` became `data-closed:`.
  - `group-data-[state=open]/collapsible:` became `group-data-open/collapsible:`.
- `docs/block-viewer.tsx` (upstream new-york-v4 port):
  - ToggleGroup: `type="single"` removed, `defaultValue={["100%"]}`, and `onValueChange` reads `value[0]` and skips resize when it is empty.
  - The Open-in-new-tab Button changed to `render={<Link/>}` with `nativeButton={false}`.
  - CollapsibleTrigger changed to `render={<SidebarMenuButton/>}`.
  - `[&[data-state=open]>…]` became `[&[data-open]>…]`.
  - `data-[active=true]:` became `data-active:`.
  - Tabs needed no change.
- `docs-copy-page.tsx`:
  - DropdownMenuTrigger and PopoverTrigger changed to `render={trigger}`.
  - DropdownMenuItem changed to `render={value(url)}`.
  - The Button inside the popover changed to `render={<a/>}` with `nativeButton={false}`.
  - Added `w-auto` to the dropdown content (same anchor-width reason as toc).
  - **PopoverAnchor has no Base part.** I rendered `PopoverPrimitive.Portal > Positioner anchor={groupRef} > Popup` inline here, copying the wrapper's classes verbatim and adding `gap-0`. The new wrapper's `flex-col gap-4` would otherwise put 16px between the menu rows. This keeps the popover anchored to the whole button group, as before.
- `docs/awesome-shadcn/content.tsx`: Select gets `items` ("all" displays as "All tags"), and `onValueChange` handles null (falls back to "all").

### Homepage / root showcase
- `root/cards/{chat,data-table,team-members}.tsx`, `root/components/{button-group-demo,button-group-input-group,button-group-popover,input-group-button,input-group-demo,item-demo,notion-prompt-form}.tsx`, `root/block/{auth/content,invoice/invoice-list}.tsx`: `asChild` became `render`. In notion-prompt-form, the nested Tooltip + Popover trigger became `TooltipTrigger render={<PopoverTrigger render={<InputGroupButton/>}/>}`.
- `root/cards/chat.tsx`: TooltipProvider `delayDuration={0}` became `delay={0}`.
- `root/cards/data-table.tsx`: Checkbox `checked=…||"indeterminate"` became boolean `checked` plus a separate `indeterminate` prop.
- `root/components/field-slider.tsx`: `onValueChange` now casts to `number[]`, as upstream base does.
- `root/components/field-hear.tsx`: `data-[state=checked]` became `data-checked`, including the `group-has-…/field-label` variant.
- `root/components/notion-prompt-form.tsx`: model DropdownMenuItem `onSelect` became `onClick`. Under Base it would have silently never fired.
- Select labels: Base `SelectValue` shows the raw value unless `items` is given, so these got `items`:
  - `root/theme-selector.tsx` (also `data-[state=checked]` became `data-selected`)
  - `root/cards/payment-method.tsx` (month items now come from a `MONTHS` const)
  - `root/cards/report-issue.tsx`
  - `root/cards/share.tsx` (dictionary labels)
  - `root/block/report/content.tsx` (`REPORT_TYPE_LABELS`)
  - `root/block/invoice/invoice-form.tsx` (currency labels, and `onValueChange` ignores null)
- `root/cards/payment-method.tsx`: `peer-data-[state=checked]` became `peer-data-checked`, and `[&:has([data-state=checked])]` became `[&:has([data-checked])]`.
- `root/components/field-demo.tsx`: removed `defaultValue=""` so the MM/YYYY placeholder shows. Base treats `""` as a real value.

## Left alone
- `src/components/local/**` and `providers/client-providers.tsx`: no Radix API. The `ui/toaster` import error is in the baseline.
- `root/cards/chat.tsx`, `header-01/command-menu.tsx`, `notion-prompt-form.tsx` CommandItem `onSelect`: these are cmdk, not Radix.
- `root/cards/data-table.tsx` `data-state={…"selected"}` on a TableRow: set by the app, not Radix.
- Explicit `data-active={…}` with `data-[active=true]` on plain elements (toc links, examples-nav, templates-nav, arts/gallery, button-group-input-group): set by the app, so they still match.
- Visual drift that comes from the new ui wrappers and that no consumer opted out of, flagged rather than patched:
  - Ghost and outline buttons now highlight `aria-expanded:bg-muted` while their menu or popover is open (toc trigger, the data-table and invoice "…" triggers).
  - Popover and dropdown edges are `ring-1 ring-foreground/10` instead of `border`.
  - PopoverContent is now `flex flex-col gap-4`, which affects team-members (one Command child, no effect) and the input-group popovers.

## Behavior changes
- Buttons that render a link (`nativeButton={false}`) now carry `role="button"` on the `<a>`. Base `useButton` does this, and it is the upstream base idiom. Affected: GitHub link, language switcher, docs-copy-page links, block-viewer open-in-tab, auth block links.
- The code-collapsible "Expand" trigger is now a `<div role="button" tabindex=0>` wrapping a real `<button>`, which nests interactive elements. Under Radix the div only got `type="button"`/`aria-expanded`.
- block-viewer ToggleGroup: clicking the active size deselects it (value `[]`). Radix single mode did the same and emitted `""`. The resize is now skipped instead of being called with an empty value.
- Menu items close on click by default under Base. The toc and docs-copy-page items behave the same as before.
- Base Tabs use manual activation: arrow keys move focus without switching tabs (code-block-command package-manager tabs, block-viewer Preview/Code, atom-preview, MDX Tabs). Not patched, per the skill.

## Gaps
- No Radix imports remain in my paths.
- **Content outside my paths:** `content/docs/(root)/accordion.mdx` still writes `type="single" collapsible` / `type="multiple"`. The shim in mdx-components handles it at render time; the lead may want to update the MDX and drop the shim.

## Verify by hand (about 1 minute)
1. Below the `lg` breakpoint, open the header "Menu". It should fill the viewport under the header with no ring or edge, and the trigger should keep no background while open. Check that links navigate and close the menu.
2. On a docs page with a long code block (CodeCollapsibleWrapper), the collapsed state should show a clipped 16rem preview. Expand and Collapse should work from both the top button and the bottom gradient.
3. Docs "Copy Page":
   - Desktop: the chevron dropdown is right-aligned and items open v0, ChatGPT and Claude in a new tab.
   - Mobile: the popover is left-aligned to the whole button group, with no gaps between rows.
4. Narrow-width TOC dropdown: items should be content-width, and clicking one should jump and close.
5. Block viewer:
   - The Desktop/Tablet/Mobile toggle resizes the panel.
   - Open-in-new-tab works.
   - File-tree folders rotate their chevron when open and collapse.
   - The active file is highlighted.
6. Docs and atoms sidebars: the active link is highlighted (`data-active`).
7. Homepage cards: Select triggers show labels (e.g. "Billing", "Severity 2", "Can edit", "Neutral"), not raw values. The payment-method radio cards get the primary border when selected.
