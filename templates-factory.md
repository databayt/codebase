# Templates Factory

## Overview

The templates system provides full-page UI patterns and complete application layouts, mirroring shadcn/ui's blocks system. Templates are pre-built, production-ready page layouts that can be copied and customized for rapid application development.

## Architecture

### File Structure
```
src/registry/                       # Template registry
├── new-york/templates/             # New York style templates
│   ├── dashboard-01/               # Dashboard template
│   │   └── page.tsx               # Template component
│   ├── hero-01/                    # Hero section template
│   ├── login-01/                   # Login page template
│   ├── sidebar-01/                 # Sidebar layout template
│   └── leads-01/                   # Leads management template
│       ├── page.tsx               # Main template
│       └── components/            # Sub-components
│           ├── card.tsx
│           ├── content.tsx
│           ├── featured.tsx
│           └── form.tsx

src/app/[lang]/(root)/templates/    # Template showcase routes
├── [...categories]/                # Dynamic category routes
│   └── page.tsx                   # Category page
└── page.tsx                        # Templates landing page

src/components/root/template/       # Template system core
├── registry-*.ts                   # Registry configurations
├── index.ts                        # Main registry
├── all.tsx                         # All templates view
├── hero.tsx                        # Hero display component
└── public/r/                       # JSON registry output
    ├── index.json                  # Registry index
    └── styles/
        ├── new-york/*.json         # New York style JSONs
        └── default/*.json          # Default style JSONs
```

## How It Works

### 1. Template Definition
Templates are full React components with complete layouts:
- Complete page structures
- Responsive design patterns
- Theme-aware styling
- Production-ready code

### 2. Registry System
- Templates registered in `registry-*.ts` files
- Auto-generated JSON files for CLI consumption
- Metadata includes dependencies and file paths
- Style variants (new-york, default)

### 3. Showcase Pages
- Dynamic routing for template categories
- Live preview with code display
- Copy-to-clipboard functionality
- Style switching support

### 4. CLI Integration
- Templates consumable via shadcn CLI
- JSON registry enables `npx shadcn add template-name`
- Auto-installs dependencies
- Places files in correct locations

## How to Add New Templates

### Step 1: Create Template Component
Create your template in `src/registry/new-york/templates/your-template/`:

```tsx
// src/registry/new-york/templates/your-template/page.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function YourTemplate() {
  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Your Template</h1>
        <p className="text-muted-foreground">
          Template description here
        </p>
      </header>

      <main className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Section Title
          </h2>
          <p>Your content here</p>
          <Button className="mt-4">Action</Button>
        </Card>
      </main>
    </div>
  )
}
```

### Step 2: Register Template
Add to `src/components/root/template/registry-*.ts`:

```typescript
// src/components/root/template/registry-templates.ts
export const templates: Registry = [
  {
    name: "your-template",
    type: "registry:template",
    description: "Your template description",
    files: [
      {
        path: "templates/your-template/page.tsx",
        type: "registry:page",
      },
    ],
    dependencies: ["@/components/ui/button", "@/components/ui/card"],
    registryDependencies: ["button", "card"],
    categories: ["landing"],
    subcategory: "hero",
  },
  // ... other templates
]
```

### Step 3: Create Default Style Version
Copy to default style with adjusted imports:

```bash
# Copy template to default style
cp -r src/registry/new-york/templates/your-template \
      src/registry/default/templates/

# Update imports in default version
# Change: @/registry/new-york/
# To: @/registry/default/
```

### Step 4: Generate Registry Files
Run the registry build script:

```bash
# Build registry JSON files
pnpm build:registry

# This generates:
# - public/r/styles/new-york/your-template.json
# - public/r/styles/default/your-template.json
# - Updates public/r/index.json
```

### Step 5: Add to Showcase
Update the templates page to include your template:

```typescript
// src/components/root/template/all.tsx
const TEMPLATES = [
  {
    name: "your-template",
    category: "landing",
    subcategory: "hero",
    preview: () => import("@/registry/new-york/templates/your-template/page"),
  },
  // ... other templates
]
```

## Template Categories

### Landing Pages
Complete landing page layouts:
- **Hero Sections**: Eye-catching headers with CTAs
- **Feature Grids**: Product feature showcases
- **Pricing Tables**: Subscription plan displays
- **Testimonials**: Customer feedback sections
- **Footer Layouts**: Company information footers

### Authentication
User authentication interfaces:
- **Login Pages**: Sign-in forms with social options
- **Registration**: Sign-up flows with validation
- **Password Reset**: Recovery email forms
- **Two-Factor**: 2FA verification screens
- **OAuth Flows**: Social login integrations

### Dashboards
Admin and user dashboards:
- **Analytics Dashboard**: Data visualization layouts
- **User Dashboard**: Profile and settings pages
- **Admin Panel**: Management interfaces
- **Metrics Display**: KPI and statistics views
- **Activity Feeds**: Timeline and log displays

### Application Layouts
Core app structures:
- **Sidebar Layouts**: Navigation with collapsible sidebar
- **Header Layouts**: Top navigation patterns
- **Tab Layouts**: Multi-section interfaces
- **Split Views**: Dual-pane layouts
- **Mobile Responsive**: Adaptive designs

