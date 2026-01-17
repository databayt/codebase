"use client"

import { PageHeader } from "@/components/atom/page-header"
import { CodeBlock } from "../shared/code-block"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface McpContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

const mcpConfig = `// claude_desktop_config.json (macOS: ~/Library/Application Support/Claude/)
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@host:5432/db"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    },
    "browser": {
      "command": "npx",
      "args": ["-y", "@anthropics/mcp-browser"]
    }
  }
}`

const customMcp = `// .claude/mcp-servers/custom/src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new Server(
  { name: "custom-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Define a tool
server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "generate_report",
    description: "Generate a custom report",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["pdf", "docx"] },
        data: { type: "object" }
      },
      required: ["type", "data"]
    }
  }]
}));

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "generate_report") {
    const { type, data } = request.params.arguments;
    // Generate report logic
    return { content: [{ type: "text", text: "Report generated" }] };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);`

const claudeCodeMcp = `// .claude/settings.json - Enable MCP in Claude Code
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "@anthropics/mcp-shadcn"]
    },
    "neon": {
      "command": "npx",
      "args": ["-y", "@anthropics/mcp-neon"],
      "env": {
        "NEON_API_KEY": "your-api-key"
      }
    }
  }
}`

export default function McpContent({ dictionary, params }: McpContentProps) {
  return (
    <div className="px-responsive lg:px-0 py-12">
      <PageHeader
        heading="MCP"
        description="Model Context Protocol for AI coding. Connect Claude to external tools and data sources."
      />

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What is MCP?</h2>
          <p className="text-muted-foreground mb-6">
            Model Context Protocol (MCP) is an open protocol that allows AI assistants to connect
            to external tools, databases, and services. It enables Claude to take actions beyond
            text generation.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Tools</h3>
              <p className="text-sm text-muted-foreground">
                Functions that Claude can call: database queries, API requests, file operations.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Resources</h3>
              <p className="text-sm text-muted-foreground">
                Data that Claude can read: files, database records, API responses.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Official MCP Servers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Server</th>
                  <th className="text-left py-2 pr-4">Package</th>
                  <th className="text-left py-2">Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">GitHub</td>
                  <td className="py-2 pr-4"><code>@modelcontextprotocol/server-github</code></td>
                  <td className="py-2">PRs, issues, repos</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">PostgreSQL</td>
                  <td className="py-2 pr-4"><code>@modelcontextprotocol/server-postgres</code></td>
                  <td className="py-2">Database queries</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Filesystem</td>
                  <td className="py-2 pr-4"><code>@modelcontextprotocol/server-filesystem</code></td>
                  <td className="py-2">File operations</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Browser</td>
                  <td className="py-2 pr-4"><code>@anthropics/mcp-browser</code></td>
                  <td className="py-2">Web automation</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">shadcn</td>
                  <td className="py-2 pr-4"><code>@anthropics/mcp-shadcn</code></td>
                  <td className="py-2">Component registry</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Neon</td>
                  <td className="py-2 pr-4"><code>@anthropics/mcp-neon</code></td>
                  <td className="py-2">Serverless Postgres</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
          <p className="text-muted-foreground mb-4">
            Configure MCP servers in Claude Desktop or Claude Code.
          </p>
          <CodeBlock code={mcpConfig} language="json" title="claude_desktop_config.json" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Claude Code MCP</h2>
          <p className="text-muted-foreground mb-4">
            Enable MCP servers in Claude Code settings.
          </p>
          <CodeBlock code={claudeCodeMcp} language="json" title=".claude/settings.json" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Custom MCP Server</h2>
          <p className="text-muted-foreground mb-4">
            Build your own MCP server for project-specific tools.
          </p>
          <CodeBlock code={customMcp} language="typescript" title="index.ts" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-medium">Official Documentation</h3>
              <p className="text-sm text-muted-foreground">MCP specification and guides</p>
            </a>
            <a
              href="https://github.com/modelcontextprotocol/servers"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-medium">MCP Servers Repo</h3>
              <p className="text-sm text-muted-foreground">Official server implementations</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
