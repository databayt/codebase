# AI Sales Agent Refactoring Strategy

## Executive Summary

This document outlines a comprehensive refactoring strategy for the AI Sales Agent blocks (`leads`, `upwork`, `scraper`, `emails`) to follow a component-driven, feature-based architecture with standardized file patterns.

## Core Architecture Principles

### 1. **Component-Driven Modularity**
- Each feature is a self-contained module
- All related code lives in the component directory
- Clear separation of concerns

### 2. **URL-to-Directory Mapping**
```
app/[lang]/(blocks)/leads/page.tsx → components/leads/
app/[lang]/(blocks)/upwork/page.tsx → components/upwork/
app/[lang]/(blocks)/scraper/page.tsx → components/scraper/
app/[lang]/(blocks)/emails/page.tsx → components/emails/
```

### 3. **Feature-Based & Composable**
- Each block operates as a micro-service
- Can be imported and used independently
- Shared utilities in parent directories

### 4. **Standardized File Pattern**
Every feature MUST include these files:

```
components/[feature]/
├── content.tsx       # Main UI orchestration
├── action.ts        # Server actions & API calls
├── constant.ts      # Static data, enums
├── validation.ts    # Zod schemas
├── type.ts         # TypeScript types
├── form.tsx        # Form components
├── card.tsx        # Card view components
├── all.tsx         # List/table view
├── featured.tsx    # Featured items view
├── detail.tsx      # Detail/modal view
├── util.ts         # Helper functions
├── column.tsx      # Table column definitions
├── use-[feature].ts # Custom React hook
├── README.md       # Feature documentation
└── ISSUE.md        # Known issues & improvements
```

## Phase 1: Leads Block (✅ Partially Complete)

### Current State
- Basic structure exists
- Some components already created
- Missing standardized files

### Required Actions
1. ✅ Create `constant.ts` - DONE
2. ✅ Create `type.ts` - DONE
3. ✅ Create `validation.ts` - DONE
4. ✅ Create `action.ts` - DONE
5. ✅ Create `content.tsx` - DONE
6. ✅ Create `form.tsx` - DONE
7. ✅ Create `all.tsx` - DONE
8. ⏳ Create remaining files (featured, card, detail, util, column, use-leads)
9. ⏳ Update existing components to use new structure

### Migration Path
```typescript
// Old: app/[lang]/(blocks)/leads/page.tsx
import LeadsClient from "./leads-client";

// New: app/[lang]/(blocks)/leads/page.tsx
import { Content } from "@/components/leads/content";

export default async function LeadsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <Content lang={params.lang} dictionary={dictionary} />;
}
```

## Phase 2: Upwork Block

### Current State
- Basic chat/bot components exist
- Logic scattered across files
- No standardized structure

### Refactoring Plan

#### File Structure
```
components/upwork/
├── content.tsx        # Main Upwork job analyzer UI
├── action.ts         # Job fetching, AI analysis
├── constant.ts       # Job types, skill categories
├── validation.ts     # Job data validation
├── type.ts          # Upwork job types
├── form.tsx         # Job search/filter form
├── card.tsx         # Job card component
├── all.tsx          # All jobs list
├── featured.tsx     # High-match jobs
├── detail.tsx       # Job detail view
├── util.ts          # Scoring algorithms
├── column.tsx       # Table columns for jobs
├── use-upwork.ts    # Upwork data hook
├── proposal.tsx     # AI proposal generator
├── analyzer.tsx     # Job-skill matcher
├── README.md
└── ISSUE.md
```

#### Migration Steps
1. Move AI logic from `logic.ts` to `action.ts`
2. Extract types to `type.ts`
3. Create validation schemas in `validation.ts`
4. Refactor `chat.tsx` into `content.tsx`
5. Move proposal generation to `proposal.tsx`
6. Create job listing components

## Phase 3: Scraper Block

### Current State
- Minimal implementation
- Only actions and page exist

### Refactoring Plan

