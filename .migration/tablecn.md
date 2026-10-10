# tablecn

2026-10-10, transformation engine (consumer sweep against consumer-props.md + hand-rolled radix rewires). Result: 0 non-baseline tsc errors in `tablecn` paths (was 78), 0 radix imports left.

Scope: `src/components/tablecn/**`. The route lives at `src/app/[lang]/tablecn/**`, not `(root)/tablecn`. Its only radix-era issue was `layout.tsx` `TooltipProvider delayDuration={120}`, and that file already read `delay={120}` when I got there (someone else edited it). I did not touch it.

## Changed

- components/delete-tasks-dialog.tsx: props narrowed from `ComponentProps<typeof Dialog>` to `open`/`onOpenChange(open)`, because the Dialog and Drawer root props no longer match and `onOpenChange(false)` now needs eventDetails. The Dialog/Drawer Trigger and Close parts now use `render={<Button/>}`.
- components/update-task-sheet.tsx: same props narrowing. `SheetClose` now uses `render`.
- components/tasks-table-action-bar.tsx: the direct `@radix-ui/react-select` `SelectTrigger` import is now `@base-ui/react/select` `SelectPrimitive.Trigger render={<DataTableActionBarAction/>}`. `onValueChange` gets a null guard.
- components/feature-flags-provider.tsx: ToggleGroup drops `type="single"`, and its value is now an array (`[flag]`/`[]`; `values[0] ?? null`). The nesting is now `TooltipTrigger render={<ToggleGroupItem/>}`. `delayDuration={700}` moved to `TooltipTrigger delay={700}`. `data-[state=on]` became `data-pressed`.
- components/mode-toggle.tsx, components/tasks-table-columns.tsx: `DropdownMenuTrigger` uses `render`. In tasks-table-columns the menu items change `onSelect` to `onClick` (Edit/Delete), `data-[state=open]` becomes `data-popup-open`, and `checked="indeterminate"` becomes a separate `indeterminate` boolean.
- components/site-header.tsx: now `<Button render={<Link/>} nativeButton={false}>`.
- components/task-form.tsx: the three Selects get `items` (value to label) so that `SelectValue` shows labels and not raw enum values.
- data-grid/data-grid-cell-variants.tsx:
  - `PopoverAnchor` is removed; Base UI has no Anchor part. I added a file-local `PopoverContent` with the same classes as ui/popover plus a forwarded Positioner `anchor`. Anchors: the long-text cell uses `containerRef`, and the multi-select, date and file cells use a ref on the old anchor div or span.
  - `onOpenAutoFocus` became `initialFocus`.
  - The file cell's `onEscapeKeyDown` stopPropagation was dropped; Base UI already stops Escape propagation by default.
  - Select cell: `items={options}`, a null guard, and `--radix-select-trigger-width` became `--anchor-width`.
  - The checkbox handler event types were widened from HTMLButtonElement to HTMLElement, because the Base checkbox renders a span.
- data-grid/data-grid-context-menu.tsx: `onCloseAutoFocus` (preventDefault + focus the grid) became `finalFocus={() => dataGridRef.current ?? false}`. Items change `onSelect` to `onClick` (Copy/Cut/Clear/Delete rows).
- data-grid/data-grid-column-header.tsx: `Tooltip delayDuration={100}` became `TooltipTrigger delay={100} render={<icon/>}`. The trigger class `data-[state=open]` became `data-popup-open`. The pointer-down handler is typed from the trigger's `onPointerDown`, which is a BaseUIEvent.
- data-grid/data-grid-keyboard-shortcuts.tsx: `onOpenAutoFocus` became `initialFocus={inputRef}`. `DialogClose` uses `render`, and its classes moved onto the Button.
- data-grid/data-grid-demo.tsx: the radix `DirectionProvider dir` became ui/direction `DirectionProvider direction`. Checkbox `indeterminate` is now a separate prop.
- data-grid/{data-grid, data-grid-row, data-grid-view-menu, data-grid-sort-menu, data-grid-filter-menu, data-grid-keyboard-shortcuts}.tsx and hooks/use-data-grid.tsx: `useDirection` now comes from `@/components/ui/direction` (Base UI) instead of `@radix-ui/react-direction`. Every call has no arguments, so the signature is compatible.
- data-grid/data-grid-sort-menu.tsx, data-grid-filter-menu.tsx, data-grid-view-menu.tsx: `PopoverTrigger` uses `render`. Selects get `items` plus a null-guarded `onValueChange`. Radix CSS vars are renamed: `--radix-popover-content-available-width` to `--available-width`, and `--radix-popover-trigger-width` / `--radix-select-trigger-width` to `--anchor-width`.
- data-grid/data-grid-row-height-menu.tsx: `onValueChange` gets a null guard.
- data-table/data-table-action-bar.tsx: `TooltipTrigger render={trigger}` and `render={<Button/>}`.
- data-table/{data-table-date-filter, data-table-faceted-filter, data-table-view-options, data-table-slider-filter}.tsx: `PopoverTrigger` uses `render`. In the slider filter, the `onValueChange` param is widened to `number | readonly number[]`.
- data-table/data-table-filter-list.tsx: Popover and Faceted triggers use `render`. Join operator: `position="popper"` became `alignItemWithTrigger={false}`. Operator and boolean Selects get `items` plus null guards. Radix CSS vars are renamed.
- data-table/data-table-filter-menu.tsx, data-table-sort-list.tsx: Popover triggers use `render`. Selects get `items` plus null guards. Radix CSS vars are renamed, and an unused `SortDirection` import was removed.
- data-table/data-table-column-header.tsx: `data-[state=open]:bg-accent` became `data-popup-open:bg-accent`.
- data-table/data-table-pagination.tsx: `onValueChange` gets a null guard.

