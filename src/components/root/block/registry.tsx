"use client";

import dynamic from "next/dynamic";
import type { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";

// Block component props interface
export interface BlockComponentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

// Block registry entry
export interface BlockEntry {
  id: string;
  title: string;
  description: string;
  category: "data" | "auth" | "payment" | "dashboard" | "forms" | "marketing";
  component: React.ComponentType<BlockComponentProps>;
  status: "active" | "pending" | "draft";
}

// Placeholder component for blocks under development
function BlockPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
      <div className="text-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          This block is under development
        </p>
      </div>
    </div>
  );
}

// Table Block wrapper
const TableBlock = dynamic(
  () => import("./table/content").catch(() => {
    return { default: () => <BlockPlaceholder title="Data Table" /> };
  }),
  { ssr: false }
);

// Auth Block wrapper
const AuthBlock = dynamic(
  () => import("./auth/content").catch(() => {
    return { default: () => <BlockPlaceholder title="Authentication" /> };
  }),
  { ssr: false }
);

// Invoice Block wrapper
const InvoiceBlock = dynamic(
  () => import("./invoice/content").catch(() => {
    return { default: () => <BlockPlaceholder title="Invoice" /> };
  }),
  { ssr: false }
);

// Report Block wrapper
const ReportBlock = dynamic(
  () => import("./report/content").catch(() => {
    return { default: () => <BlockPlaceholder title="T&C Report" /> };
  }),
  { ssr: false }
);

// Block registry - maps block names to their metadata and components
export const blockRegistry: Record<string, BlockEntry> = {
  table: {
    id: "table",
    title: "Data Table",
    description: "Advanced data table with filtering, sorting, and pagination using TanStack Table",
    category: "data",
    component: TableBlock,
    status: "active",
  },
  auth: {
    id: "auth",
    title: "Authentication",
    description: "Complete authentication system with login, register, forgot password, and 2FA",
    category: "auth",
    component: AuthBlock,
    status: "active",
  },
  invoice: {
    id: "invoice",
    title: "Invoice",
    description: "Invoice generation and management with PDF export",
    category: "payment",
    component: InvoiceBlock,
    status: "active",
  },
  report: {
    id: "report",
    title: "T&C Report",
    description: "Electrical Testing & Commissioning reports with DOCX/PDF export",
    category: "data",
    component: ReportBlock,
    status: "active",
  },
};

// Get all blocks as an array
export function getBlocks(): BlockEntry[] {
  return Object.values(blockRegistry);
}

// Get blocks by category
export function getBlocksByCategory(category: BlockEntry["category"]): BlockEntry[] {
  return Object.values(blockRegistry).filter((block) => block.category === category);
}

// Get active blocks only
export function getActiveBlocks(): BlockEntry[] {
  return Object.values(blockRegistry).filter((block) => block.status === "active");
}
