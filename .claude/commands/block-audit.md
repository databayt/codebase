# Block Audit Command

Comprehensive audit of a block against project best practices and standards.

## Usage
```
/block-audit <block-name>
```

## Arguments
- `$ARGUMENTS` - Name of the block to audit (use `--all` for all blocks)

## Audit Categories

### 1. Architecture Compliance (20 points)

| Check | Points | Criteria |
|-------|--------|----------|
| Mirror-pattern | 5 | Route in `app/` + components in `components/` |
| File structure | 5 | Has content.tsx, config.ts, type.ts |
| Naming conventions | 5 | kebab-case files, PascalCase components |
| Component location | 5 | Correct directory placement |

### 2. Code Quality (20 points)

| Check | Points | Criteria |
|-------|--------|----------|
| No `any` types | 5 | TypeScript strict compliance |
| Proper error handling | 5 | Try-catch, error boundaries |
| No console.log | 3 | Production-ready code |
| ESLint passing | 4 | No linting errors |
| Zod validation | 3 | Forms have schema validation |

### 3. Styling Standards (15 points)

| Check | Points | Criteria |
|-------|--------|----------|
| Theme variables | 5 | No hardcoded colors |
| OKLCH format | 3 | Custom colors use OKLCH |
| Responsive design | 4 | Mobile-first approach |
| Dark/light themes | 3 | Both themes supported |

### 4. Internationalization (15 points)

| Check | Points | Criteria |
|-------|--------|----------|
| Dictionary usage | 5 | Uses getDictionary pattern |
| No hardcoded strings | 4 | All text externalized |
| Arabic translations | 3 | ar.json entries exist |
| RTL compatibility | 3 | ms/me, text-start/end used |

### 5. Accessibility (10 points)

| Check | Points | Criteria |
|-------|--------|----------|
| ARIA labels | 3 | Interactive elements labeled |
| Keyboard navigation | 3 | Tab-navigable |
| Color contrast | 2 | WCAG AA compliant |
| Focus indicators | 2 | Visible focus states |

### 6. Performance (10 points)

| Check | Points | Criteria |
|-------|--------|----------|
| Server Components | 4 | Maximized server rendering |
| Bundle size | 3 | No unnecessary dependencies |
| Loading states | 3 | Suspense/loading.tsx present |

### 7. Security (5 points)

| Check | Points | Criteria |
|-------|--------|----------|
| No exposed secrets | 2 | No API keys in code |
| Input validation | 2 | Zod schemas for inputs |
| XSS prevention | 1 | No dangerouslySetInnerHTML |

### 8. Documentation (5 points)

| Check | Points | Criteria |
|-------|--------|----------|
| README present | 2 | Has README.md |
| Props documented | 2 | Interface comments |
| Usage examples | 1 | Example code provided |

## Audit Process

### Step 1: Locate Block
Find block at:
- `src/app/[lang]/(root)/blocks/$ARGUMENTS/`
- `src/components/root/block/$ARGUMENTS/`

### Step 2: Run Checks
For each category, evaluate criteria and assign points.

### Step 3: Generate Report

## Output Report

```markdown
# Block Audit Report: {block-name}

## Score: {score}/100

### Grade: {A|B|C|D|F}
- A: 90-100 (Excellent)
- B: 80-89 (Good)
- C: 70-79 (Acceptable)
- D: 60-69 (Needs Work)
- F: <60 (Critical Issues)

---

## Summary by Category

| Category | Score | Max | Status |
|----------|-------|-----|--------|
| Architecture | {n} | 20 | {✅/⚠️/❌} |
| Code Quality | {n} | 20 | {✅/⚠️/❌} |
| Styling | {n} | 15 | {✅/⚠️/❌} |
| i18n | {n} | 15 | {✅/⚠️/❌} |
| Accessibility | {n} | 10 | {✅/⚠️/❌} |
| Performance | {n} | 10 | {✅/⚠️/❌} |
| Security | {n} | 5 | {✅/⚠️/❌} |
| Documentation | {n} | 5 | {✅/⚠️/❌} |

---

## Critical Issues (Must Fix)

1. ❌ **Missing TypeScript types**
   - File: content.tsx:45
   - Issue: `data: any` should be typed
   - Fix: Create interface in type.ts

2. ❌ **Hardcoded colors**
   - File: content.tsx:78
   - Issue: `color: '#333'`
   - Fix: Use `text-foreground`

---

## Warnings (Should Fix)

1. ⚠️ **Missing i18n for 3 strings**
   - "Submit", "Cancel", "Loading..."
   - Add to en.json and ar.json

2. ⚠️ **RTL incompatible spacing**
   - `ml-4` should be `ms-4`
   - 5 occurrences

---

## Passed Checks ✅

- [x] Mirror-pattern structure
- [x] No console.log statements
- [x] Error boundaries present
- [x] ESLint passing
- [x] No exposed secrets

---

## Recommendations

1. **High Priority**
   - Add TypeScript interfaces
   - Fix hardcoded colors

2. **Medium Priority**
   - Extract i18n strings
   - Add RTL support

3. **Low Priority**
   - Add usage examples to README
   - Consider memoization for list items

---

## Action Items

Run these commands to fix issues:
\`\`\`bash
# Fix with refactor command
/refactor-block {block-name}

# Then optimize
/optimize-block {block-name}
\`\`\`
```

## Batch Audit

For `--all` flag, audit all blocks and generate summary:

```markdown
# Block Audit Summary

## Overall Health: {avg-score}%

| Block | Score | Grade | Critical Issues |
|-------|-------|-------|-----------------|
| auth | 85 | B | 0 |
| stripe | 72 | C | 2 |
| table | 91 | A | 0 |
| dashboard | 68 | D | 3 |

## Most Common Issues
1. Missing i18n (4 blocks)
2. Hardcoded colors (3 blocks)
3. Missing types (2 blocks)

## Recommended Priority
1. Fix `dashboard` (3 critical issues)
2. Fix `stripe` (2 critical issues)
3. Review `auth` (minor improvements)
```
