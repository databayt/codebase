"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CalendarIcon,
  CircleDashed,
  Clock,
  Ellipsis,
  Text,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/tablecn/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TablecnTask, TablecnTaskStatus, TablecnTaskPriority, TablecnTaskLabel } from "@prisma/client";
import { formatDate } from "@/components/tablecn/lib/format";
import { getErrorMessage } from "@/components/tablecn/lib/handle-error";
import type { DataTableRowAction } from "@/components/tablecn/types/data-table";

import { updateTask } from "@/components/tablecn/actions/actions";
import {
  getStatusIcon,
  getPriorityIcon,
  getStatusLabel,
  getPriorityLabel,
  getLabelLabel,
  TASK_STATUS_VALUES,
  TASK_LABEL_VALUES,
  TASK_PRIORITY_VALUES,
} from "@/components/tablecn/lib/utils";

interface GetTasksTableColumnsProps {
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  estimatedHoursRange: { min: number; max: number };
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<TablecnTask> | null>
  >;
}

export function getTasksTableColumns({
  statusCounts,
  priorityCounts,
  estimatedHoursRange,
  setRowAction,
}: GetTasksTableColumnsProps): ColumnDef<TablecnTask>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          className="translate-y-0.5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          className="translate-y-0.5"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: "code",
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Task" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("code")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Title" />
      ),
      cell: ({ row }) => {
        const label = TASK_LABEL_VALUES.find(
          (l) => l === row.original.label,
        );

        return (
          <div className="flex items-center gap-2">
            {label && <Badge variant="outline">{getLabelLabel(label)}</Badge>}
            <span className="max-w-125 truncate font-medium">
              {row.getValue("title")}
            </span>
          </div>
        );
      },
      meta: {
        label: "Title",
        placeholder: "Search titles...",
        variant: "text",
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = TASK_STATUS_VALUES.find(
          (s) => s === cell.getValue<TablecnTaskStatus>(),
        );

        if (!status) return null;

        const Icon = getStatusIcon(status);

        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span>{getStatusLabel(status)}</span>
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: TASK_STATUS_VALUES.map((status) => ({
          label: getStatusLabel(status),
          value: status,
          count: statusCounts[status] ?? 0,
          icon: getStatusIcon(status),
        })),
        icon: CircleDashed,
      },
      enableColumnFilter: true,
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Priority" />
      ),
      cell: ({ cell }) => {
        const priority = TASK_PRIORITY_VALUES.find(
          (p) => p === cell.getValue<TablecnTaskPriority>(),
        );

        if (!priority) return null;

        const Icon = getPriorityIcon(priority);

        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span>{getPriorityLabel(priority)}</span>
          </Badge>
        );
      },
      meta: {
        label: "Priority",
        variant: "multiSelect",
        options: TASK_PRIORITY_VALUES.map((priority) => ({
          label: getPriorityLabel(priority),
          value: priority,
          count: priorityCounts[priority] ?? 0,
          icon: getPriorityIcon(priority),
        })),
        icon: ArrowUpDown,
      },
      enableColumnFilter: true,
    },
    {
      id: "estimatedHours",
      accessorKey: "estimatedHours",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Est. Hours" />
      ),
      cell: ({ cell }) => {
        const estimatedHours = cell.getValue<number>();
        return <div className="w-20 text-right">{estimatedHours}</div>;
      },
      meta: {
        label: "Est. Hours",
        variant: "range",
        range: [estimatedHoursRange.min, estimatedHoursRange.max],
        unit: "hr",
        icon: Clock,
      },
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "update" })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.label}
                    onValueChange={(value) => {
                      startUpdateTransition(() => {
                        toast.promise(
                          updateTask({
                            id: row.original.id,
                            label: value as TablecnTaskLabel,
                          }),
                          {
                            loading: "Updating...",
                            success: "Label updated",
                            error: (err) => getErrorMessage(err),
                          },
                        );
                      });
                    }}
                  >
                    {TASK_LABEL_VALUES.map((label) => (
                      <DropdownMenuRadioItem
                        key={label}
                        value={label}
                        disabled={isUpdatePending}
                      >
                        {getLabelLabel(label)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "delete" })}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
