import type { Metadata } from "next";
import type * as React from "react";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "TableCN - Data Table & Data Grid",
  description:
    "A comprehensive data table and data grid system built on TanStack React Table with server-side pagination, sorting, filtering, and virtualized grid support.",
};

interface TablecnLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function TablecnLayout({ children }: TablecnLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
