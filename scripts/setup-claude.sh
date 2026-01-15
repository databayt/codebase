#!/bin/bash

# Claude Code Setup Script for Team Members
# Usage: curl -fsSL https://raw.githubusercontent.com/databayt/codebase/main/scripts/setup-claude.sh | bash

set -e

echo "Setting up Claude Code..."
echo ""

# 1. Install Claude Code CLI
echo "[1/6] Installing Claude Code CLI..."
curl -fsSL https://claude.ai/install.sh | sh

# 2. Create ~/.claude directory structure
echo "[2/6] Creating directory structure..."
mkdir -p ~/.claude/{commands,agents,memory}

# 3. Create settings.json
echo "[3/6] Creating settings.json..."
cat > ~/.claude/settings.json << 'EOF'
{
  "env": {
    "CODEBASE_PATH": "$HOME/codebase",
    "CODEBASE_REPO": "databayt/codebase",
    "CODEBASE_OWNER": "databayt",
    "CODEBASE_NAME": "codebase",
    "DEV_PORT": "3000"
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(pnpm dev)",
        "hooks": [
          {
            "type": "command",
            "command": "PID=$(lsof -ti:3000 2>/dev/null); if [ ! -z \"$PID\" ]; then kill -9 $PID 2>/dev/null && echo 'Killed existing process on port 3000'; sleep 1; fi; exit 0"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash(pnpm dev)",
        "hooks": [
          {
            "type": "command",
            "command": "sleep 3 && open -a 'Google Chrome' http://localhost:3000 &"
          }
        ]
      }
    ]
  }
}
EOF

# 4. Create CLAUDE.md
echo "[4/6] Creating CLAUDE.md..."
cat > ~/.claude/CLAUDE.md << 'EOF'
# Global Claude Code Instructions

## Preferences

- **Model**: Opus 4.5 (default)
- **Package Manager**: pnpm
- **Stack**: Next.js 15, React 19, Prisma 6, TypeScript 5, Tailwind CSS 4, shadcn/ui
- **Languages**: Arabic (RTL default), English (LTR)

---

## Keyword Triggers

When user mentions these keywords, reference the mapped tools:

### Workflow Keywords

| Keyword | Agents | Commands | MCPs |
|---------|--------|----------|------|
| `push` | git-github | /push | github |
| `quick` | git-github | /quick | github |
| `ship` | orchestrate | /ship | vercel |
| `deploy` | - | /deploy | vercel |
| `validate` | orchestrate | /validate | - |

### Creation Keywords

| Keyword | Agents | Commands | Skills | MCPs |
|---------|--------|----------|--------|------|
| `component` | react, shadcn | /component | - | shadcn |
| `page` | nextjs, architecture | /page | - | - |
| `api` | api, prisma | /api | api-designer | postgres |
| `migration` | prisma | /migration | prisma-optimizer | postgres |
| `ui` | shadcn, ui-factory | /ui-add, /ui-generate | ui-validator | shadcn, a11y |
| `atom` | atom | **/atom** | - | shadcn |
| `template` | template | **/template** | - | shadcn |
| `block` | block | **/block** | - | shadcn |
| `feature` | orchestrate | /component, /page | - | - |

### Component Hierarchy (Unified System)

**Simple naming at user level** - just one word: `atom`, `template`, `block`

| Category | Agent | Skill | Memory | shadcn Equivalent |
|----------|-------|-------|--------|-------------------|
| **ui** | shadcn | - | - | shadcn/ui primitives |
| **atom** | atom | /atom | atom.json | **UI Components** |
| **template** | template | /template | template.json | **Blocks** |
| **block** | block | /block | block.json | *Beyond shadcn* |

**Pattern:**
- `ui` → Radix-based primitives (Button, Card, Input)
- `atom` → 2+ primitives combined (StatCard, ButtonGroup)
- `template` → Full-page layouts (Hero, Sidebar, Login)
- `block` → UI + business logic (Invoice, DataTable, Auth)

### Testing Keywords

| Keyword | Agents | Commands | Skills | MCPs |
|---------|--------|----------|--------|------|
| `test` | test | /test | test-generator | browser |
| `e2e` | test | /e2e | test-generator | browser |
| `playwright` | - | /e2e | - | browser |
| `coverage` | test | /test | test-generator | - |

### Quality Keywords