#### File Structure
```
components/scraper/
├── content.tsx       # Web scraping UI
├── action.ts        # Scraping logic
├── constant.ts      # Scraper configurations
├── validation.ts    # URL/data validation
├── type.ts         # Scraper types
├── form.tsx        # Scraping config form
├── card.tsx        # Scraped data card
├── all.tsx         # All scraped data
├── featured.tsx    # Important findings
├── detail.tsx      # Scraped data detail
├── util.ts         # Data extraction utils
├── column.tsx      # Table columns
├── use-scraper.ts  # Scraper hook
├── parser.tsx      # Data parser UI
├── queue.tsx       # Scraping queue manager
├── README.md
└── ISSUE.md
```

#### Implementation Priority
1. Create data extraction patterns
2. Build queue management system
3. Implement parser for different data types
4. Add scheduling capabilities

## Phase 4: Emails Block

### Current State
- Basic email functionality
- Actions defined

### Refactoring Plan

#### File Structure
```
components/emails/
├── content.tsx       # Email campaign manager
├── action.ts        # Email operations
├── constant.ts      # Email templates, settings
├── validation.ts    # Email validation
├── type.ts         # Email types
├── form.tsx        # Compose email form
├── card.tsx        # Email preview card
├── all.tsx         # Email list/inbox
├── featured.tsx    # Important emails
├── detail.tsx      # Email detail view
├── util.ts         # Email formatting utils
├── column.tsx      # Email table columns
├── use-emails.ts   # Email hook
├── composer.tsx    # Rich email composer
├── templates.tsx   # Template manager
├── campaign.tsx    # Campaign builder
├── README.md
└── ISSUE.md
```

## Migration Strategy

### Step 1: Create Base Structure (Week 1)
```bash
# Script to create directory structure
for block in leads upwork scraper emails; do
  mkdir -p src/components/$block
  touch src/components/$block/{content,action,constant,validation,type,form,card,all,featured,detail,util,column}.{ts,tsx}
  touch src/components/$block/use-$block.ts
  touch src/components/$block/{README.md,ISSUE.md}
done
```

### Step 2: Gradual Migration (Week 2-3)

#### Backward Compatibility Layer
```typescript
// components/[feature]/compat.ts
// Temporary compatibility exports
export { default as LeadsClient } from './content';
export * from './action';
export * from './type';
```

### Step 3: Update Imports (Week 4)
```typescript
// Update all imports gradually
// Old: import { action } from '@/app/[lang]/(blocks)/leads/actions'
// New: import { action } from '@/components/leads/action'
```

### Step 4: Remove Old Code (Week 5)
- Delete old action files from app directory
- Remove compatibility layers
- Clean up unused imports

## Template: README.md

```markdown
# [Feature Name] Component

## Overview
Brief description of the feature and its purpose.

## Architecture
- **Pattern**: Component-driven, atomic design
- **Location**: `src/components/[feature]/`
- **Route**: `/[lang]/[feature]`

## Files Structure
| File | Purpose |
|------|---------|
| content.tsx | Main UI orchestration |
| action.ts | Server actions & API |
| constant.ts | Static configurations |
| validation.ts | Input validation schemas |
| type.ts | TypeScript definitions |
| form.tsx | Form components |
| card.tsx | Card view component |
| all.tsx | List/table view |
| featured.tsx | Highlighted items |
| detail.tsx | Detail view modal |
| util.ts | Helper functions |
| column.tsx | Table column configs |
| use-[feature].ts | Custom React hook |

## Usage

### Basic Implementation
\`\`\`tsx
import { Content } from '@/components/[feature]/content';

export default function Page() {
  return <Content />;
}
\`\`\`

### Server Actions
\`\`\`typescript
import { createItem, updateItem } from '@/components/[feature]/action';
\`\`\`

### Hooks
\`\`\`typescript
import { use[Feature] } from '@/components/[feature]/use-[feature]';

const { items, isLoading, refresh } = use[Feature]();
\`\`\`

## API Reference

### Actions
- `create[Item](input)` - Create new item
- `update[Item](id, input)` - Update existing item
- `delete[Item](id)` - Delete item
- `get[Items](filters)` - Get filtered items

### Types
- `[Item]` - Base item type
- `Create[Item]Input` - Creation input
- `Update[Item]Input` - Update input
- `[Item]Filters` - Filter options

## Configuration

### Constants
- `[ITEM]_STATUS` - Status options
- `[ITEM]_TYPES` - Type categories
- `FEATURE_FLAGS` - Feature toggles

## Testing
\`\`\`bash
pnpm test components/[feature]
\`\`\`

## Performance
- Lazy loading for detail views
- Optimistic updates
- Server-side pagination
- Debounced search

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatible

## Related Components
- [List related components]

## Contributing
Follow the standardized file pattern when adding new features.
```

