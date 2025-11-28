# Optimize Block Command

Optimize a block for performance, bundle size, and runtime efficiency.

## Usage
```
/optimize-block <block-name>
```

## Arguments
- `$ARGUMENTS` - Name of the block to optimize

## Optimization Steps

### Step 1: Performance Analysis

Analyze the block for:
- [ ] Server vs Client component boundaries
- [ ] Bundle size impact (heavy imports)
- [ ] Render performance (unnecessary re-renders)
- [ ] Data fetching patterns
- [ ] Image optimization
- [ ] CSS efficiency

### Step 2: Server Component Optimization

Default to Server Components where possible:

```typescript
// Before: Entire component is client
"use client"
export function DashboardBlock() {
  const [data, setData] = useState([])
  useEffect(() => { fetchData() }, [])
  return <DataTable data={data} />
}

// After: Server Component with data fetching
export async function DashboardBlock() {
  const data = await fetchDashboardData()
  return <DataTableClient initialData={data} />
}
```

Move `"use client"` to smallest possible scope.

### Step 3: Bundle Size Optimization

Audit imports for tree-shaking issues:
```typescript
// Before: Imports entire library
import { motion } from "framer-motion"

// After: Import specific exports
import { motion } from "framer-motion"
// Or use dynamic import for heavy components
const MotionDiv = dynamic(() =>
  import("framer-motion").then(mod => mod.motion.div)
)
```

Use dynamic imports for heavy dependencies:
```typescript
import dynamic from "next/dynamic"

const HeavyChart = dynamic(() => import("./heavy-chart"), {
  loading: () => <Skeleton className="h-[300px]" />,
  ssr: false, // If client-only
})
```

### Step 4: Render Optimization

Add memoization where needed:
```typescript
"use client"
import { memo, useMemo, useCallback } from "react"

// Memoize expensive computations
const processedData = useMemo(() =>
  expensiveProcess(data), [data]
)

// Memoize callbacks
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies])

// Memoize components
const MemoizedItem = memo(function Item({ data }) {
  return <div>{data.name}</div>
})
```

### Step 5: Suspense & Loading States

Add proper Suspense boundaries:
```typescript
import { Suspense } from "react"

export function BlockContent() {
  return (
    <div>
      <Header /> {/* Fast, render immediately */}
      <Suspense fallback={<TableSkeleton />}>
        <DataTable /> {/* Slow, suspend */}
      </Suspense>
    </div>
  )
}
```

Create loading.tsx for route:
```typescript
// src/app/[lang]/(root)/blocks/{block}/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
}
```

### Step 6: Image Optimization

Use Next.js Image component:
```typescript
// Before
<img src="/image.png" alt="..." />

// After
import Image from "next/image"
<Image
  src="/image.png"
  alt="..."
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="..."
  loading="lazy" // below-fold images
  priority // LCP images
/>
```

### Step 7: CSS Optimization

Consolidate Tailwind classes:
```typescript
// Before: Repetitive classes
<div className="flex flex-col items-center justify-center">
  <div className="flex flex-col items-center justify-center">

// After: Use cn() with shared styles
const centerFlex = "flex flex-col items-center justify-center"
<div className={cn(centerFlex)}>
  <div className={cn(centerFlex)}>
```

Remove unused custom CSS.

### Step 8: Data Fetching Optimization

Use React cache for deduplication:
```typescript
import { cache } from "react"

const getBlockData = cache(async (id: string) => {
  const data = await db.block.findUnique({ where: { id } })
  return data
})
```

Implement proper caching:
```typescript
// In fetch calls
const data = await fetch(url, {
  next: { revalidate: 3600 } // Cache for 1 hour
})

// Or for static data
export const revalidate = 3600
```

### Step 9: Error Boundary

Add error.tsx for graceful degradation:
```typescript
// src/app/[lang]/(root)/blocks/{block}/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Step 10: Accessibility Audit

Verify:
- [ ] ARIA attributes present
- [ ] Keyboard navigation works
- [ ] Focus management correct
- [ ] Color contrast sufficient
- [ ] Screen reader compatible

## Output Report

```markdown
## Optimization Report: {block-name}

### Performance Improvements
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Client JS | 45 KB | 12 KB | -73% |
| Server Components | 2 | 8 | +300% |
| Re-renders | 15 | 3 | -80% |

### Changes Made
1. ✅ Converted 6 components to Server Components
2. ✅ Added dynamic imports for framer-motion
3. ✅ Implemented Suspense boundaries
4. ✅ Added loading.tsx skeleton
5. ✅ Optimized 3 images with next/image
6. ✅ Added error.tsx boundary
7. ✅ Memoized 2 expensive computations

### Files Modified
- content.tsx (Server/Client split)
- loading.tsx (created)
- error.tsx (created)
- components/chart.tsx (dynamic import)

### Recommendations
- Consider adding react-query for complex data fetching
- Review database queries for N+1 issues
- Add metrics tracking for performance monitoring
```
