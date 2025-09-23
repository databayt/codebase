# Template System Architecture

## Overview

This template system implements a shadcn-inspired blocks architecture adapted to our component-driven, mirror-pattern codebase. It provides a registry-based system for distributing reusable UI templates while maintaining our established architectural principles.

## Core Architecture Principles

### 1. Registry-Based Distribution
- **Purpose**: Centralized template registry following shadcn's blocks pattern
- **Structure**: Templates are defined in registry with metadata, dependencies, and file mappings
- **Distribution**: Templates can be consumed via registry API or direct imports

### 2. Feature-Based Organization
- **System Code**: Lives in `src/components/root/template/` (registry, viewer, config)
- **Template Code**: Lives in `src/components/template/` (actual template implementations)
- **Separation**: Clear boundary between system infrastructure and template content

### 3. Component-Driven Modularity
- **Self-Contained**: Each template is a complete, independent feature
- **Reusable**: Templates compose shadcn/ui components from `@/components/ui/`
- **Extensible**: Easy to add new templates following established patterns

## Directory Structure

```
src/
├── components/
│   ├── root/
│   │   └── template/                    # Template System Infrastructure
│   │       ├── registry/                # Registry definitions
│   │       │   ├── index.ts            # Main registry export
│   │       │   ├── registry.ts         # Zod schemas and types
│   │       │   ├── registry-templates.ts # Template definitions
│   │       │   ├── registry-categories.ts # Category taxonomy
│   │       │   ├── registry-styles.ts  # Style variants
│   │       │   ├── registry-colors.ts  # Color system
│   │       │   └── registry-icons.ts   # Icon mappings
│   │       ├── scripts/
│   │       │   └── build-registry.mts  # Build script
│   │       ├── template-viewer.tsx     # Preview/code viewer component
│   │       ├── template-display.tsx    # Display wrapper with data fetching
│   │       ├── config.ts               # System configuration
│   │       ├── content.tsx             # Page composition
│   │       ├── hero.tsx                # Hero section
│   │       ├── tabs.tsx                # Tab navigation
│   │       └── all.tsx                 # Template listing
│   │
│   └── template/                        # Template Implementations
│       ├── login-01/                   # Login template
│       │   ├── page.tsx               # Main template component
│       │   └── components/            # Template-specific components
│       │       └── login-form.tsx
│       ├── hero-01/                    # Hero section template
│       │   └── page.tsx
│       ├── header-01/                  # Header navigation
│       ├── sidebar-01/                 # Sidebar navigation
│       ├── footer-01/                  # Footer template
│       └── cards/                      # Card components
│
└── app/
    └── [lang]/
        └── (root)/
            └── templates/
                └── [...categories]/     # Dynamic template routes
                    └── page.tsx
```

## Component Architecture

### System Components

#### TemplateViewer (`template-viewer.tsx`)
- **Purpose**: Provides preview/code toggle functionality like shadcn blocks
- **Features**:
  - Preview mode with responsive sizing (desktop/tablet/mobile)
  - Code view with syntax highlighting
  - File tree navigation
  - Copy code functionality
  - CLI command display

#### TemplateDisplay (`template-display.tsx`)
- **Purpose**: Data fetching and caching layer
- **Features**:
  - React cache for registry items
  - File tree generation
  - Code highlighting
  - Server-side rendering

#### Registry System (`registry/`)
- **Purpose**: Template metadata and distribution
- **Structure**:
  - `registry.ts`: Zod schemas for type safety
  - `registry-templates.ts`: Template definitions
  - `registry-categories.ts`: Category taxonomy
  - Type-safe validation and parsing

### Template Components

Templates follow these conventions:

1. **Main Entry**: `page.tsx` exports default component
2. **Sub-components**: Live in `components/` subdirectory
3. **Imports**: Use `@/components/ui/*` for UI components
4. **Self-contained**: No external dependencies outside registry

## Registry Schema

```typescript
interface RegistryItem {
  name: string                    // Unique identifier (kebab-case)
  type: "registry:template"       // Item type
  description?: string             // Human-readable description
  dependencies?: string[]          // NPM dependencies
  registryDependencies?: string[]  // UI component dependencies
  files?: RegistryItemFile[]      // Template files
  categories?: string[]            // Template categories
  meta?: {                        // Additional metadata
    iframeHeight?: string
    [key: string]: any
  }
}

interface RegistryItemFile {
  path: string      // Source file path
  content?: string  // File content (populated at build)
  type?: string     // File type (registry:page, registry:component)
  target?: string   // Installation target path
}
```

