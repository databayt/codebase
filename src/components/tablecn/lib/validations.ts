import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";
import type { TablecnTask } from "@prisma/client";
import { flagConfig } from "@/components/tablecn/config/flag";
import { getFiltersStateParser, getSortingStateParser } from "@/components/tablecn/lib/parsers";
import {
  TASK_STATUS_VALUES,
  TASK_LABEL_VALUES,
  TASK_PRIORITY_VALUES,
} from "@/components/tablecn/lib/utils";

export const searchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<TablecnTask>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  title: parseAsString.withDefault(""),
  status: parseAsArrayOf(
    parseAsStringEnum(TASK_STATUS_VALUES),
  ).withDefault([]),
  priority: parseAsArrayOf(
    parseAsStringEnum(TASK_PRIORITY_VALUES),
  ).withDefault([]),
  estimatedHours: parseAsArrayOf(parseAsInteger).withDefault([]),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  label: z.enum(TASK_LABEL_VALUES as [string, ...string[]]),
  status: z.enum(TASK_STATUS_VALUES as [string, ...string[]]),
  priority: z.enum(TASK_PRIORITY_VALUES as [string, ...string[]]),
  estimatedHours: z.number().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  label: z.enum(TASK_LABEL_VALUES as [string, ...string[]]).optional(),
  status: z.enum(TASK_STATUS_VALUES as [string, ...string[]]).optional(),
  priority: z.enum(TASK_PRIORITY_VALUES as [string, ...string[]]).optional(),
  estimatedHours: z.number().optional(),
});

export type GetTasksSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
