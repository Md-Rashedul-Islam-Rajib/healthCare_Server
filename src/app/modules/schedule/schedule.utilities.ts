import { Prisma } from "@prisma/client";
import { ScheduleFilterParams } from "./schedule.types";






export const scheduleFilters = (
  params?: ScheduleFilterParams
): Prisma.ScheduleWhereInput | undefined => {
  if (!params) return undefined;

  const { startDate,endDate, ...exactFilters } = params;
  

  const where: Prisma.ScheduleWhereInput = {};


  // Exact match filtering (AND logic)
  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDate
          }
        },
        {
          endDateTime: {
            lte: endDate
          }
        }
      ]
    })
  }

  for (const key in exactFilters) {
    const value = exactFilters[key];
    if (value !== undefined && value !== "") {
      andConditions.push({ [key]: value });
    }
  }

  if (andConditions.length) {
    where.AND = andConditions;
  }

  return where;
};