## Template: ISSUE.md

```markdown
# [Feature Name] - Known Issues & Improvements

## Current Issues 🐛

### High Priority
- [ ] Issue description
  - **Impact**: High/Medium/Low
  - **Affected areas**: List areas
  - **Workaround**: Temporary solution if any

### Medium Priority
- [ ] Issue description

### Low Priority
- [ ] Issue description

## Planned Improvements 🚀

### Performance
- [ ] Implement virtual scrolling for large lists
- [ ] Add caching layer for API responses
- [ ] Optimize bundle size

### Features
- [ ] Feature description
  - **Benefit**: What value it adds
  - **Effort**: Small/Medium/Large
  - **Dependencies**: List any dependencies

### UX/UI
- [ ] Improvement description

### Code Quality
- [ ] Refactoring needs
- [ ] Test coverage improvements
- [ ] Documentation updates

## Technical Debt 💸
- [ ] Item description
  - **Reason**: Why it exists
  - **Impact**: Current impact
  - **Resolution**: How to fix

## Migration Notes 📝
- Notes about ongoing migrations
- Breaking changes to watch for
- Deprecated patterns to remove

## Performance Metrics 📊
- Current load time: X ms
- Bundle size: X KB
- API response time: X ms

## Dependencies to Update 📦
- package@version → package@new-version

## Security Considerations 🔒
- Security issues to address
- Authentication improvements needed
- Data validation enhancements

## Accessibility TODOs ♿
- [ ] Accessibility improvement

## Testing Coverage 🧪
- Current coverage: X%
- Target coverage: X%
- Missing test areas: List areas

---

Last Updated: [Date]
Next Review: [Date]
```

## Success Metrics

### Code Quality
- ✅ All features follow standardized pattern
- ✅ 100% TypeScript coverage
- ✅ Zod validation on all inputs
- ✅ Consistent error handling

### Performance
- ✅ < 200ms server action response
- ✅ < 100KB bundle per feature
- ✅ Optimistic UI updates

### Developer Experience
- ✅ Clear file organization
- ✅ Predictable patterns
- ✅ Easy to onboard new developers
- ✅ Self-documenting code structure

## Rollback Plan

If issues arise during migration:

1. **Immediate Rollback**
   ```bash
   git revert [migration-commit]
   ```

2. **Compatibility Mode**
   - Keep old files alongside new
   - Use feature flags to toggle

3. **Gradual Rollback**
   - Revert feature by feature
   - Maintain working state

## Timeline

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1 | Setup | Directory structure, templates |
| 2 | Leads | Complete leads refactoring |
| 3 | Upwork | Complete upwork refactoring |
| 4 | Scraper/Emails | Complete remaining blocks |
| 5 | Cleanup | Remove old code, documentation |

## Conclusion

This refactoring will result in:
- **50% reduction** in code duplication
- **Improved maintainability** through consistent patterns
- **Better testability** with isolated components
- **Enhanced developer experience** with clear structure
- **Future-proof architecture** for scaling

The incremental approach ensures zero downtime and maintains backward compatibility throughout the migration process.