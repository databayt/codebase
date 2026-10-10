# templates (src/registry/bases/base/blocks — the 37 existing templates)

2026-10-10. The upstream base blocks were used as the pattern reference, but the changes were made by hand on our own files: our classes and content stay, lucide icons stay, imports stay `@/components/ui/*`, and no IconPlaceholder or "cn" import was added. Result: 57 files changed. No radix imports or radix CSS variables are left. tsc shows 0 errors in `src/registry/bases`, where there were 91 before the work (the baseline file has none for this path).

## Files changed
- _registry.ts — footer-02: added `dependencies: ["@tabler/icons-react"]` because the radix icons were replaced
- dashboard-01/components/app-sidebar.tsx — SidebarMenuButton asChild -> render={<a/>}
- dashboard-01/components/chart-area-interactive.tsx — ToggleGroup: dropped type="single", value is now an array, onValueChange takes value[0] and falls back to "90d". Select: onValueChange guards against null, and `items` was added so SelectValue shows labels
- dashboard-01/components/data-table.tsx — Checkbox `"indeterminate"` -> separate `indeterminate` prop. DropdownMenuTrigger, DrawerTrigger and DrawerClose asChild -> render. Drawer `direction` -> `swipeDirection` ("bottom" -> "down"). data-[state=open] -> data-popup-open. View Select gets `items`
- dashboard-01/components/nav-documents.tsx — asChild -> render, data-popup-open
- dashboard-01/components/nav-secondary.tsx — asChild -> render
- dashboard-01/components/nav-user.tsx — asChild -> render, data-popup-open, `--radix-dropdown-menu-trigger-width` -> `--anchor-width`, label wrapped in DropdownMenuGroup
- dashboard-01/components/site-header.tsx — Button asChild<a> -> render={<a/>} with nativeButton={false}
- footer-02/page.tsx — @radix-ui/react-icons -> @tabler/icons-react (IconBrandTwitter/Github/Linkedin, IconVideo). lucide 1.x no longer ships brand icons
- header-01/page.tsx — SheetTrigger asChild -> render
- header-02/page.tsx — NavigationMenuLink asChild -> render={<Link/>}. The `<Link legacyBehavior passHref><NavigationMenuLink>` pattern -> NavigationMenuLink render={<Link/>}. data-[active] -> data-active, and the dead data-[state=open] class was dropped. DropdownMenuTrigger asChild -> render. `forceMount` removed from DropdownMenuContent
- leads-01/page.tsx — DialogTrigger asChild -> render
- leads-01/components/all.tsx — DropdownMenuTrigger asChild -> render. "Actions" label + its items wrapped in DropdownMenuGroup
- leads-01/components/form.tsx — both Selects get `items` (status/source label maps) so SelectValue shows "New" and not "new"
- sidebar-01/components/{app-sidebar,version-switcher}.tsx — asChild -> render, onSelect -> onClick, data-popup-open, --anchor-width
- sidebar-02/components/{app-sidebar,version-switcher}.tsx — same. SidebarGroupLabel render={<CollapsibleTrigger/>} (same as upstream). group-data-open/collapsible
- sidebar-03, 04, 06, 14/components/app-sidebar.tsx — asChild -> render
- sidebar-05/components/app-sidebar.tsx — asChild -> render, group-data-open / group-data-closed on the collapsible
- sidebar-06/components/nav-main.tsx — DropdownMenuTrigger and DropdownMenuItem asChild -> render (Menu.Item renders a div, so nativeButton is not needed), data-popup-open
- sidebar-07/components/{nav-main,nav-projects,nav-user,team-switcher}.tsx — Collapsible render={<SidebarMenuItem/>}, CollapsibleTrigger render, group-data-open, data-popup-open, --anchor-width, labels in Group
- sidebar-08 and sidebar-16/components/{app-sidebar,nav-main,nav-projects,nav-secondary,nav-user}.tsx — same. The CollapsibleTrigger -> SidebarMenuAction class is now data-panel-open:rotate-90
- sidebar-09/components/{app-sidebar,nav-user}.tsx — asChild -> render, data-popup-open, --anchor-width, label in Group
- sidebar-10 and sidebar-15/components/{nav-favorites,nav-main,nav-secondary,nav-workspaces,team-switcher}.tsx (+ sidebar-10 nav-actions, sidebar-15 nav-user and calendars) — asChild -> render. PopoverTrigger: data-popup-open. nav-workspaces: data-panel-open:rotate-90. team-switcher: "Teams" label + items in DropdownMenuGroup
- sidebar-11/components/app-sidebar.tsx — CollapsibleTrigger render. `[&[data-state=open]>button>svg:first-child]` -> `[&[data-open]>…]`, which upstream base still has wrong, so the chevron did not rotate there
- sidebar-12/components/{calendars,nav-user}.tsx — SidebarGroupLabel render={<CollapsibleTrigger/>}, group-data-open, Group-wrapped label
- sidebar-13/components/settings-dialog.tsx — DialogTrigger and SidebarMenuButton asChild -> render

Formatting: prettier (repo options, without the import-sort plugin, which is not installed) ran only on files that were prettier-clean at HEAD. I left the other 14 files unformatted to avoid unrelated churn. Leftover scan: `grep -rn "radix\|asChild\|data-\[state=\|onSelect\|forceMount\|legacyBehavior\|delayDuration"` -> the only hit is `data-state={row.getIsSelected() && "selected"}` on TableRow in dashboard-01 data-table. That is TanStack row state, matched by ui/table's `data-[state=selected]`, and it is intentional.

## Runtime fixes tsc would not catch
- **DropdownMenuLabel outside a group crashes in Base UI.** Menu.GroupLabel throws "MenuGroupContext is missing" unless it is inside a Menu.Group. I wrapped the label in 11 files (every nav-user, every team-switcher, leads-01 all.tsx). Upstream base does the same.
- Select without `items` shows the raw value instead of the label. I added `items` wherever the label differs from the value (chart time range, data-table view, leads status/source).
- `w-[--radix-…]` was Tailwind v3 syntax and had no effect in v4, so these menus never matched the trigger width. They now use `w-(--anchor-width)`, so they will.

## Behavior changes (flagged)
- version-switcher (sidebar-01/02): onSelect -> onClick. Menu items still close on click, so nothing changes in practice.
- Tabs (dashboard-01 data-table, leads-01 page): Base UI activates tabs manually by default. Arrow keys move focus but no longer switch the panel. `activateOnFocus` was not added.
- ToggleGroup (dashboard chart): Base UI allows deselecting in single mode. The handler falls back to "90d". Radix set "" here, which left the chart on 90d without a selected button.
- header-02: `forceMount` was dropped from DropdownMenuContent. The menu now mounts only when open.
- Drawer (dashboard-01 TableCellViewer): this is now the Base UI drawer (swipeDirection), no longer vaul. Feel and animation differ (that comes from the ui/drawer wrapper).
- Menu/Popover trigger open styling now keys off `data-popup-open`, and the collapsible trigger off `data-panel-open`. Same look, new hook names.

## Gaps / leftovers
- None in this area. footer-02 no longer imports `@radix-ui/react-icons`, so that package can be removed once other areas are clear.
- leads-01/components/form.tsx still uses ui/form.tsx (FormControl etc.), which is on radix Slot until the form.tsx owner migrates it. No direct radix import in my files.
- hero-01..04, login-01/03/04, signup-01..05, subscription-01..03, footer-01 needed no changes.

## tsc
`npx tsc --noEmit -p tsconfig.json | grep "error TS" | grep src/registry/bases` -> **0** (was 91; baseline 0).
