import { Suspense } from "react";
import { DataGridDemo } from "@/components/tablecn/data-grid/data-grid-demo";
import { Skeleton } from "@/components/ui/skeleton";

export const runtime = "nodejs";

interface DataGridPageProps {
  params: Promise<{ lang: string }>;
}

export default async function DataGridPage({ params }: DataGridPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container flex h-[calc(100dvh-5rem)] flex-col gap-4 py-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Data Grid</h1>
            <p className="text-muted-foreground">
              Client-side virtualized data grid with inline editing and keyboard
              navigation.
            </p>
          </div>
          <div className="flex items-center gap-2 self-end">
            <Skeleton className="h-7 w-18" />
            <Skeleton className="h-7 w-18" />
            <Skeleton className="h-7 w-18" />
          </div>
          <Skeleton className="h-full w-full" />
        </div>
      }
    >
      <DataGridDemoWrapper />
    </Suspense>
  );
}

async function DataGridDemoWrapper() {
  return (
    <div className="container flex h-[calc(100dvh-5rem)] flex-col gap-4 py-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Data Grid</h1>
        <p className="text-muted-foreground">
          Client-side virtualized data grid with inline editing and keyboard
          navigation.
        </p>
      </div>
      <DataGridDemo />
    </div>
  );
}
