"use server";

import { revalidatePath } from "next/cache";
import { customAlphabet } from "nanoid";
import { db } from "@/lib/db";
import type { TablecnTask, TablecnTaskLabel, TablecnTaskStatus, TablecnTaskPriority } from "@prisma/client";
import { getErrorMessage } from "@/components/tablecn/lib/handle-error";
import { generateRandomTask } from "@/components/tablecn/lib/utils";
import type { CreateTaskSchema, UpdateTaskSchema } from "@/components/tablecn/lib/validations";

const REVALIDATE_PATH = "/tablecn";

export async function seedTasks(input: { count: number }) {
  const count = input.count ?? 100;

  try {
    // Delete existing tasks
    await db.tablecnTask.deleteMany();

    // Generate and insert new tasks
    const tasks = [];
    for (let i = 0; i < count; i++) {
      tasks.push(generateRandomTask());
    }

    console.log(`Inserting ${tasks.length} tasks`);
    await db.tablecnTask.createMany({ data: tasks });

    revalidatePath(REVALIDATE_PATH);

    return {
      data: { count: tasks.length },
      error: null,
    };
  } catch (err) {
    console.error("Error seeding tasks:", err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function createTask(input: CreateTaskSchema) {
  try {
    const task = await db.tablecnTask.create({
      data: {
        code: `TASK-${customAlphabet("0123456789", 4)()}`,
        title: input.title,
        status: input.status as TablecnTaskStatus,
        label: input.label as TablecnTaskLabel,
        priority: input.priority as TablecnTaskPriority,
        estimatedHours: input.estimatedHours,
      },
    });

    revalidatePath(REVALIDATE_PATH);

    return {
      data: task,
      error: null,
    };
  } catch (err) {
    console.error("Error creating task:", err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateTask(input: UpdateTaskSchema & { id: string }) {
  try {
    const task = await db.tablecnTask.update({
      where: { id: input.id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.label !== undefined && { label: input.label as TablecnTaskLabel }),
        ...(input.status !== undefined && { status: input.status as TablecnTaskStatus }),
        ...(input.priority !== undefined && { priority: input.priority as TablecnTaskPriority }),
        ...(input.estimatedHours !== undefined && {
          estimatedHours: input.estimatedHours,
        }),
      },
    });

    revalidatePath(REVALIDATE_PATH);

    return {
      data: task,
      error: null,
    };
  } catch (err) {
    console.error("Error updating task:", err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateTasks(input: {
  ids: string[];
  label?: TablecnTaskLabel;
  status?: TablecnTaskStatus;
  priority?: TablecnTaskPriority;
}) {
  try {
    await db.tablecnTask.updateMany({
      where: { id: { in: input.ids } },
      data: {
        ...(input.label !== undefined && { label: input.label }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.priority !== undefined && { priority: input.priority }),
      },
    });

    revalidatePath(REVALIDATE_PATH);

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    console.error("Error updating tasks:", err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteTask(input: { id: string }) {
  try {
    await db.tablecnTask.delete({
      where: { id: input.id },
    });

    revalidatePath(REVALIDATE_PATH);

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    console.error("Error deleting task:", err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteTasks(input: { ids: string[] }) {
  try {
    await db.tablecnTask.deleteMany({
      where: { id: { in: input.ids } },
    });

    revalidatePath(REVALIDATE_PATH);

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    console.error("Error deleting tasks:", err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
