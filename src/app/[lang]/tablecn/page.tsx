import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shell } from "@/components/tablecn/components/shell";
import { seedTasks } from "@/components/tablecn/actions/actions";
import { db } from "@/lib/db";
import { DatabaseIcon, GridIcon, TableIcon } from "lucide-react";

export const runtime = "nodejs";

interface TablecnPageProps {
  params: Promise<{ lang: string }>;
}

async function TaskCount() {
  const count = await db.tablecnTask.count();
  return <span className="text-2xl font-bold">{count}</span>;
}

async function SeedTasksButton() {
  async function handleSeed() {
    "use server";
    await seedTasks({ count: 100 });
  }

  return (
    <form action={handleSeed}>
      <Button type="submit" variant="outline" size="sm">
        <DatabaseIcon className="mr-2 size-4" />
        Seed 100 Tasks
      </Button>
    </form>
  );
}

export default async function TablecnPage({ params }: TablecnPageProps) {
  const { lang } = await params;

  return (
    <Shell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">TableCN</h1>
          <p className="text-muted-foreground">
            A comprehensive data table and data grid system built on TanStack
            React Table with server-side pagination, sorting, filtering, and
            virtualized grid support.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Tasks:</span>
            <Suspense fallback={<Skeleton className="h-8 w-12" />}>
              <TaskCount />
            </Suspense>
          </div>
          <SeedTasksButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TableIcon className="size-5" />
                Data Table
              </CardTitle>
              <CardDescription>
                Server-side data table with pagination, sorting, and advanced
                filtering capabilities. Ideal for large datasets with
                server-side operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Server-side pagination</li>
                <li>Multi-column sorting</li>
                <li>Advanced filtering (text, select, date range)</li>
                <li>Column visibility toggle</li>
                <li>Row selection with bulk actions</li>
                <li>URL state synchronization</li>
                <li>Export to CSV</li>
              </ul>
              <Button asChild>
                <Link href={`/${lang}/tablecn/data-table`}>
                  View Data Table Demo
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GridIcon className="size-5" />
                Data Grid
              </CardTitle>
              <CardDescription>
                Client-side virtualized data grid with inline editing, keyboard
                navigation, and copy/paste support. Perfect for spreadsheet-like
                interactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Virtual scrolling for large datasets</li>
                <li>Inline cell editing</li>
                <li>Keyboard navigation (arrow keys, tab)</li>
                <li>Copy/paste support</li>
                <li>Context menu actions</li>
                <li>Column resizing and reordering</li>
                <li>Row height customization</li>
              </ul>
              <Button asChild>
                <Link href={`/${lang}/tablecn/data-grid`}>
                  View Data Grid Demo
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
