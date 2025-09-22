# Template Registry System

## Overview
The template registry system provides a collection of reusable UI templates that follow your project's architectural principles.

## Structure

```
src/registry/
├── default/                  # Default style templates
│   ├── templates/           # Template components
│   ├── ui/                 # UI components
│   └── lib/                # Utilities
├── new-york/               # New York style templates
│   ├── templates/          # Template components
│   ├── ui/                # UI components
│   └── lib/               # Utilities
├── registry-templates.ts  # Template definitions
├── registry-categories.ts # Category definitions
└── schema.ts              # TypeScript types
```

## Available Templates

### Leads Management (`leads-01`)
A complete lead management interface with:
- Form validation (react-hook-form + Zod)
- Data tables with actions
- Analytics cards
- Featured leads section

### Hero Section (`hero-01`)
Modern landing page hero with:
- Gradient backgrounds
- CTA buttons
- Statistics display

## Adding New Templates

1. Create template directory: `src/registry/new-york/templates/[template-name]/`
2. Add components following the pattern:
   - `page.tsx` - Main component
   - `components/` - Sub-components
3. Register in `registry-templates.ts`
4. Run `pnpm build:registry` to generate files

## Usage

Templates are displayed in `/templates` page, integrated with existing template showcase.

### File Patterns (Following Architecture)
- `content.tsx` - Main UI composition
- `form.tsx` - Form components
- `card.tsx` - Card components
- `all.tsx` - List views
- `featured.tsx` - Featured items
- `validation.ts` - Zod schemas
- `type.ts` - TypeScript types
- `action.ts` - Server actions

## Build Commands

```bash
# Build registry files
pnpm build:registry

# Start development server
pnpm dev
```

## Integration Points

- Templates page: `/[lang]/templates`
- Individual preview: `/[lang]/templates/[name]`
- Auto-generated files: `__registry__/` and `public/r/`