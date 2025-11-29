import type { Metadata } from "next";
import type * as React from "react";
import { SiteHeader } from "@/components/tablecn/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "TableCN - Data Table & Data Grid",
  description:
    "Shadcn table with server side sorting, pagination, and filtering",
};

interface TablecnLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function TablecnLayout({ children }: TablecnLayoutProps) {
  return (
    <TooltipProvider delayDuration={120}>
      <NuqsAdapter>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </div>
      </NuqsAdapter>
      <Toaster />
    </TooltipProvider>
  );
}
