import { addDays, endOfDay, startOfDay } from "date-fns";
import { Prisma } from "@prisma/client";
import type { ExtendedColumnFilter, JoinOperator } from "@/components/tablecn/types/data-table";

type TablecnTaskWhereInput = Prisma.TablecnTaskWhereInput;

/**
 * Build Prisma where clause from advanced filters
 */
export function filterColumns({
  filters,
  joinOperator,
}: {
  filters: ExtendedColumnFilter<unknown>[];
  joinOperator: JoinOperator;
}): TablecnTaskWhereInput | undefined {
  if (filters.length === 0) return undefined;

  const conditions = filters
    .map((filter) => buildCondition(filter))
    .filter((c): c is TablecnTaskWhereInput => c !== undefined);

  if (conditions.length === 0) return undefined;

  return joinOperator === "and" ? { AND: conditions } : { OR: conditions };
}

function buildCondition(
  filter: ExtendedColumnFilter<unknown>
): TablecnTaskWhereInput | undefined {
  const field = filter.id as string;

  switch (filter.operator) {
    case "iLike":
      if (filter.variant === "text" && typeof filter.value === "string") {
        return { [field]: { contains: filter.value, mode: "insensitive" } };
      }
      return undefined;

    case "notILike":
      if (filter.variant === "text" && typeof filter.value === "string") {
        return {
          NOT: { [field]: { contains: filter.value, mode: "insensitive" } },
        };
      }
      return undefined;

    case "eq":
      if (filter.variant === "date" || filter.variant === "dateRange") {
        const date = new Date(Number(filter.value));
        date.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return { [field]: { gte: date, lte: end } };
      }
      return { [field]: { equals: filter.value } };

    case "ne":
      if (filter.variant === "date" || filter.variant === "dateRange") {
        const date = new Date(Number(filter.value));
        date.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return { OR: [{ [field]: { lt: date } }, { [field]: { gt: end } }] };
      }
      return { [field]: { not: filter.value } };

    case "inArray":
      if (Array.isArray(filter.value)) {
        return { [field]: { in: filter.value } };
      }
      return undefined;

    case "notInArray":
      if (Array.isArray(filter.value)) {
        return { [field]: { notIn: filter.value } };
      }
      return undefined;

    case "lt":
      if (filter.variant === "number" || filter.variant === "range") {
        return { [field]: { lt: Number(filter.value) } };
      }
      if (filter.variant === "date" && typeof filter.value === "string") {
        const date = new Date(Number(filter.value));
        date.setHours(23, 59, 59, 999);
        return { [field]: { lt: date } };
      }
      return undefined;

    case "lte":
      if (filter.variant === "number" || filter.variant === "range") {
        return { [field]: { lte: Number(filter.value) } };
      }
      if (filter.variant === "date" && typeof filter.value === "string") {
        const date = new Date(Number(filter.value));
        date.setHours(23, 59, 59, 999);
        return { [field]: { lte: date } };
      }
      return undefined;

    case "gt":
      if (filter.variant === "number" || filter.variant === "range") {
        return { [field]: { gt: Number(filter.value) } };
      }
      if (filter.variant === "date" && typeof filter.value === "string") {
        const date = new Date(Number(filter.value));
        date.setHours(0, 0, 0, 0);
        return { [field]: { gt: date } };
      }
      return undefined;

    case "gte":
      if (filter.variant === "number" || filter.variant === "range") {
        return { [field]: { gte: Number(filter.value) } };
      }
      if (filter.variant === "date" && typeof filter.value === "string") {
        const date = new Date(Number(filter.value));
        date.setHours(0, 0, 0, 0);
        return { [field]: { gte: date } };
      }
      return undefined;

    case "isBetween":
      if (
        (filter.variant === "date" || filter.variant === "dateRange") &&
        Array.isArray(filter.value) &&
        filter.value.length === 2
      ) {
        const conditions: TablecnTaskWhereInput[] = [];
        if (filter.value[0]) {
          const date = new Date(Number(filter.value[0]));
          date.setHours(0, 0, 0, 0);
          conditions.push({ [field]: { gte: date } });
        }
        if (filter.value[1]) {
          const date = new Date(Number(filter.value[1]));
          date.setHours(23, 59, 59, 999);
          conditions.push({ [field]: { lte: date } });
        }
        return conditions.length > 0 ? { AND: conditions } : undefined;
      }

      if (
        (filter.variant === "number" || filter.variant === "range") &&
        Array.isArray(filter.value) &&
        filter.value.length === 2
      ) {
        const firstValue =
          filter.value[0] && String(filter.value[0]).trim() !== ""
            ? Number(filter.value[0])
            : null;
        const secondValue =
          filter.value[1] && String(filter.value[1]).trim() !== ""
            ? Number(filter.value[1])
            : null;

        if (firstValue === null && secondValue === null) return undefined;
        if (firstValue !== null && secondValue === null)
          return { [field]: { equals: firstValue } };
        if (firstValue === null && secondValue !== null)
          return { [field]: { equals: secondValue } };

        return {
          AND: [
            { [field]: { gte: firstValue } },
            { [field]: { lte: secondValue } },
          ],
        };
      }
      return undefined;

    case "isRelativeToToday":
      if (
        (filter.variant === "date" || filter.variant === "dateRange") &&
        typeof filter.value === "string"
      ) {
        const today = new Date();
        const [amount, unit] = filter.value.split(" ") ?? [];
        let startDate: Date;
        let endDate: Date;

        if (!amount || !unit) return undefined;

        switch (unit) {
          case "days":
            startDate = startOfDay(addDays(today, Number.parseInt(amount, 10)));
            endDate = endOfDay(startDate);
            break;
          case "weeks":
            startDate = startOfDay(
              addDays(today, Number.parseInt(amount, 10) * 7)
            );
            endDate = endOfDay(addDays(startDate, 6));
            break;
          case "months":
            startDate = startOfDay(
              addDays(today, Number.parseInt(amount, 10) * 30)
            );
            endDate = endOfDay(addDays(startDate, 29));
            break;
          default:
            return undefined;
        }

        return { [field]: { gte: startDate, lte: endDate } };
      }
      return undefined;

    case "isEmpty":
      return { [field]: null };

    case "isNotEmpty":
      return { NOT: { [field]: null } };

    default:
      return undefined;
  }
}