## Adding New Templates

### Step 1: Create Template Structure

```bash
# Create template directory
mkdir -p src/components/template/dashboard-01
mkdir -p src/components/template/dashboard-01/components

# Create main template file
touch src/components/template/dashboard-01/page.tsx
```

### Step 2: Implement Template

```tsx
// src/components/template/dashboard-01/page.tsx
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "./components/dashboard-header"
import { DashboardSidebar } from "./components/dashboard-sidebar"

export default function DashboardTemplate() {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <Card>
            <p>Dashboard content</p>
          </Card>
        </main>
      </div>
    </div>
  )
}
```

### Step 3: Register Template

```typescript
// src/components/root/template/registry/registry-templates.ts
{
  name: "dashboard-01",
  description: "Complete dashboard layout with sidebar and header",
  type: "registry:template",
  registryDependencies: ["card", "button", "sidebar"],
  files: [
    {
      path: "template/dashboard-01/page.tsx",
      target: "app/dashboard/page.tsx",
      type: "registry:page",
    },
    {
      path: "template/dashboard-01/components/dashboard-header.tsx",
      type: "registry:component",
    },
    {
      path: "template/dashboard-01/components/dashboard-sidebar.tsx",
      type: "registry:component",
    },
  ],
  categories: ["dashboard", "layout"],
  meta: {
    iframeHeight: "800px"
  }
}
```

### Step 4: Build Registry

```bash
# Run build script to generate registry files
cd src/components/root/template/scripts
tsx build-registry.mts
```

### Step 5: Test Template

1. **Direct Import**:
```tsx
import Dashboard from "@/components/template/dashboard-01/page"
<Dashboard />
```

2. **Via Template Viewer**:
Navigate to `/templates` to see your template in the viewer

3. **Via CLI** (when implemented):
```bash
npx shadcn add dashboard-01
```

## Template Categories

Templates are organized into categories for easier discovery:

- `authentication`: Login, register, password reset
- `dashboard`: Admin panels, analytics dashboards
- `hero`: Landing page hero sections
- `marketing`: Marketing pages, pricing, features
- `ecommerce`: Product listings, cart, checkout
- `blog`: Article layouts, blog listings
- `portfolio`: Portfolio showcases, galleries
- `forms`: Multi-step forms, contact forms
- `navigation`: Headers, sidebars, footers
- `cards`: Card-based layouts and components

## Import Path Guidelines

### ✅ Correct Imports
```tsx
// UI components from local registry
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Utilities
import { cn } from "@/lib/utils"

// Hooks
import { useTheme } from "@/hooks/use-theme"

// Relative imports for template components
import { Header } from "./components/header"
```

### ❌ Incorrect Imports
```tsx
// Don't import from external registries
import { Button } from "@/registry/default/ui/button"
import { Card } from "@/registry/new-york/ui/card"

// Don't use absolute paths for template components
import { Header } from "@/components/template/dashboard-01/components/header"
```

## Tabs Logic Implementation

The template viewer implements shadcn's tabs pattern:

### Preview/Code Toggle
```tsx
<Tabs defaultValue="preview" onValueChange={setView}>
  <TabsList>
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="code">Code</TabsTrigger>
  </TabsList>
</Tabs>
```

### Responsive Preview
```tsx
<ToggleGroup onValueChange={(value) => resizablePanel.resize(parseInt(value))}>
  <ToggleGroupItem value="100">Desktop</ToggleGroupItem>
  <ToggleGroupItem value="60">Tablet</ToggleGroupItem>
  <ToggleGroupItem value="30">Mobile</ToggleGroupItem>
</ToggleGroup>
```

### File Navigation
- Collapsible file tree in code view
- Active file highlighting
- Syntax-highlighted code display
- Copy code functionality

## Build Process

The `build-registry.mts` script:

1. **Validates** registry entries against schemas
2. **Reads** template files from filesystem
3. **Processes** imports (fixes registry paths)
4. **Generates** registry JSON files
5. **Creates** style variants
6. **Builds** index for quick lookups
7. **Outputs** to `public/r/` for serving

## API Reference

### Registry Functions

```typescript
// Get a single registry item
async function getRegistryItem(name: string): Promise<RegistryItem>

// Get registry index
async function getRegistryIndex(): Promise<RegistryItem[]>

// Create file tree from registry files
async function createFileTreeForRegistryItemFiles(
  files: RegistryItemFile[]
): Promise<FileTree>

// Highlight code with syntax highlighting
async function highlightCode(
  content: string,
  lang?: string
): Promise<string>
```

