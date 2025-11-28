# Add Block Command

Add a new block from any source (GitHub, shadcn registry, Magic UI, Aceternity, or local files).

## Usage
```
/add-block <source>
```

## Source Types
- **GitHub**: `github.com/user/repo/tree/main/blocks/auth`
- **shadcn**: `shadcn:sidebar-07` or `sidebar-07`
- **Local**: `./downloads/auth-block/` or `C:\path\to\block`
- **Gist**: `gist.github.com/user/id`
- **Magic UI**: `magicui:animated-card`
- **Aceternity**: `aceternity:spotlight`

## Processing Steps

### Step 1: Identify Source
Parse the source argument: `$ARGUMENTS`

Determine source type:
- Contains `github.com` → GitHub repository
- Contains `gist.github.com` → GitHub Gist
- Starts with `shadcn:` or matches registry names → shadcn registry
- Starts with `magicui:` → Magic UI component
- Starts with `aceternity:` → Aceternity component
- Starts with `./` or `C:\` or `/` → Local file/folder

### Step 2: Fetch Block Files
For remote sources, use WebFetch to retrieve files.
For local sources, read from filesystem.

Analyze the fetched content:
- Identify main component file(s)
- List all imports
- Check for package.json or dependencies

### Step 3: Analyze Dependencies

Extract from imports:
- shadcn/ui components (e.g., Button, Card, Input)
- npm packages (e.g., framer-motion, react-hook-form)
- Radix UI primitives

Check which dependencies exist in `src/components/ui/` and which need installation.

### Step 4: Transform Imports

Apply import transformations:
```
@/registry/default/ui/* → @/components/ui/*
@/registry/new-york/ui/* → @/components/ui/*
@/registry/lib/utils → @/lib/utils
@/registry/hooks/* → @/hooks/*
```

### Step 5: Create Mirror-Pattern Structure

Generate block name from source (or ask user if unclear).

Create route directory:
```
src/app/[lang]/(root)/blocks/{block-name}/page.tsx
```

Create component directory:
```
src/components/root/block/{block-name}/
├── content.tsx
├── config.ts
├── type.ts
└── README.md
```

### Step 6: Apply Project Conventions

For each file:
- Remove hardcoded colors, use theme variables
- Add TypeScript types (no `any`)
- Add `data-slot` attributes for components
- Ensure `cn()` utility usage for class merging
- Add runtime export if Prisma/bcrypt detected

### Step 7: Add i18n Support

Extract user-facing strings:
- Create entries in `src/components/local/en.json`
- Create Arabic entries in `src/components/local/ar.json`
- Update component to use `dictionary` prop
- Add `dir` attribute for RTL support

### Step 8: Register Block

Add to `src/components/root/block/config.ts`:
```typescript
{
  id: "{block-name}",
  title: "{Block Title}",
  description: "{Description from source}",
  icon: "{Icon}", // Suggest based on block type
  href: "/blocks/{block-name}",
}
```

### Step 9: Install Dependencies

If missing shadcn components:
```bash
npx shadcn@latest add button card input ...
```

If missing npm packages:
```bash
pnpm add framer-motion react-hook-form ...
```

### Step 10: Verify Installation

- Run TypeScript check: `pnpm tsc --noEmit`
- Start dev server and visit `/en/blocks/{block-name}`
- Check for console errors
- Test RTL with `/ar/blocks/{block-name}`

## Output

After successful processing, display:
```
✅ Block "{block-name}" added successfully!

📁 Files created:
  - src/app/[lang]/(root)/blocks/{block-name}/page.tsx
  - src/components/root/block/{block-name}/content.tsx
  - src/components/root/block/{block-name}/config.ts
  - src/components/root/block/{block-name}/type.ts

📦 Dependencies installed:
  - button (shadcn)
  - card (shadcn)
  - framer-motion (npm)

🌐 i18n entries added:
  - en.json: blocks.{block-name}.*
  - ar.json: blocks.{block-name}.*

🔗 View block at: http://localhost:3000/en/blocks/{block-name}
```

## Error Handling

If any step fails:
1. Show clear error message
2. Suggest resolution
3. Offer to rollback partial changes

Common errors:
- Source not found → Check URL/path
- Missing UI component → Install via shadcn CLI
- Type errors → Review transformed code
- Import resolution → Check path aliases