Formatting: I formatted only the changed hunks (prettier `--no-config`, tablecn's semicolon style), and left untouched regions byte-identical.

Leftover scan (`grep -rn "radix-ui\|@radix-ui"`): only two comment `@see` URLs remain, in lib/compose-refs.ts and hooks/use-callback-ref.ts. There are no imports.

## Left alone

- Sortable parts: `SortableContent asChild`, `SortableItem asChild` and `SortableItemHandle asChild`, in data-grid-sort-menu, data-grid-filter-menu, data-table-filter-list and data-table-sort-list. They come from ui/sortable.tsx, which still uses radix `Slot` and belongs to another agent. If that agent switches sortable to `render`, these 12 call sites need the same asChild-to-render change. Today they type-check.
- `FormControl` in task-form.tsx comes from ui/form.tsx, which still uses radix Slot and belongs to another agent.
- cmdk `CommandItem onSelect` and react-day-picker `Calendar onSelect`: not radix, so correctly unchanged.
- src/app/[lang]/tablecn/layout.tsx: already migrated by someone else (`delay={120}`).

## Behavior changes

1. DropdownMenu Checkbox and Radio items no longer close the menu on click (Base UI `closeOnClick` defaults to false). Affected: the sort/hide checkbox items in data-table-column-header and data-grid-column-header, and the Labels radio items in tasks-table-columns. Flagged, not patched.
2. Menu items now fire `onClick` where they used `onSelect`. This is the same effect, and plain Items still close on click.
3. Tooltip delay now lives on the trigger, not the Root (700ms for feature flags, 100ms for the column-header icon). Base UI has no skip-delay.
4. Feature-flag ToggleGroup: clicking the active item now gives `[]`, which maps to `null` (radix gave `""`). The URL result is the same: the flag is cleared.
5. Focus management moved from event hooks to `initialFocus` / `finalFocus`. The long-text cell still puts the caret at the end. The file cell focuses the dropzone in a microtask. The context menu returns focus to the grid on close.
6. File-cell Escape: Base UI's own Escape stopPropagation replaces the explicit one.
7. Selects now pass `items`, because Base `Select.Value` would otherwise show the raw value (for example "iLike" or "in_progress"). An `onValueChange(null)` call is ignored.
8. Cell editors: Popover anchoring uses the Positioner `anchor` prop, not an Anchor element. The long-text cell wrapper is no longer wrapped by an Anchor slot.
9. DeleteTasksDialog and UpdateTaskSheet accept only `open` and `onOpenChange` (plus their own props). Every call site passes only those.

## Verify by hand

- /tablecn/data-grid:
  - Double-click a long-text cell: the popover sits under the cell and the caret is at the end of the text.
  - Esc cancels the edit without blurring the cell.
  - Multi-select cell: the search input gets focus. Date cell: the calendar is anchored under the date text.
  - File cell: the dropzone gets focus, and Esc keeps the cell focused.
  - Right-click the context menu: Copy/Cut/Clear/Delete all work, and focus returns to the grid.
  - Column header menu: does the checkbox not closing feel acceptable?
- Sort and filter popovers: the popup width is capped by `--available-width`, and the field/direction selects match the trigger width (`--anchor-width`). The direction and operator selects show labels, not raw values.
- The RTL toggle in the data-grid demo still flips menu and popover direction.
- /tablecn/data-table:
  - Select rows: the action bar status/priority select opens from the icon button and its tooltip still shows.
  - The row actions menu Edit opens the sheet, and Delete opens the dialog. Cancel and Delete work on both desktop (dialog) and mobile (drawer).
  - The feature-flag toggle selects, deselects and shows its tooltip after about 700ms.
  - The pagination rows-per-page select works.

Final: 0 non-baseline tsc errors in `tablecn` paths. The 10 remaining `tablecn` regex hits are all baseline errors in other files: dictionary-type messages that merely contain the word "tablecn".