### Marketing
Marketing and content pages:
- **Blog Layouts**: Article listing and reading
- **Portfolio**: Project showcases
- **Team Pages**: Staff directories
- **Contact Forms**: Inquiry submissions
- **Newsletter**: Email subscription forms

## Template Features

### Responsive Design
All templates include:
- Mobile-first approach
- Breakpoint optimization
- Touch-friendly interactions
- Adaptive layouts
- Performance optimization

### Theme Support
Templates work with:
- Light/dark mode switching
- Custom color schemes
- CSS variable theming
- Tailwind configuration
- Brand customization

### Accessibility
Built-in a11y features:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support

### Production Ready
Templates include:
- SEO optimization
- Performance best practices
- Error boundaries
- Loading states
- Form validation

## Registry System

### JSON Structure
Each template generates a JSON file:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "name": "dashboard-01",
  "type": "registry:template",
  "description": "A dashboard layout with sidebar navigation",
  "files": [
    {
      "path": "templates/dashboard-01/page.tsx",
      "content": "// Full component code here",
      "type": "registry:page",
      "target": "app/dashboard/page.tsx"
    }
  ],
  "dependencies": [
    "@radix-ui/react-icons",
    "@tanstack/react-table"
  ],
  "registryDependencies": [
    "button",
    "card",
    "table"
  ],
  "categories": ["application"],
  "subcategory": "dashboard"
}
```

### CLI Consumption
Templates installable via:

```bash
# Install a specific template
npx shadcn add dashboard-01

# Install with custom path
npx shadcn add dashboard-01 --path app/admin

# Install with dependencies
npx shadcn add dashboard-01 --deps
```

### Style Variants
Templates support multiple styles:
- **new-york**: Modern, clean design
- **default**: Classic shadcn style

Style-specific imports are automatically adjusted.

## Best Practices

### 1. Template Structure
- Keep templates self-contained
- Use composition over inheritance
- Minimize external dependencies
- Include all necessary styles

### 2. Component Usage
- Use shadcn/ui components
- Avoid hardcoded values
- Make sections configurable
- Support theme variables

### 3. Documentation
- Clear component comments
- Usage examples in code
- Configuration options
- Customization notes

### 4. Performance
- Lazy load heavy components
- Optimize images
- Minimize bundle size
- Use production builds

### 5. Testing
- Test responsive breakpoints
- Verify theme switching
- Check accessibility
- Validate forms

## Customization

### Modifying Templates
After installation, templates can be:
- Edited directly in your project
- Extended with new sections
- Themed with your brand
- Integrated with your data

### Adding Sections
Extend templates with new sections:

```tsx
import OriginalTemplate from "./dashboard-01/page"
import { CustomSection } from "./custom-section"

export default function ExtendedDashboard() {
  return (
    <>
      <OriginalTemplate />
      <CustomSection />
    </>
  )
}
```

### Theming Templates
Apply custom themes:

```css
/* Override template variables */
.template-dashboard {
  --template-bg: var(--custom-bg);
  --template-border: var(--custom-border);
  --template-text: var(--custom-text);
}
```

## Troubleshooting

### Build Issues
```bash
# Clear build cache
rm -rf .next __registry__

# Rebuild registry
pnpm build:registry

# Restart dev server
pnpm dev
```

### Import Errors
- Check style variant imports
- Verify component paths
- Ensure dependencies installed
- Update tsconfig paths

### Styling Problems
- Check Tailwind configuration
- Verify CSS imports
- Test theme variables
- Clear browser cache

### Registry Updates
- Run build:registry after changes
- Verify JSON generation
- Check public/r/ directory
- Test CLI installation

## Advanced Features

### Dynamic Data Integration
Connect templates to your data:

```tsx
// Transform static template to dynamic
export default async function DashboardPage() {
  const data = await fetchDashboardData()

  return <DashboardTemplate data={data} />
}
```

### Multi-Language Support
Add i18n to templates:

```tsx
import { useTranslation } from "@/lib/i18n"

export default function LocalizedTemplate() {
  const { t } = useTranslation()

  return (
    <h1>{t("template.title")}</h1>
  )
}
```

### State Management
Integrate with state libraries:

```tsx
import { useStore } from "@/lib/store"

export default function StatefulTemplate() {
  const { state, actions } = useStore()

  return <TemplateWithState {...state} {...actions} />
}
```

## Performance

### Optimization Strategies
- Code splitting by route
- Dynamic imports for heavy components
- Image optimization with Next.js
- CSS purging in production

### Metrics
- Initial load: < 100KB
- Time to interactive: < 2s
- Lighthouse score: > 90
- Core Web Vitals: Pass

## Future Enhancements

### Planned Features
- [ ] Visual template builder
- [ ] AI-powered customization
- [ ] Figma to template conversion
- [ ] Template marketplace
- [ ] Version control for templates
- [ ] A/B testing support
- [ ] Analytics integration
- [ ] Template composition tool

### Community Templates
Submit templates via:
1. Create template following guidelines
2. Add comprehensive documentation
3. Include live demo
4. Submit PR with tests

## Resources

- [shadcn/ui Blocks](https://ui.shadcn.com/blocks)
- [Template Examples](https://github.com/shadcn-ui/ui/tree/main/apps/www/registry)
- [Registry Schema](https://ui.shadcn.com/schema.json)
- [CLI Documentation](https://ui.shadcn.com/docs/cli)