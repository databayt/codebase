"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { filterColumns } from "@/components/tablecn/lib/filter-columns";
import { getValidFilters } from "@/components/tablecn/lib/data-table";
import type { GetTasksSchema } from "@/components/tablecn/lib/validations";

export async function getTasks(input: GetTasksSchema) {
  try {
    const offset = (input.page - 1) * input.perPage;
    const advancedTable =
      input.filterFlag === "advancedFilters" ||
      input.filterFlag === "commandFilters";

    // Build advanced filter where clause
    const advancedWhere = advancedTable
      ? filterColumns({
          filters: input.filters,
          joinOperator: input.joinOperator,
        })
      : undefined;

    // Build basic filter where clause
    const basicWhere: Prisma.TablecnTaskWhereInput = advancedTable
      ? {}
      : {
          ...(input.title
            ? { title: { contains: input.title, mode: "insensitive" } }
            : {}),
          ...(input.status.length > 0 ? { status: { in: input.status } } : {}),
          ...(input.priority.length > 0
            ? { priority: { in: input.priority } }
            : {}),
          ...(input.estimatedHours.length > 0
            ? {
                AND: [
                  input.estimatedHours[0] !== undefined
                    ? { estimatedHours: { gte: input.estimatedHours[0] } }
                    : {},
                  input.estimatedHours[1] !== undefined
                    ? { estimatedHours: { lte: input.estimatedHours[1] } }
                    : {},
                ],
              }
            : {}),
          ...(input.createdAt.length > 0
            ? {
                AND: [
                  input.createdAt[0]
                    ? {
                        createdAt: {
                          gte: (() => {
                            const date = new Date(input.createdAt[0]);
                            date.setHours(0, 0, 0, 0);
                            return date;
                          })(),
                        },
                      }
                    : {},
                  input.createdAt[1]
                    ? {
                        createdAt: {
                          lte: (() => {
                            const date = new Date(input.createdAt[1]);
                            date.setHours(23, 59, 59, 999);
                            return date;
                          })(),
                        },
                      }
                    : {},
                ],
              }
            : {}),
        };

    const where: Prisma.TablecnTaskWhereInput = advancedTable
      ? advancedWhere ?? {}
      : basicWhere;

    // Build orderBy clause
    const orderBy: Prisma.TablecnTaskOrderByWithRelationInput[] =
      input.sort.length > 0
        ? input.sort.map((item) => ({
            [item.id]: item.desc ? "desc" : "asc",
          }))
        : [{ createdAt: "asc" }];

    // Execute queries
    const [data, total] = await Promise.all([
      db.tablecnTask.findMany({
        where,
        orderBy,
        skip: offset,
        take: input.perPage,
      }),
      db.tablecnTask.count({ where }),
    ]);

    const pageCount = Math.ceil(total / input.perPage);
    return { data, pageCount };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { data: [], pageCount: 0 };
  }
}

export async function getTaskStatusCounts() {
  try {
    const counts = await db.tablecnTask.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    return counts.reduce(
      (acc, { status, _count }) => {
        acc[status] = _count.status;
        return acc;
      },
      {
        todo: 0,
        in_progress: 0,
        done: 0,
        canceled: 0,
      } as Record<string, number>
    );
  } catch (error) {
    console.error("Error fetching status counts:", error);
    return {
      todo: 0,
      in_progress: 0,
      done: 0,
      canceled: 0,
    };
  }
}

export async function getTaskPriorityCounts() {
  try {
    const counts = await db.tablecnTask.groupBy({
      by: ["priority"],
      _count: { priority: true },
    });

    return counts.reduce(
      (acc, { priority, _count }) => {
        acc[priority] = _count.priority;
        return acc;
      },
      {
        low: 0,
        medium: 0,
        high: 0,
      } as Record<string, number>
    );
  } catch (error) {
    console.error("Error fetching priority counts:", error);
    return {
      low: 0,
      medium: 0,
      high: 0,
    };
  }
}

export async function getEstimatedHoursRange() {
  try {
    const result = await db.tablecnTask.aggregate({
      _min: { estimatedHours: true },
      _max: { estimatedHours: true },
    });

    return {
      min: result._min.estimatedHours ?? 0,
      max: result._max.estimatedHours ?? 0,
    };
  } catch (error) {
    console.error("Error fetching estimated hours range:", error);
    return { min: 0, max: 0 };
  }
}

export async function getAllTasks() {
  try {
    return await db.tablecnTask.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    return [];
  }
}
