# Common Issues and Fixes Memory

This memory bank tracks recurring issues encountered when processing blocks.

## Import & Module Issues

### Issue: Module Not Found
**Symptoms:**
- `Module not found: Can't resolve '@/components/ui/xxx'`
- TypeScript path resolution errors

**Root Causes:**
1. Missing shadcn/ui component not installed
2. Registry-style imports not transformed
3. Typo in import path
4. Missing from components.json

**Fixes:**
```bash
# Install missing shadcn component
npx shadcn@latest add button card input

# Verify components.json
cat components.json

# Check import path is correct
@/components/ui/button  # Not @/component/ui/button
```

---

### Issue: Import Transformation Incomplete
**Symptoms:**
- Mixed import styles in same file
- Some `@/registry/*` imports remain

**Root Causes:**
1. Unusual import format not matched by regex
2. Dynamic imports not processed
3. Re-exports not followed

**Fixes:**
```typescript
// Check for all patterns
@/registry/default/ui/
@/registry/new-york/ui/
@/registry/default/lib/
@/registry/*/hooks/

// Also check relative imports
../ui/button  → @/components/ui/button
../../lib/utils → @/lib/utils
```

---

## Runtime Issues

### Issue: Prisma Not Available in Edge Runtime
**Symptoms:**
- `PrismaClient is unable to be run in Edge Runtime`
- `Error: @prisma/client did not initialize yet`

**Root Causes:**
1. Missing `export const runtime = "nodejs"` in page
2. Client component importing server-only Prisma code
3. Middleware trying to use Prisma

**Fixes:**
```typescript
// Add to page.tsx that uses Prisma
export const runtime = "nodejs"

// Move Prisma queries to Server Components
// Or create API routes for client components
```

---

### Issue: Hydration Mismatch
**Symptoms:**
- `Text content did not match`
- `Hydration failed because the initial UI does not match`
- Console errors about server/client mismatch

**Root Causes:**
1. Date/time rendering without locale handling
2. Random values generated differently on server/client
3. Browser-only APIs used during SSR
4. Conditional rendering based on `window`

**Fixes:**
```typescript
// For dates - use suppressHydrationWarning
<time suppressHydrationWarning>
  {new Date().toLocaleDateString()}
</time>

// For random values - use useEffect
const [randomValue, setRandomValue] = useState(0)
useEffect(() => {
  setRandomValue(Math.random())
}, [])

// For browser APIs - check for client
const isClient = typeof window !== 'undefined'
```

---

## Styling Issues

### Issue: RTL Layout Breaking
**Symptoms:**
- Text alignment wrong in Arabic (`/ar/*`)
- Icons not mirroring
- Spacing inconsistent in RTL

**Root Causes:**
1. Using `ml/mr` instead of `ms/me`
2. Using `left/right` instead of `start/end`
3. Missing `dir` attribute on containers
4. Hardcoded `flex-row` without RTL variant

**Fixes:**
```typescript
// Spacing
ml-4 → ms-4
mr-4 → me-4
pl-2 → ps-2
pr-2 → pe-2

// Text
text-left → text-start
text-right → text-end

// Container
<div dir={lang === 'ar' ? 'rtl' : 'ltr'}>

// Flex with RTL
className="flex rtl:flex-row-reverse"
```

---

### Issue: CSS Variable Not Applied
**Symptoms:**
- Colors reverting to defaults
- Theme not switching
- Custom styles not working

**Root Causes:**
1. Variable name typo
2. Missing from globals.css
3. Wrong color format (not OKLCH)
4. CSS specificity issue

**Fixes:**
```css
/* Check variable exists in globals.css */
:root {
  --primary: oklch(0.5 0.2 240);
}

/* Use correct format */
.element {
  color: hsl(var(--primary));  /* For HSL */
  color: oklch(var(--primary)); /* For OKLCH */
}

/* Or use Tailwind */
className="text-primary bg-background"
```

---

## TypeScript Issues

### Issue: Type Inference Failure
**Symptoms:**
- `Type 'any' cannot be assigned to...`
- `Object is of type 'unknown'`
- `Property 'x' does not exist on type '{}'`

**Root Causes:**
1. Missing generic type parameters
2. Incomplete Zod schema
3. Missing await on async functions
4. Incorrect type assertion

**Fixes:**
```typescript
// Add explicit types
const data: DataType = await fetchData()

// Use satisfies for type checking
const config = {
  key: "value"
} satisfies ConfigType

// Type assertions (use sparingly)
const element = document.getElementById('id') as HTMLInputElement
```

---

### Issue: Zod Schema Type Mismatch
**Symptoms:**
- Form data type doesn't match schema
- Validation errors at runtime
- TypeScript errors on form submission

**Root Causes:**
1. Schema updated but type not regenerated
2. Optional fields not marked correctly
3. Transform/refine changing shape

**Fixes:**
```typescript
// Always derive type from schema
const schema = z.object({
  email: z.string().email(),
  age: z.number().optional(),
})

type FormData = z.infer<typeof schema>

// Use z.output for transformed types
const transformedSchema = z.string().transform(s => s.toLowerCase())
type Output = z.output<typeof transformedSchema> // string
```

---

## Build Issues

### Issue: Build Failure After Block Add
**Symptoms:**
- TypeScript errors during `pnpm build`
- ESLint errors
- Missing dependencies

**Root Causes:**
1. Incomplete type transformation
2. Missing props in component usage
3. Version mismatch in dependencies
4. Unused imports

**Fixes:**
```bash
# Full type check
pnpm tsc --noEmit

# Lint check
pnpm lint

# Find problematic imports
grep -r "@/registry/" src/

# Check for hardcoded colors
grep -rE "#[0-9a-fA-F]{3,6}" src/components/root/block/
```

---

## Dependency Issues

### Issue: Missing UI Component
**Symptoms:**
- `Could not resolve '@/components/ui/xxx'`
- Component renders as undefined

**Root Causes:**
1. Component not installed via shadcn CLI
2. Component name mismatch (button vs Button)
3. Missing from re-exports

**Fixes:**
```bash
# Install via shadcn CLI
npx shadcn@latest add button card input dialog

# Check available components
ls src/components/ui/

# Verify export exists
grep "export" src/components/ui/button.tsx
```

---

### Issue: Peer Dependency Warning
**Symptoms:**
- `WARN: peer dependency not satisfied`
- Package may not work correctly

**Root Causes:**
1. Version mismatch between packages
2. Missing peer dependency
3. Conflicting versions

**Fixes:**
```bash
# Check peer dependencies
pnpm why react

# Install specific version
pnpm add react@19

# Force resolution in package.json
"pnpm": {
  "overrides": {
    "react": "19.0.0"
  }
}
```

---

## Quick Reference Commands

```bash
# Diagnose common issues
pnpm lint                                    # Check ESLint
pnpm tsc --noEmit                           # Check TypeScript
grep -r "@/registry/" src/                  # Find registry imports
grep -rE "#[0-9a-fA-F]{3,6}" src/          # Find hardcoded colors
grep -r "any" src/components/root/block/    # Find any types

# Fix common issues
npx shadcn@latest add [component]           # Install UI component
pnpm install                                # Reinstall deps
pnpm prisma generate                        # Regenerate Prisma

# Verify fixes
pnpm dev                                    # Start dev server
# Visit /en/blocks/{block} and /ar/blocks/{block}
```

---

## Issues Log

<!-- Claude Code appends new issues discovered during block processing -->

### Encountered Issues
| Date | Block | Issue | Resolution |
|------|-------|-------|------------|
| - | - | - | - |
