import { faker } from "@faker-js/faker";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircle2,
  CircleHelp,
  CircleIcon,
  CircleX,
  Timer,
} from "lucide-react";
import { customAlphabet } from "nanoid";
import type {
  TablecnTask,
  TablecnTaskStatus,
  TablecnTaskLabel,
  TablecnTaskPriority,
} from "@prisma/client";

import { generateId } from "@/components/tablecn/lib/id";

// Status values matching Prisma enum
export const TASK_STATUS_VALUES: TablecnTaskStatus[] = [
  "todo",
  "in_progress",
  "done",
  "canceled",
];

// Label values matching Prisma enum
export const TASK_LABEL_VALUES: TablecnTaskLabel[] = [
  "bug",
  "feature",
  "enhancement",
  "documentation",
];

// Priority values matching Prisma enum
export const TASK_PRIORITY_VALUES: TablecnTaskPriority[] = [
  "low",
  "medium",
  "high",
];

export type TablecnTaskInput = Omit<TablecnTask, "id" | "createdAt" | "updatedAt">;

export function generateRandomTask(): TablecnTaskInput {
  return {
    code: `TASK-${customAlphabet("0123456789", 4)()}`,
    title: faker.hacker
      .phrase()
      .replace(/^./, (letter) => letter.toUpperCase()),
    estimatedHours: faker.number.int({ min: 1, max: 24 }),
    status: faker.helpers.shuffle(TASK_STATUS_VALUES)[0] ?? "todo",
    label: faker.helpers.shuffle(TASK_LABEL_VALUES)[0] ?? "bug",
    priority: faker.helpers.shuffle(TASK_PRIORITY_VALUES)[0] ?? "low",
    archived: faker.datatype.boolean({ probability: 0.2 }),
  };
}

export function getStatusIcon(status: TablecnTaskStatus) {
  const statusIcons = {
    canceled: CircleX,
    done: CheckCircle2,
    in_progress: Timer,
    todo: CircleHelp,
  };

  return statusIcons[status] || CircleIcon;
}

export function getPriorityIcon(priority: TablecnTaskPriority) {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  };

  return priorityIcons[priority] || CircleIcon;
}

/**
 * Get display label for status (handles underscore to display)
 */
export function getStatusLabel(status: TablecnTaskStatus): string {
  const labels: Record<TablecnTaskStatus, string> = {
    todo: "Todo",
    in_progress: "In Progress",
    done: "Done",
    canceled: "Canceled",
  };
  return labels[status] || status;
}

/**
 * Get display label for priority
 */
export function getPriorityLabel(priority: TablecnTaskPriority): string {
  const labels: Record<TablecnTaskPriority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };
  return labels[priority] || priority;
}

/**
 * Get display label for task label
 */
export function getLabelLabel(label: TablecnTaskLabel): string {
  const labels: Record<TablecnTaskLabel, string> = {
    bug: "Bug",
    feature: "Feature",
    enhancement: "Enhancement",
    documentation: "Documentation",
  };
  return labels[label] || label;
}
