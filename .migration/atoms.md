# atoms — Radix -> Base UI consumer migration

2026-10-10. Strategy: transformation engine (hand-migrated against consumer-props.md / universal-patterns.md, verified in @base-ui/react d.ts + internals/useRenderElement.js). Verdict: atoms, hooks and kept ui files are radix-free; 0 non-baseline tsc errors.

## Changed

- src/components/atom/data-table.tsx: DropdownMenuTrigger `asChild` -> `render={<Button variant="outline" className="ml-auto" />}`.
- src/components/atom/direction-preview.tsx: DirectionProvider `dir` -> `direction`; DropdownMenuTrigger `asChild` -> `render={<Button variant="secondary" />}`.
- src/components/atom/modal-system.tsx: DialogTrigger `asChild` -> `render={<Button variant="outline" />}`.
- src/components/atom/page-actions.tsx: `<Button asChild><Link/></Button>` -> `<Button nativeButton={false} render={<Link ... />}>`.
- src/components/atom/two-buttons.tsx: same Button+Link conversion (x2).
- src/components/atom/team-member.tsx: PopoverTrigger `asChild` -> `render={<Button variant="outline" size="sm" className="ml-auto" />}` (CommandItem onSelect is cmdk, untouched).
- src/components/atom/prompt-input.tsx: ActionMenuTrigger `asChild` -> `render={<PromptInputButton ...>{children}</PromptInputButton>}` (children kept on the render element so PromptInputButton's icon/default size calc still sees them); ActionAddAttachments DropdownMenuItem `onSelect(e.preventDefault())` -> `closeOnClick={false}` + `onClick`.
- src/components/atom/labeled-select.tsx: Select onValueChange wrapped (Base gives `string | null`); public `onValueChange?: (value: string) => void` unchanged, null is dropped.
- src/components/atom/payment-method-selector.tsx: `peer-data-[state=checked]` -> `peer-data-checked`, `[&:has([data-state=checked])]` -> `[&:has([data-checked])]`.
- src/components/atom/reasoning.tsx: removed `@radix-ui/react-use-controllable-state` (inline `useControllableState` with the same semantics); CollapsibleContent `data-[state=open|closed]:*` -> `data-open:*` / `data-closed:*`.
- src/components/atom/faceted.tsx + src/components/ui/faceted.tsx: `onOpenChange` forwards Base's `eventDetails` (prop type is now `(open, eventDetails?) => void`; single-arg handlers still fine; details are undefined when Faceted self-closes after a single select); `origin-(--radix-popover-content...-transform-origin)` -> `origin-(--transform-origin)` (the atom one was a broken `content.tsx` var name).
- src/components/atom/sortable.tsx + src/components/ui/sortable.tsx: `@radix-ui/react-slot` / `radix-ui` Slot removed; SortableContent, SortableItem, SortableItemHandle now render through `useRender` (`@base-ui/react/use-render`).
- src/components/ui/form.tsx: radix Slot + Label types removed. FormControl rebuilt on `useRender`: the single child element is the render target, `id` / `aria-describedby` / `aria-invalid` / `data-slot` forwarded, child props win, handlers chain, className/style join, child ref (RHF `field.ref`) preserved (useRenderElement merges the render element's ref). Optional `render` prop added. FormLabel typed as `React.ComponentProps<typeof Label>` (our ui/label, native `<label>`). Exports (Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useFormField) identical.

Leftover scan: `grep -rnE "radix-ui|@radix-ui|asChild=|data-\[state=|--radix"` over all assigned paths -> clean (only remaining `data-state` is TableRow `data-state="selected"`, a plain table attribute the base table wrapper still styles).

### Sortable API (for table/ + tablecn/ call sites — coordinator request)

Every exported part, both `atom/sortable` and `ui/sortable`:
- `SortableContent` / `Content`: NEW `render?: useRender.RenderProp`; `asChild?: boolean` KEPT as `@deprecated` alias (its single child becomes the render target). `withoutSlot`, `strategy` unchanged.
- `SortableItem` / `Item`: NEW `render`; `asChild` KEPT (deprecated alias). `value`, `asHandle`, `disabled` unchanged.
- `SortableItemHandle` / `ItemHandle`: NEW `render`; `asChild` KEPT (deprecated alias). Default element still `<button type="button">`.
- `Sortable`/`Root`, `SortableOverlay`/`Overlay`: unchanged.
So all six-plus existing `asChild` call sites in table/** and tablecn/** compile and behave as before; they can move to Base style at leisure: `<SortableItem value={x} asChild><div .../></SortableItem>` -> `<SortableItem value={x} render={<div ... />}>...children</SortableItem>`. Once no call site uses asChild, delete the alias + `getRenderTarget` helper.

## Left alone

- src/components/ui/sonner.tsx, custom-video-player.tsx, international-demo.tsx: no radix imports (sonner is not radix).
- src/hooks/**, atom/ai/**, atom/modal/**: no radix imports or radix-only props.
- cmdk `CommandItem onSelect` in team-member.tsx and faceted.tsx: cmdk, not radix.
- data-table.tsx DropdownMenuCheckboxItem `onCheckedChange` and settings-toggle-row Switch `onCheckedChange`: signatures compatible.
- Pre-existing baseline errors in atoms (chat/data-table/team-member duplicate exports, dictionary `activityGoal`/`locale`, response.tsx streamdown/toast types): not migration-related.

## Behavior changes

- prompt-input "Add photos or files" item: Radix kept the menu open via `onSelect` preventDefault; now `closeOnClick={false}` + `onClick` (same visible behavior). Consumer `onClick` on this item is overridden (previously consumer `onSelect` was).
- data-table column toggle: Base `DropdownMenuCheckboxItem` defaults `closeOnClick` false — the menu stays open while toggling columns (Radix closed on select). Flagged, not patched.
- labeled-select: a null selection (Base can emit null) no longer reaches `onValueChange`.
- Faceted `onOpenChange` now receives a second `eventDetails` arg from Base UI.
- Reasoning collapse animation: keyframe `animate-in/out` now keyed on `data-open`/`data-closed` (Base Panel waits for animations before unmount).
- Buttons rendering `<Link>` (page-actions, two-buttons) use `nativeButton={false}` so Base doesn't add button semantics to the anchor.

## Verify by hand

- /atoms data-table: open Columns menu, toggle columns (note menu stays open), focus returns to trigger on Esc.
- direction preview: toggle RTL, menu opens aligned start in both directions.
- modal-system: open/close, focus returns to "Open Modal".
- page-actions / two-buttons: render as `<a>`, navigate, keyboard Enter works.
- team-member role popover: opens aligned end, picking a role fires onRoleChange.
- prompt-input: "+" opens menu, "Add photos or files" opens the file dialog.
- payment-method-selector: selected card gets primary border; clicking the label selects.
- reasoning: streams open, auto-closes ~1s after streaming, trigger toggles with animation.
- faceted (table filters): single select closes popover; multi select stays open.
- sortable (table sort/filter lists): drag by handle, keyboard reorder, overlay renders.
- any react-hook-form page: FormControl child gets id/aria-describedby; error sets aria-invalid and focus-on-error still targets the input.

## tsc

`npx tsc --noEmit -p tsconfig.json | grep -E "src/components/atom/|src/hooks/|src/components/ui/(form|faceted|sortable|custom-video-player|international-demo|sonner)"` vs baseline (file+message): **0 non-baseline errors** (was 13 before: data-table, direction-preview x2, faceted x2, labeled-select, modal-system, page-actions, prompt-input, team-member, two-buttons x2). No new errors elsewhere reference FormControl/Sortable/Faceted.