| Keyword | Agents | Commands | Skills | MCPs |
|---------|--------|----------|--------|------|
| `review` | react-reviewer | /review | - | - |
| `security` | security | /security-scan | security-scanner | - |
| `optimize` | performance | /optimize | react-performance | posthog |
| `audit` | security | /security-scan | security-scanner | - |

### Build Keywords

| Keyword | Agents | Commands | Skills |
|---------|--------|----------|--------|
| `build` | build, nextjs | /build | - |
| `fix` | build | /fix, /fix-all | - |
| `error` | debug | /scan-errors | - |

---

## Stack to Agent Mapping

| Technology | Primary Agent | Secondary Agent | Skill |
|------------|---------------|-----------------|-------|
| **Next.js** | nextjs | architecture | - |
| **React** | react | react-reviewer | react-performance |
| **TypeScript** | typescript | type-safety | - |
| **Prisma** | prisma | database-optimizer | prisma-optimizer |
| **Tailwind** | tailwind | - | - |
| **shadcn/ui** | shadcn | ui-factory | ui-validator |
| **Auth** | auth | security | - |
| **i18n** | i18n | - | dictionary-validator |

---

## MCP Reference

| MCP | Trigger Keywords | Use Case |
|-----|------------------|----------|
| `browser` | test, e2e, playwright | Playwright automation |
| `github` | push, pr, issue, github | Git operations |
| `vercel` | deploy, ship, preview | Deployments |
| `postgres` | prisma, query, db, migration | Database |
| `shadcn` | ui, component, atom, template | Component registry |
| `sentry` | error, debug, exception | Error monitoring |
| `figma` | design, figma, assets | Design files |
| `linear` | issue, task, linear | Issue tracking |
| `notion` | docs, wiki, notion | Knowledge base |

---

## Reference Codebase

Local: `~/codebase`
GitHub: `databayt/codebase`

**When implementing**, check codebase first:
1. `src/` for components
2. `__registry__/` for registry items
3. `docs/` for documentation

---

## Behavior

When user mentions a keyword from the trigger tables:

1. **Reference the mapped agent(s)** before starting work
2. **Use relevant MCP tools** if available
3. **Apply skills** for validation/optimization
4. **Suggest relevant commands** when appropriate

### Examples

| User Says | Tools Activated |
|-----------|-----------------|
| "test the login" | test agent + browser MCP + test-generator skill |
| "push changes" | git-github agent + github MCP + /push |
| "create button" | react + shadcn agents + shadcn MCP |
| "fix build errors" | build agent + /fix-build |
| "deploy to staging" | vercel MCP + /ship staging |

---

## Quick Command Reference

| Command | Purpose |
|---------|---------|
| `/push` | Full deploy checklist |
| `/quick` | Fast commit (skip build) |
| `/deploy` | Production deploy |
| `/build` | Smart build |
| `/fix-all` | Auto-fix issues |
| `/atom <name>` | Create atom component |
| `/template <name>` | Create template |
| `/block <source>` | Add block from source |
EOF

# 5. Update shell configuration
echo "[5/6] Updating shell configuration..."

SHELL_RC="$HOME/.zshrc"
if [[ "$SHELL" == *"bash"* ]]; then
  SHELL_RC="$HOME/.bashrc"
fi

# Check if already configured
if ! grep -q "alias c='claude --dangerously-skip-permissions'" "$SHELL_RC" 2>/dev/null; then
  cat >> "$SHELL_RC" << 'EOF'

# Claude Code Configuration
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.claude/bin:$PATH"
alias c='claude --dangerously-skip-permissions'
EOF
  echo "    Added Claude Code config to $SHELL_RC"
else
  echo "    Shell already configured"
fi

# 6. Clone codebase if not exists
echo "[6/6] Checking codebase repository..."
if [ ! -d "$HOME/codebase" ]; then
  echo "    Cloning codebase..."
  git clone https://github.com/databayt/codebase.git "$HOME/codebase"
else
  echo "    Codebase already exists"
fi

# Done
echo ""
echo "Setup complete."
echo ""
echo "Next steps:"
echo "  1. Run: source $SHELL_RC"
echo "  2. Run: c"
echo "  3. Start coding"
echo ""
echo "Commands:"
echo "  c              - Start Claude Code session"
echo "  c \"fix bug\"    - Direct prompt"
echo "  c -r           - Resume last session"
echo ""