### Template Viewer Props

```typescript
interface TemplateViewerProps {
  item: RegistryItem           // Template registry item
  tree: FileTree | null        // File tree structure
  highlightedFiles: Array<{    // Files with syntax highlighting
    path: string
    content: string
    highlightedContent: string
  }>
}
```

## Performance Optimizations

### Caching Strategy
- React cache for registry items
- File tree caching
- Syntax highlighting cache
- 15-minute TTL for better performance

### Code Splitting
- Lazy loading for template components
- Dynamic imports for heavy dependencies
- Separate bundles for viewer and templates

### Server Components
- Registry fetching on server
- Syntax highlighting on server
- HTML streaming for faster loads

## Testing Guidelines

### Unit Testing
```typescript
// Test registry schema validation
test("validates template registry entry", () => {
  const result = registryItemSchema.safeParse(templateEntry)
  expect(result.success).toBe(true)
})

// Test file tree generation
test("creates correct file tree", async () => {
  const tree = await createFileTreeForRegistryItemFiles(files)
  expect(tree).toMatchSnapshot()
})
```

### Integration Testing
1. Template renders without errors
2. All dependencies are available
3. Responsive breakpoints work
4. Code copying functions correctly
5. File navigation works as expected

### Visual Testing
- Screenshot comparisons for templates
- Cross-browser testing
- Dark/light theme compatibility
- Mobile responsiveness

## Best Practices

### 1. Template Design
- **Responsive First**: Design for mobile, enhance for desktop
- **Accessible**: WCAG 2.1 AA compliance minimum
- **Themeable**: Support light/dark modes
- **Performant**: Lazy load heavy components
- **Composable**: Use small, reusable components

### 2. Code Quality
- **TypeScript**: Full type coverage, no `any`
- **ESLint**: Follow project rules
- **Comments**: Document complex logic
- **Testing**: Unit tests for utilities
- **Examples**: Provide usage examples

### 3. Documentation
- **README**: Each template should have docs
- **Props**: Document all component props
- **Examples**: Show different use cases
- **Migration**: Guide for customization

### 4. Registry Maintenance
- **Validation**: Run build script before commit
- **Dependencies**: Keep minimal and documented
- **Categories**: Use appropriate categories
- **Metadata**: Include preview dimensions

## Troubleshooting

### Common Issues

#### Import Resolution Errors
```
Module not found: Can't resolve '@/registry/default/ui/button'
```
**Solution**: Change to `@/components/ui/button`

#### Build Script Failures
```
Error: Template file not found
```
**Solution**: Ensure file paths in registry match filesystem

#### Preview Not Loading
```
Error: Failed to fetch registry item
```
**Solution**: Run build script to generate registry files

#### Styling Issues
```
Warning: Class names don't match
```
**Solution**: Ensure Tailwind classes are valid

### Debug Commands

```bash
# Validate registry
tsx scripts/validate-registry.ts

# Clean build artifacts
rm -rf public/r __registry__

# Rebuild registry
tsx scripts/build-registry.mts

# Test specific template
tsx scripts/test-template.ts login-01
```

## Migration from shadcn Blocks

When migrating shadcn blocks to our template system:

1. **Copy block files** to `src/components/template/[name]/`
2. **Update imports** from registry paths to local paths
3. **Create registry entry** in `registry-templates.ts`
4. **Test thoroughly** in viewer and direct import
5. **Document changes** in template README

## Future Enhancements

### Planned Features
- [ ] Template CLI for scaffolding new templates
- [ ] Visual template builder interface
- [ ] Template variations (multiple styles per template)
- [ ] Template composition (combining templates)
- [ ] AI-powered template generation
- [ ] Template marketplace integration

### Technical Improvements
- [ ] Better caching strategies
- [ ] Incremental build support
- [ ] Hot reload for template development
- [ ] Automated visual regression testing
- [ ] Performance monitoring
- [ ] Bundle size optimization

## Contributing

### Adding Templates
1. Follow the structure guidelines
2. Ensure accessibility standards
3. Add comprehensive examples
4. Update documentation
5. Submit PR with screenshots

### Improving System
1. Discuss in issues first
2. Maintain backward compatibility
3. Add tests for new features
4. Update documentation
5. Follow existing patterns

## References

- [shadcn/ui Blocks Documentation](https://ui.shadcn.com/docs/blocks)
- [Registry Schema](https://ui.shadcn.com/schema/registry-item.json)
- [Component Guidelines](../../../CLAUDE.md)
- [Architecture Principles](../../../README.md)