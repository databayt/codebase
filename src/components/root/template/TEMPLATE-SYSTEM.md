# Template System Architecture

## Overview
This template system is a feature-complete clone of shadcn's blocks system, adapted to our architecture with the following key differences:
- Uses "template/templates" terminology instead of "block/blocks"
- All templates live in a feature-based structure under `src/components/root/template/`
- Templates import UI components from `@/components/ui/` instead of external registry
- Each template is self-contained in its own directory

## Directory Structure
```
src/
├── components/
│   ├── template/                # All template implementations
│   │   ├── login-01/            # Login template (reference)
│   │   │   ├── page.tsx         # Main template component
│   │   │   └── components/      # Template-specific components
│   │   │       └── *.tsx
│   │   ├── dashboard-01/        # Dashboard template
│   │   ├── header-01/           # Header template
│   │   ├── sidebar-01/          # Sidebar template
│   │   └── [template-name]/     # Additional templates
│   └── root/template/           # Template system core
│       ├── registry/            # Template registry and metadata
│       │   ├── index.ts         # Main registry export
│       │   ├── registry.ts      # Schema definitions
│       │   ├── registry-templates.ts # Template definitions
│       │   └── registry-*.ts    # Other registry files
│       ├── scripts/             # Build and tooling
│       │   └── build-registry.mts # Registry build script
│       ├── template-viewer.tsx  # Template preview component
│       ├── template-display.tsx # Template display wrapper
│       ├── config.ts            # Configuration
│       └── index.ts             # Main exports

```

## Adding a New Template

### Step 1: Create Template Directory
```bash
mkdir -p src/components/template/[template-name]
mkdir -p src/components/template/[template-name]/components
```

### Step 2: Create Template Files
Create `page.tsx` as the main entry:
```tsx
// src/components/template/[template-name]/page.tsx
export default function TemplateName() {
  return (
    <div>
      {/* Template content */}
    </div>
  )
}
```

Create component files in `components/`:
```tsx
// src/components/template/[template-name]/components/component.tsx
import { Button } from "@/components/ui/button"  // Use local UI components

export function Component() {
  return <Button>Click me</Button>
}
```

### Step 3: Register Template
Add to `src/components/root/template/registry/registry-templates.ts`:
```typescript
{
  name: "template-name",
  description: "Template description",
  type: "registry:template",
  registryDependencies: ["button", "card"],  // UI components used
  files: [
    {
      path: "template/template-name/page.tsx",
      target: "app/template-name/page.tsx",  // Installation target
      type: "registry:page",
    },
    {
      path: "template/template-name/components/component.tsx",
      type: "registry:component",
    },
  ],
  categories: ["dashboard", "layout"],  // Template categories
}
```

### Step 4: Test Template
1. Run the build script: `tsx scripts/build-registry.mts`
2. Import and use in your app
3. Verify in template viewer

## Import Rules

### ✅ DO Import From:
- `@/components/ui/*` - UI components
- `@/lib/utils` - Utility functions
- `@/hooks/*` - Custom hooks
- `./components/*` - Template-specific components (relative)

### ❌ DON'T Import From:
- `@/registry/*` - External registry paths
- `@/registry/default/*` - shadcn registry paths
- `@/registry/new-york/*` - Style-specific paths

## Template Categories

Available categories (from `registry-categories.ts`):
- `authentication` - Login, register, auth flows
- `dashboard` - Admin panels, dashboards
- `sidebar` - Navigation sidebars
- `hero` - Hero sections
- `marketing` - Landing pages
- `ecommerce` - Shop components
- `calendar` - Date/time components
- `forms` - Form layouts
- `charts` - Data visualization

## Template Metadata

Each template should include:
- `name`: Unique identifier (kebab-case)
- `description`: Clear description
- `type`: Always "registry:template"
- `dependencies`: NPM packages (if any)
- `registryDependencies`: UI components used
- `files`: List of template files
- `categories`: Relevant categories
- `meta`: Optional metadata (preview height, etc.)

## Testing Templates

### Local Testing
```tsx
import Template from "@/components/template/[name]/page"

<Template />
```

### Template Viewer
Templates are automatically available in the viewer at:
`/templates/[template-name]`

### Build Verification
```bash
cd src/components/root/template/scripts
tsx build-registry.mts
```

## Best Practices

1. **Self-Contained**: Each template should be fully self-contained
2. **No External Dependencies**: Use only local UI components
3. **Responsive**: Templates must be mobile-friendly
4. **Accessible**: Follow WCAG guidelines
5. **Theme Support**: Support light/dark themes
6. **TypeScript**: Use proper types, no `any`
7. **Documentation**: Include usage examples

## Reference Implementation

`login-01` serves as the reference template:
- Proper file structure
- Correct import paths
- Component organization
- Registry configuration

Study this template when creating new ones.

## Troubleshooting

### Import Errors
- Ensure you're importing from `@/components/ui/` not registry paths
- Check that UI components exist

### Build Errors
- Verify registry entry matches file structure
- Check file paths are relative to template root
- Ensure all dependencies are listed

### Preview Issues
- Check template is registered in registry
- Verify page.tsx exports default component
- Check for runtime errors in console

## Future Enhancements

- [ ] Template CLI tool for scaffolding
- [ ] Template preview images
- [ ] Template variations (style variants)
- [ ] Template composition (combining templates)
- [ ] Template customization API
- [ ] Automated testing suite