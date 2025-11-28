# Refactor Block Command

Refactor an existing block to follow project conventions and best practices.

## Usage
```
/refactor-block <block-name>
```

## Arguments
- `$ARGUMENTS` - Name of the block to refactor (e.g., `auth`, `stripe`, `dashboard`)

## Refactoring Steps

### Step 1: Locate Block

Find the block at:
- Route: `src/app/[lang]/(root)/blocks/$ARGUMENTS/`
- Components: `src/components/root/block/$ARGUMENTS/`

If not found, search for:
- `src/components/*/$ARGUMENTS/`
- `src/app/[lang]/**/$ARGUMENTS/`

### Step 2: Analyze Current State

Review all files and check for:
- [ ] Non-standard imports (`@/registry/*`)
- [ ] Hardcoded colors (hex, rgb values)
- [ ] Missing TypeScript types (`any` usage)
- [ ] Missing i18n support (hardcoded strings)
- [ ] Missing RTL support (ml/mr instead of ms/me)
- [ ] Non-atomic component structure (monolithic files)
- [ ] Missing `data-slot` attributes
- [ ] Client-only components that could be Server

### Step 3: Apply File Structure Standards

Ensure block has standard files:
```
src/components/root/block/{block}/
├── content.tsx      # Main composition
├── config.ts        # Configuration
├── type.ts          # TypeScript types
├── validation.ts    # Zod schemas (if forms)
├── README.md        # Documentation
```

Create missing files with appropriate templates.

### Step 4: Fix Import Paths

Transform all imports:
```typescript
// Before
import { Button } from "@/registry/default/ui/button"
import { cn } from "../utils"

// After
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### Step 5: Fix Styling

Replace hardcoded values:
```typescript
// Before
style={{ color: '#1a1a1a' }}
className="text-[#666] bg-[#fff]"

// After
className="text-foreground"
className="text-muted-foreground bg-background"
```

Fix RTL-incompatible classes:
```typescript
// Before
className="ml-4 pl-2 text-left mr-auto"

// After
className="ms-4 ps-2 text-start me-auto"
```

### Step 6: Add Type Safety

Create proper TypeScript interfaces:
```typescript
// type.ts
export interface BlockProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  lang: Locale
}

export interface BlockData {
  // Define data structure
}
```

Remove all `any` types and add proper typing.

### Step 7: Add Zod Validation

For forms, create validation schemas:
```typescript
// validation.ts
import { z } from "zod"

export const blockFormSchema = z.object({
  field1: z.string().min(1, "Required"),
  field2: z.string().email("Invalid email"),
})

export type BlockFormData = z.infer<typeof blockFormSchema>
```

### Step 8: Add i18n Support

Extract hardcoded strings:

1. Add to `src/components/local/en.json`:
```json
{
  "blocks": {
    "{block}": {
      "title": "Block Title",
      "description": "Description",
      "actions": { "submit": "Submit", "cancel": "Cancel" }
    }
  }
}
```

2. Add to `src/components/local/ar.json` (Arabic translations)

3. Update component to use dictionary:
```typescript
<h1>{dictionary.blocks.{block}.title}</h1>
```

### Step 9: Optimize Server/Client Split

Identify client-only code:
- useState, useEffect hooks
- Event handlers
- Browser APIs

Extract to smallest possible scope:
```typescript
// content.tsx (Server Component)
export function BlockContent({ dictionary, lang }) {
  return (
    <div>
      <BlockHeader /> {/* Server */}
      <BlockFormClient /> {/* Client - only interactive part */}
    </div>
  )
}
```

### Step 10: Add Documentation

Create/update README.md:
```markdown
# {Block Name}

## Overview
{Description}

## Usage
\`\`\`tsx
import BlockContent from "@/components/root/block/{block}/content"
<BlockContent dictionary={dictionary} lang={lang} />
\`\`\`

## Props
| Prop | Type | Description |
|------|------|-------------|
| dictionary | Dictionary | i18n dictionary |
| lang | Locale | Current locale |

## Dependencies
- @/components/ui/button
- @/components/ui/card
```

## Output

After refactoring, display:
```
✅ Block "{block-name}" refactored successfully!

📝 Changes made:
  - Fixed 5 import paths
  - Replaced 3 hardcoded colors
  - Added TypeScript types (removed 4 'any')
  - Added i18n support (12 strings extracted)
  - Fixed RTL compatibility (8 classes updated)
  - Optimized Server/Client split

📁 Files modified:
  - content.tsx
  - type.ts (created)
  - validation.ts (created)
  - README.md (updated)

🌐 Dictionary entries added:
  - en.json: 12 new keys
  - ar.json: 12 new keys (needs translation review)

⚠️ Manual review needed:
  - Arabic translations in ar.json
  - Test RTL layout at /ar/blocks/{block-name}
```
