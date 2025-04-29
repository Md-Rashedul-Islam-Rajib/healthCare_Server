import { Prisma } from "@prisma/client";
import { DoctorScheduleFilterParams } from "./DS.types";


export const doctorScheduleFilters = (
  params?: DoctorScheduleFilterParams
): Prisma.DoctorSchedulesWhereInput | undefined => {
  if (!params) return undefined;

  const { startDate, endDate, ...exactFilters } = params;

  const where: Prisma.DoctorSchedulesWhereInput = {};

  // Exact match filtering (AND logic)
  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  for (const key in exactFilters) {
    const value = exactFilters[key];
    if (value !== undefined && value !== "") {
      if (typeof exactFilters.isBooked === "string") {
        if (exactFilters.isBooked === "true") {
          exactFilters.isBooked = true;
        }
        if (exactFilters.isBooked === "false") {
          exactFilters.isBooked = false;
        }
      }
      andConditions.push({ [key]: value });
    }
  }

  if (andConditions.length) {
    where.AND = andConditions;
  }

  return where;
};
