# Template Directory

All templates for the application live here. Each template is a self-contained component or page that can be reused across the application.

## Structure

```
src/components/template/
├── login-01/           # Login form template
│   ├── page.tsx       # Main template component
│   └── components/    # Sub-components
├── hero-01/           # Hero section template
│   └── page.tsx
├── header-01/         # Header template (components only)
├── header-02/         # Alternative header
├── sidebar-01/        # Sidebar template
├── footer-01/         # Footer template
└── cards/             # Card components
```

## Usage

Templates can be imported directly:

```tsx
import LoginTemplate from "@/components/template/login-01/page"
import HeroTemplate from "@/components/template/hero-01/page"
```

## Adding New Templates

1. Create a new directory: `src/components/template/[template-name]/`
2. Add `page.tsx` as the main component
3. Add any sub-components in `components/` subdirectory
4. Register in `src/components/root/template/registry/registry-templates.ts`

## Template Requirements

- Must import UI components from `@/components/ui/*`
- Should be responsive and accessible
- Support light/dark themes
- Use TypeScript with proper types
- Follow the existing naming convention (kebab-case with numeric suffix)

## Registry

All templates are registered in the template registry system located at:
`src/components/root/template/registry/`

This allows for:
- Metadata management
- Dependency tracking
- Category organization
- Build-time optimization