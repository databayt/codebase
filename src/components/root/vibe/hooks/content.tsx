"use client"

import { PageHeader } from "@/components/atom/page-header"
import { CodeBlock } from "../shared/code-block"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface HooksContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

const preToolHook = `#!/bin/bash
# .claude/hooks/pre-tool-use.sh
# Runs before any tool execution

TOOL_NAME="$1"
TOOL_ARGS="$2"

# Block dangerous operations
if [[ "$TOOL_NAME" == "Bash" && "$TOOL_ARGS" == *"rm -rf"* ]]; then
  echo "BLOCKED: Dangerous rm -rf operation"
  exit 1
fi

# Log tool usage
echo "[$(date)] Tool: $TOOL_NAME" >> ~/.claude/logs/tools.log

exit 0`

const postCommitHook = `#!/bin/bash
# .claude/hooks/post-commit.sh
# Runs after successful git commit

# Auto-format staged files
pnpm lint --fix

# Run quick tests
pnpm test --watch=false --passWithNoTests

# Notify success
echo "Post-commit checks passed"`

const promptSubmitHook = `#!/bin/bash
# .claude/hooks/user-prompt-submit.sh
# Runs when user submits a prompt

PROMPT="$1"

# Add timestamp to conversation
echo "[$(date '+%Y-%m-%d %H:%M')] User prompt received"

# Check for sensitive patterns
if [[ "$PROMPT" == *"API_KEY"* || "$PROMPT" == *"SECRET"* ]]; then
  echo "WARNING: Prompt may contain sensitive data"
fi

exit 0`

const hooksConfig = `// .claude/settings.json
{
  "hooks": {
    "preToolUse": ".claude/hooks/pre-tool-use.sh",
    "postToolUse": ".claude/hooks/post-tool-use.sh",
    "userPromptSubmit": ".claude/hooks/user-prompt-submit.sh"
  },
  "permissions": {
    "allow": ["Bash(git:*)"]
  }
}`

export default function HooksContent({ dictionary, params }: HooksContentProps) {
  return (
    <div className="px-responsive lg:px-0 py-12">
      <PageHeader
        heading="Hooks"
        description="Event hooks for AI automation. Execute scripts before or after Claude Code actions."
      />

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What are Hooks?</h2>
          <p className="text-muted-foreground mb-6">
            Hooks are shell scripts that execute in response to Claude Code events. Use them
            for validation, logging, formatting, and automation.
          </p>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Location</h3>
            <code className="text-sm bg-muted px-2 py-1 rounded">.claude/hooks/*.sh</code>
            <p className="text-sm text-muted-foreground mt-2">Project-level hook scripts</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Hook Types</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Hook</th>
                  <th className="text-left py-2 pr-4">Trigger</th>
                  <th className="text-left py-2">Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>PreToolUse</code></td>
                  <td className="py-2 pr-4">Before tool execution</td>
                  <td className="py-2">Validate, block dangerous ops</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>PostToolUse</code></td>
                  <td className="py-2 pr-4">After tool execution</td>
                  <td className="py-2">Logging, cleanup</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>UserPromptSubmit</code></td>
                  <td className="py-2 pr-4">User sends message</td>
                  <td className="py-2">Preprocessing, logging</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code>PostCommit</code></td>
                  <td className="py-2 pr-4">After git commit</td>
                  <td className="py-2">Lint, test, notify</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Pre-Tool Hook</h2>
          <p className="text-muted-foreground mb-4">
            Validate or block tool executions before they run.
          </p>
          <CodeBlock code={preToolHook} language="bash" title="pre-tool-use.sh" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Post-Commit Hook</h2>
          <p className="text-muted-foreground mb-4">
            Run automation after successful commits.
          </p>
          <CodeBlock code={postCommitHook} language="bash" title="post-commit.sh" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">User Prompt Hook</h2>
          <p className="text-muted-foreground mb-4">
            Process user input before Claude sees it.
          </p>
          <CodeBlock code={promptSubmitHook} language="bash" title="user-prompt-submit.sh" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
          <p className="text-muted-foreground mb-4">
            Enable hooks in your settings file.
          </p>
          <CodeBlock code={hooksConfig} language="json" title="settings.json" />
        </section>
      </div>
    </div>
  )
}
