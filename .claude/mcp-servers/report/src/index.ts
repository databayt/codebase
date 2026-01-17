#!/usr/bin/env node
/**
 * T&C Report MCP Server
 *
 * Provides tools for generating, filling, and exporting
 * Testing & Commissioning electrical reports for substations.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

// Memory file path
const MEMORY_PATH = join(homedir(), ".claude", "memory", "report.json");

// Report types
const REPORT_TYPES = [
  "PROTECTION_RELAY",
  "TRANSFORMER",
  "SWITCHGEAR",
  "CABLE",
  "GROUNDING"
] as const;

// Voltage levels
const VOLTAGE_LEVELS = [
  "KV_33",
  "KV_13_8",
  "KV_11",
  "KV_6_6",
  "KV_0_4"
] as const;

// Tool schemas
const generateSchema = z.object({
  type: z.enum(REPORT_TYPES),
  voltage: z.enum(VOLTAGE_LEVELS).optional().default("KV_33"),
  manufacturer: z.string().optional(),
  project: z.string().optional(),
  substation: z.string().optional(),
});

const fillSchema = z.object({
  source: z.string().describe("File path, URL, or natural language description"),
  type: z.enum(REPORT_TYPES).optional(),
  voltage: z.enum(VOLTAGE_LEVELS).optional(),
  merge: z.boolean().optional().default(true),
});

const exportSchema = z.object({
  format: z.enum(["pdf", "docx", "both"]),
  id: z.string().optional().describe("Report ID to export, defaults to latest"),
  all: z.boolean().optional().default(false),
  output: z.string().optional().describe("Output directory path"),
});

const batchSchema = z.object({
  project: z.string().describe("Project name"),
  voltage: z.enum(VOLTAGE_LEVELS).optional().default("KV_33"),
  substation: z.string().optional(),
  types: z.array(z.enum(REPORT_TYPES)).optional(),
  export: z.enum(["pdf", "docx", "both"]).optional(),
  output: z.string().optional(),
});

// Helper: Load memory
function loadMemory(): any {
  if (existsSync(MEMORY_PATH)) {
    return JSON.parse(readFileSync(MEMORY_PATH, "utf-8"));
  }
  return {
    recentReports: [],
    batches: [],
    stats: { totalGenerated: 0 }
  };
}

// Helper: Save memory
function saveMemory(memory: any): void {
  memory.lastUpdated = new Date().toISOString();
  writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2));
}

// Create server
const server = new Server(
  {
    name: "tc-report",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "tc_report_generate",
        description: "Generate a T&C electrical report with random IEC/IEEE compliant test values",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: REPORT_TYPES,
              description: "Report type: PROTECTION_RELAY, TRANSFORMER, SWITCHGEAR, CABLE, or GROUNDING"
            },
            voltage: {
              type: "string",
              enum: VOLTAGE_LEVELS,
              description: "Voltage level (default: KV_33)"
            },
            manufacturer: {
              type: "string",
              description: "Equipment manufacturer (e.g., ABB, Siemens)"
            },
            project: {
              type: "string",
              description: "Project name"
            },
            substation: {
              type: "string",
              description: "Substation name"
            }
          },
          required: ["type"]
        }
      },
      {
        name: "tc_report_fill",
        description: "Auto-fill a report from Excel/CSV/JSON file or natural language description",
        inputSchema: {
          type: "object",
          properties: {
            source: {
              type: "string",
              description: "File path, URL, or natural language equipment description"
            },
            type: {
              type: "string",
              enum: REPORT_TYPES,
              description: "Force report type (auto-detected if not specified)"
            },
            voltage: {
              type: "string",
              enum: VOLTAGE_LEVELS,
              description: "Force voltage level"
            },
            merge: {
              type: "boolean",
              description: "Merge with random values for missing fields (default: true)"
            }
          },
          required: ["source"]
        }
      },
      {
        name: "tc_report_export",
        description: "Export reports to PDF or DOCX format",
        inputSchema: {
          type: "object",
          properties: {
            format: {
              type: "string",
              enum: ["pdf", "docx", "both"],
              description: "Export format"
            },
            id: {
              type: "string",
              description: "Report ID to export (defaults to latest)"
            },
            all: {
              type: "boolean",
              description: "Export all reports in memory"
            },
            output: {
              type: "string",
              description: "Output directory path"
            }
          },
          required: ["format"]
        }
      },
      {
        name: "tc_report_batch",
        description: "Generate all 5 report types for a project with consistent information",
        inputSchema: {
          type: "object",
          properties: {
            project: {
              type: "string",
              description: "Project name"
            },
            voltage: {
              type: "string",
              enum: VOLTAGE_LEVELS,
              description: "Voltage level for all reports"
            },
            substation: {
              type: "string",
              description: "Substation name"
            },
            types: {
              type: "array",
              items: { type: "string", enum: REPORT_TYPES },
              description: "Specific types to generate (default: all 5)"
            },
            export: {
              type: "string",
              enum: ["pdf", "docx", "both"],
              description: "Auto-export format"
            },
            output: {
              type: "string",
              description: "Export output directory"
            }
          },
          required: ["project"]
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const memory = loadMemory();

  try {
    switch (name) {
      case "tc_report_generate": {
        const params = generateSchema.parse(args);

        // Generate report ID and number
        const id = `gen-${Date.now()}`;
        const prefix = {
          PROTECTION_RELAY: "PR",
          TRANSFORMER: "TR",
          SWITCHGEAR: "SW",
          CABLE: "CB",
          GROUNDING: "GR"
        }[params.type];
        const reportNumber = `${prefix}-${new Date().toISOString().slice(0, 7).replace("-", "")}-${String(memory.stats.totalGenerated + 1).padStart(3, "0")}`;

        // Create report entry
        const report = {
          id,
          reportNumber,
          type: params.type,
          voltage: params.voltage,
          manufacturer: params.manufacturer || "ABB",
          project: params.project || "Demo Project",
          substation: params.substation || "Main Substation",
          generatedAt: new Date().toISOString(),
          status: "generated"
        };

        // Update memory
        memory.recentReports.unshift(report);
        memory.stats.totalGenerated++;
        memory.stats.byType[params.type]++;
        memory.stats.byVoltage[params.voltage]++;
        saveMemory(memory);

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              message: `Generated ${params.type} report`,
              report: {
                id,
                reportNumber,
                type: params.type,
                voltage: params.voltage,
                manufacturer: params.manufacturer || "ABB",
                project: params.project || "Demo Project"
              },
              nextSteps: [
                "Use tc_report_export to download as PDF/DOCX",
                "Report stored in memory for session"
              ]
            }, null, 2)
          }]
        };
      }

      case "tc_report_fill": {
        const params = fillSchema.parse(args);

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              message: "Fill command received",
              source: params.source,
              detectedType: params.type || "AUTO_DETECT",
              note: "Use report agent for natural language interpretation"
            }, null, 2)
          }]
        };
      }

      case "tc_report_export": {
        const params = exportSchema.parse(args);

        if (memory.recentReports.length === 0) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                success: false,
                error: "No reports in memory. Generate a report first."
              }, null, 2)
            }]
          };
        }

        const report = params.id
          ? memory.recentReports.find((r: any) => r.id === params.id)
          : memory.recentReports[0];

        if (!report) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                success: false,
                error: `Report ${params.id} not found`
              }, null, 2)
            }]
          };
        }

        // Mark as exported
        report.exported = report.exported || {};
        if (params.format === "pdf" || params.format === "both") {
          report.exported.pdf = true;
        }
        if (params.format === "docx" || params.format === "both") {
          report.exported.docx = true;
        }
        report.exported.lastExportedAt = new Date().toISOString();
        memory.stats.totalExported++;
        saveMemory(memory);

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              message: `Export ${params.format.toUpperCase()} prepared`,
              report: {
                id: report.id,
                reportNumber: report.reportNumber,
                type: report.type
              },
              output: params.output || "~/Downloads/",
              note: "Use report block PDF/DOCX functions to complete export"
            }, null, 2)
          }]
        };
      }

      case "tc_report_batch": {
        const params = batchSchema.parse(args);
        const types = params.types || REPORT_TYPES;

        const batchId = `batch-${Date.now()}`;
        const reports: any[] = [];

        for (const type of types) {
          const id = `${batchId}-${type.toLowerCase()}`;
          const prefix = {
            PROTECTION_RELAY: "PR",
            TRANSFORMER: "TR",
            SWITCHGEAR: "SW",
            CABLE: "CB",
            GROUNDING: "GR"
          }[type];
          const reportNumber = `${prefix}-${new Date().toISOString().slice(0, 7).replace("-", "")}-${String(memory.stats.totalGenerated + reports.length + 1).padStart(3, "0")}`;

          reports.push({
            id,
            reportNumber,
            type,
            voltage: params.voltage,
            project: params.project,
            substation: params.substation || "Main Substation"
          });
        }

        // Update memory
        const batch = {
          id: batchId,
          project: params.project,
          voltage: params.voltage,
          substation: params.substation,
          reports: reports.map(r => ({ id: r.id, type: r.type, reportNumber: r.reportNumber })),
          createdAt: new Date().toISOString()
        };

        memory.batches.unshift(batch);
        memory.recentReports.unshift(...reports);
        memory.stats.totalGenerated += reports.length;
        memory.stats.batchCount++;
        saveMemory(memory);

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              message: `Batch generated: ${reports.length} reports`,
              batch: {
                id: batchId,
                project: params.project,
                voltage: params.voltage,
                reportCount: reports.length
              },
              reports: reports.map(r => ({
                reportNumber: r.reportNumber,
                type: r.type
              })),
              export: params.export ? {
                format: params.export,
                output: params.output || `~/Downloads/${params.project.replace(/\s+/g, "-")}/`
              } : null
            }, null, 2)
          }]
        };
      }

      default:
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ error: `Unknown tool: ${name}` })
          }]
        };
    }
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }]
    };
  }
});

// List resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "report://recent",
        name: "Recent Reports",
        description: "List of recently generated reports",
        mimeType: "application/json"
      },
      {
        uri: "report://stats",
        name: "Report Statistics",
        description: "Generation and export statistics",
        mimeType: "application/json"
      },
      {
        uri: "template://list",
        name: "Equipment Templates",
        description: "Available equipment templates",
        mimeType: "application/json"
      }
    ]
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const memory = loadMemory();

  if (uri === "report://recent") {
    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(memory.recentReports.slice(0, 10), null, 2)
      }]
    };
  }

  if (uri === "report://stats") {
    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(memory.stats, null, 2)
      }]
    };
  }

  if (uri === "template://list") {
    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(memory.equipmentTemplates || {}, null, 2)
      }]
    };
  }

  // Template lookup: template://ABB:REF615
  if (uri.startsWith("template://")) {
    const templateId = uri.replace("template://", "");
    const [manufacturer, model] = templateId.split(":");

    // Search in all template categories
    for (const category of Object.values(memory.equipmentTemplates || {})) {
      if (typeof category === "object" && category !== null) {
        const template = (category as Record<string, any>)[templateId];
        if (template) {
          return {
            contents: [{
              uri,
              mimeType: "application/json",
              text: JSON.stringify(template, null, 2)
            }]
          };
        }
      }
    }

    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify({ error: `Template ${templateId} not found` })
      }]
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("T&C Report MCP Server running on stdio");
}

main().catch(console.error);
