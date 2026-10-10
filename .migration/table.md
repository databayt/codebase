# table

2026-10-10 · transformation engine (consumer sweep against consumer-props.md + class-mapping.md) · all `src/components/table/**` + `(blocks)/table/**` consumers moved to the base-vega wrappers; 0 non-baseline tsc errors.

## Changed

- `src/app/[lang]/(blocks)/table/layout.tsx` — TooltipProvider `delayDuration={120}` -> `delay={120}`.
- `src/components/table/providers.tsx` — same `delayDuration` -> `delay`.
- `src/components/table/layouts/site-header.tsx` — `Button asChild > Link` -> `<Button nativeButton={false} render={<Link .../>}>`.
- `src/components/table/layouts/mode-toggle.tsx` — `DropdownMenuTrigger asChild` -> `render={<Button/>}`.
- `src/components/table/_components/create-task-sheet.tsx` — SheetTrigger / SheetClose `asChild` -> `render`.
- `src/components/table/_components/update-task-sheet.tsx` — SheetClose `render`; props interface narrows `onOpenChange` to `(open: boolean) => void` (the sheet calls it itself after a save, and Base's handler wants 2 args).
- `src/components/table/_components/delete-tasks-dialog.tsx` — Dialog/Drawer Trigger + Close `render`; props interface is now explicit `{open, defaultOpen, onOpenChange(open)}`, because Base Dialog.Root and Drawer.Root props are no longer spread-compatible (callers only pass open/onOpenChange).
- `src/components/table/_components/feature-flags-provider.tsx` — ToggleGroup `type="single"` removed, value -> `filterFlag ? [filterFlag] : []`, onValueChange takes `value[0] ?? null`; Tooltip `delayDuration={700}` moved to `TooltipTrigger delay={700}`; `ToggleGroupItem asChild > TooltipTrigger` inverted to `<TooltipTrigger render={<ToggleGroupItem/>}>`; `data-[state=on]:` -> `data-pressed:`; arrow-hider `[&>span]:hidden` -> `[&>[aria-hidden=true]]:hidden` (Base Tooltip.Arrow is an aria-hidden div, not a span).
- `src/components/table/_components/tasks-table-action-bar.tsx` — **direct `@radix-ui/react-select` import removed**: raw `SelectTrigger asChild` -> `SelectPrimitive.Trigger` from `@base-ui/react/select` with `render={<DataTableActionBarAction/>}`; onValueChange handlers accept `| null` and ignore null.
- `src/components/table/_components/tasks-table-columns.tsx` — Checkbox `checked="indeterminate"` -> boolean `checked` + separate `indeterminate`; DropdownMenuTrigger `render`; `data-[state=open]:bg-muted` -> `data-popup-open:bg-muted`; DropdownMenuItem `onSelect` -> `onClick` (x2; onSelect was a silent no-op on Base, the HTML onSelect event).
- `src/components/table/data-table/data-table-action-bar.tsx` — TooltipTrigger `asChild` -> `render` (x2); `[&>span]:hidden` -> `[&>[aria-hidden=true]]:hidden` (x2).
- `src/components/table/data-table/data-table-column-header.tsx` — trigger `data-[state=open]:bg-accent` -> `data-popup-open:bg-accent`.
- `data-table-date-filter.tsx`, `data-table-faceted-filter.tsx`, `data-table-slider-filter.tsx`, `data-table-view-options.tsx` — PopoverTrigger `asChild` -> `render={<Button/>}`. Slider handler now takes `number | readonly number[]` and copies to a `[n, n]` tuple.
- `data-table-filter-list.tsx` — 3 PopoverTrigger + 1 FacetedTrigger -> `render`; join-operator Select: null-guarded handler, `position="popper"` -> `alignItemWithTrigger={false}`; operator Select gets `items={filterOperators}`; boolean Select gets `items={booleanItems}` + null guard; `--radix-*` vars -> `--available-width` / `--transform-origin` / `--anchor-width`.
- `data-table-filter-menu.tsx` — 4 PopoverTrigger -> `render` (trigger ref preserved; Base merges render-element refs); operator + boolean Selects get `items` + null guards; `--radix-*` vars renamed.
- `data-table-sort-list.tsx` — 2 PopoverTrigger -> `render`; direction Select gets `items={dataTableConfig.sortOrders}` + null guard; unused `SortDirection` type import dropped; `--radix-*` vars renamed.
- `src/components/table/styles/globals.css` — accordion keyframes `--radix-accordion-content-height` -> `--accordion-panel-height`.

Leftover scan: `grep -rnE 'from "(radix-ui|@radix-ui)' src/components/table "src/app/[lang]/(blocks)/table"` -> 0. Remaining "radix" strings are only `@see` URLs in comments (hooks/use-callback-ref.ts, lib/compose-refs.ts).

## Left alone

- `SortableContent asChild` / `SortableItem asChild` / `SortableItemHandle asChild` in filter-list + sort-list: these come from `@/components/atom/sortable` (still on `@radix-ui/react-slot`, outside my paths). **If the sortable agent switches it to `render`, these 6 call sites must follow.**
- `FormControl` around `SelectTrigger` in `task-form.tsx`: `ui/form.tsx` is still radix Slot (other agent).
- `CommandItem onSelect` (cmdk) and `Calendar onSelect` (react-day-picker): not radix.
- `Separator className="data-[orientation=vertical]:h-*"`: Base Separator still emits `data-orientation`, so these keep working.
- `data-table-pagination.tsx` Select `side="top"`: wrapper default `alignItemWithTrigger=true` ignores `side`, same as radix item-aligned before. Unchanged.
- Baseline errors still present (not mine): `_lib/actions.ts` (revalidateTag 2-arg x15), `_lib/validations.ts` (nuqs/zod x2), `lib/export.ts`, `lib/prisma-filter-columns.ts`.

## Behavior changes

- **Menu checkbox items don't close on click**: `data-table-column-header.tsx` uses `DropdownMenuCheckboxItem` as actions (Asc / Desc / Hide). Base `closeOnClick` defaults to false on CheckboxItem, so the menu stays open after picking one (Radix closed it). Same for `DropdownMenuRadioItem` (Labels submenu) in `tasks-table-columns.tsx`. Flagged, not patched (add `closeOnClick` if wanted).
- Row-action menu items (Edit / Delete) now fire on `onClick`; the earlier `onSelect` handlers would never have fired on Base.
- Feature-flag tooltip: delay of 700ms now set on the trigger; Base has no skip-delay grouping, so the feel may differ slightly.
- Clicking the selected feature-flag toggle again clears it (empty array -> `null`), the same as Radix single mode clearing to `""`.
- Select popups that showed the raw value now show the label via `items` (operators, True/False, Asc/Desc). Without this, Base's `Select.Value` would have shown `iLike` / `true` / `asc`.

## Verify by hand

- /table: open the Rows-per-page select, the operator select on a filter row, and the boolean filter. Each trigger shows the label, and keyboard arrows + Enter pick an item.
- Select rows: the action bar appears; the status/priority icon buttons open a select AND show their tooltip on hover. Esc clears the selection.
- Row "..." menu: Edit opens the update sheet, Delete opens the dialog, Labels submenu changes the label. Cancel buttons close the sheet/dialog, and focus returns to the trigger.
- Mobile width (<640px): Delete opens the drawer, and Cancel closes it.
- Column header menu: Asc/Desc/Hide work (note the menu stays open, see above).
- Feature-flag toggles: tooltip after ~700ms; the pressed one is highlighted (data-pressed); clicking it again clears `?filterFlag`.
- Filter/sort popovers: the width cap and origin animate correctly (`--available-width`, `--transform-origin`); the sort field popover width matches its trigger (`--anchor-width`).
- Header GitHub icon is a link (opens new tab); theme toggle menu works.

## tsc

`npx tsc --noEmit -p tsconfig.json | grep -E "src/components/table/|\(blocks\)/table"` -> 19 errors, all in BASELINE (actions.ts x15, validations.ts x2, export.ts, prisma-filter-columns.ts). **Non-baseline errors in my paths: 0** (was 47 before the sweep).
