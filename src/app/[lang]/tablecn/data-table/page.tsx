import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/tablecn/data-table/data-table-skeleton";
import { Shell } from "@/components/tablecn/components/shell";
import { getValidFilters } from "@/components/tablecn/lib/data-table";
import { FeatureFlagsProvider } from "@/components/tablecn/components/feature-flags-provider";
import { TasksTable } from "@/components/tablecn/components/tasks-table";
import {
  getEstimatedHoursRange,
  getTaskPriorityCounts,
  getTaskStatusCounts,
  getTasks,
} from "@/components/tablecn/actions/queries";
import { searchParamsCache } from "@/components/tablecn/lib/validations";

export const runtime = "nodejs";

interface DataTablePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function DataTablePage(props: DataTablePageProps) {
  return (
    <Shell>
      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            filterCount={2}
            cellWidths={[
              "10rem",
              "30rem",
              "10rem",
              "10rem",
              "6rem",
              "6rem",
              "6rem",
            ]}
            shrinkZero
          />
        }
      >
        <FeatureFlagsProvider>
          <TasksTableWrapper {...props} />
        </FeatureFlagsProvider>
      </Suspense>
    </Shell>
  );
}

async function TasksTableWrapper(props: DataTablePageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getTasks({
      ...search,
      filters: validFilters,
    }),
    getTaskStatusCounts(),
    getTaskPriorityCounts(),
    getEstimatedHoursRange(),
  ]);

  return <TasksTable promises={promises} />;
}
