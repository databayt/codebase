# Refactoring Patterns Memory

This memory bank stores common refactoring patterns and their solutions for blocks in this codebase.

## Import Transformations

### Pattern: Registry Import Migration
**Problem:** Block uses `@/registry/*` imports from external sources
**Frequency:** Very common
**Auto-fixable:** Yes

```typescript
// Find and replace
@/registry/default/ui/   → @/components/ui/
@/registry/new-york/ui/  → @/components/ui/
@/registry/default/lib/  → @/lib/
@/registry/*/lib/utils   → @/lib/utils
@/registry/*/hooks/      → @/hooks/
```

---

## Color Transformations

### Pattern: Hardcoded Colors to Theme Variables
**Problem:** Colors defined as hex/rgb instead of CSS variables
**Frequency:** Common
**Auto-fixable:** Partial (need review)

```typescript
// Common mappings
#000000, #0a0a0a, rgb(0,0,0)     → text-foreground
#ffffff, rgb(255,255,255)        → bg-background
#666666, #6b7280, gray-500       → text-muted-foreground
#3b82f6, blue-500                → text-primary
#ef4444, red-500                 → text-destructive
#22c55e, green-500               → text-success
#f59e0b, amber-500               → text-warning

// Background colors
bg-white, bg-[#fff]              → bg-background
bg-gray-100, bg-[#f5f5f5]        → bg-muted
bg-gray-900, bg-[#1a1a1a]        → bg-card

// Border colors
border-gray-200                   → border-border
border-gray-300                   → border-input
```

---

## RTL Transformations

### Pattern: Directional to Logical Properties
**Problem:** Using `left/right` instead of `start/end`
**Frequency:** Common
**Auto-fixable:** Yes

```typescript
// Margin/Padding
ml-*  → ms-*  (margin-inline-start)
mr-*  → me-*  (margin-inline-end)
pl-*  → ps-*  (padding-inline-start)
pr-*  → pe-*  (padding-inline-end)

// Text alignment
text-left   → text-start
text-right  → text-end

// Positioning
left-*   → start-*
right-*  → end-*

// Border radius
rounded-l-*  → rounded-s-*
rounded-r-*  → rounded-e-*

// Flex/Grid
flex-row → (keep, add rtl:flex-row-reverse if needed)
justify-start → (keep, works with logical)
```

---

## TypeScript Patterns

### Pattern: Any Type Removal
**Problem:** Components use `any` or lack proper interfaces
**Frequency:** Common
**Auto-fixable:** Partial

```typescript
// Before
function handleSubmit(data: any) { ... }
const items: any[] = []

// After - Create interfaces
interface FormData {
  field1: string
  field2: number
}

function handleSubmit(data: FormData) { ... }
const items: ItemType[] = []
```

### Pattern: Dictionary Prop Typing
**Problem:** Missing dictionary prop type
**Frequency:** Common
**Auto-fixable:** Yes (template)

```typescript
// Standard dictionary prop pattern
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface Props {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  lang: Locale
}
```

---

## Component Patterns

### Pattern: Client-Only to Server/Client Split
**Problem:** Entire component marked `"use client"` unnecessarily
**Frequency:** Common
**Auto-fixable:** No (requires analysis)

```typescript
// Before: Everything client-side
"use client"
export function Component() {
  const [state, setState] = useState()
  return (
    <div>
      <Header />        {/* Static - could be server */}
      <Form />          {/* Interactive - needs client */}
      <Footer />        {/* Static - could be server */}
    </div>
  )
}

// After: Server Component with client islands
// content.tsx (Server)
export function Component() {
  return (
    <div>
      <Header />
      <FormClient />    {/* Only this is client */}
      <Footer />
    </div>
  )
}

// form-client.tsx (Client)
"use client"
export function FormClient() {
  const [state, setState] = useState()
  // Interactive logic only
}
```

### Pattern: Monolithic to Composed
**Problem:** Large 500+ line component with mixed concerns
**Frequency:** Occasional
**Auto-fixable:** No

```typescript
// Before: Single file with everything
export function BigComponent() {
  // 500 lines of mixed UI, logic, data fetching
}

// After: Composed from smaller pieces
// content.tsx
export function Content() {
  return (
    <Layout>
      <Header />
      <MainSection />
      <Sidebar />
    </Layout>
  )
}

// components/header.tsx
// components/main-section.tsx
// components/sidebar.tsx
```

---

## i18n Patterns

### Pattern: Hardcoded Strings Extraction
**Problem:** User-facing strings hardcoded in components
**Frequency:** Very common
**Auto-fixable:** Partial

```typescript
// Before
<Button>Submit</Button>
<p>Loading...</p>

// After
<Button>{dictionary.common.submit}</Button>
<p>{dictionary.common.loading}</p>

// Dictionary entries
{
  "common": {
    "submit": "Submit",
    "cancel": "Cancel",
    "loading": "Loading...",
    "error": "An error occurred"
  }
}
```

### Pattern: RTL Direction Support
**Problem:** Missing dir attribute for RTL layout
**Frequency:** Common
**Auto-fixable:** Yes

```typescript
// Before
<div className="...">

// After
<div
  dir={lang === 'ar' ? 'rtl' : 'ltr'}
  className="..."
>
```

---

## File Structure Patterns

### Pattern: Missing Standard Files
**Problem:** Block missing required files
**Frequency:** Common
**Auto-fixable:** Yes (templates)

Required files for a complete block:
1. `content.tsx` - Main composition
2. `config.ts` - Configuration and constants
3. `type.ts` - TypeScript interfaces
4. `README.md` - Documentation

Optional files:
- `validation.ts` - Zod schemas (if forms)
- `actions.ts` - Server actions (if mutations)
- `use-{block}.ts` - Custom hooks (if stateful)

---

## Learning Log

<!-- Claude Code appends new patterns discovered during refactoring -->

### Added Patterns
| Date | Pattern | Source Block | Description |
|------|---------|--------------|-------------|
| - | - | - | - |
