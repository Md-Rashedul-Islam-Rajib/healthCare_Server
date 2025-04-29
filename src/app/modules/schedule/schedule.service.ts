import { PrismaClient } from "@prisma/client";
import { addHours, addMinutes, format } from "date-fns";
import { ScheduleFilterParams, Slot } from "./schedule.types";
import { paginationBuilder } from "../../../utilities/paginationbuilder";
import { scheduleFilters } from "./schedule.utilities";
const prisma = new PrismaClient();
export class ScheduleService {
  static getAllSchedules = async (
    user: any,
    params?: ScheduleFilterParams,
    options?: any
  ) => {
    const doctorSchedules = await prisma.doctorSchedules.findMany({
      where: {
        doctor: {
          email: user.email,
        },
      },
    });

    const scheduleIds = doctorSchedules.map((schedule) => schedule.scheduleId);
    const { limit, page, skip } = paginationBuilder(options);
    const filterOptions = scheduleFilters(params);
    const result = await prisma.schedule.findMany({
      where: {
        ...filterOptions,
        id: {
          notIn: scheduleIds,
        },
      },
      skip: page ? skip : undefined,
      take: limit ? limit : undefined,
      orderBy:
        options.sortBy && options.sortOrder
          ? {
              [options.sortBy]: options.sortOrder,
            }
          : {
              createdAt: "desc",
            },
    });

    const totalCount = await prisma.schedule.count({
      where: {
        ...filterOptions,
        id: {
          notIn: scheduleIds,
        },
      },
    });
    return {
      meta: {
        page: page || 1,
        limit: limit || 10,
        total: totalCount,
      },
      data: result,
    };
  };

  static async getSingleSchedule(id: string) {
    const result = await prisma.schedule.findUnique({
      where: {id}
    })
    return result;
  }

  static async createSchedule(payload: any) {
    const { startDate, endDate, startTime, endTime } = payload;
    const startingDate = new Date(startDate);
    const endingDate = new Date(endDate);
    const schedule = [];
    const intervalTime = 30;
    while (startingDate <= endingDate) {
      const startDateTime = new Date(
        addMinutes(
          addHours(
            `${format(startingDate, "dd-MM-yyyy")}`,
            Number(startTime.split(":")[0])
          ),
          Number(startTime.split(":")[1])
        )
      );

      const endDateTime = new Date(
        addMinutes(
          addHours(
            `${format(startingDate, "dd-MM-yyyy")}`,
            Number(endTime.split(":")[0])
          ),
          Number(endTime.split(":")[1])
        )
      );

      while (startDateTime < endDateTime) {
        const scheduleData = {
          startDateTime,
          endDateTime: addMinutes(startDateTime, intervalTime),
        };

        const isExists = await prisma.schedule.findFirst({
          where: {
            startDateTime: scheduleData.startDateTime,
            endDateTime: scheduleData.endDateTime,
          },
        });

        if (!isExists) {
          const result = await prisma.schedule.create({
            data: scheduleData,
          });
          schedule.push(result);
        }
        startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
      }
      startingDate.setDate(startingDate.getDate() + 1);
    }
    // const startingTime = new Date(startingDate.setHours(startTime.split(':')[0], startTime.split(':')[1]));
    return schedule;
  }

  static async createAllSchedule(payload: any) {
    const { startDate, endDate, startTime, endTime } = payload;

    // Extract hours and minutes separately
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const intervalMinutes = 30;
    const slots = await prisma.$queryRaw<
      Slot[]
    > //! with recursive CTEs to generate time slots
    `
       /* Step 1: Generate a list of dates from startDate to endDate */


       WITH RECURSIVE dates AS (
  SELECT DATE '${startDate}' AS day  /* Start with the first date */
  UNION ALL
  SELECT day + INTERVAL '1 day'       /* Then add one day at a time */
  FROM dates
  WHERE day + INTERVAL '1 day' <= DATE '${endDate}'  /* Stop when we pass the end date */
),


/* Step 2: For each date, generate time slots between startHour:startMinute and endHour:endMinute */


time_slots AS (

  /* First time slot of the day */
  SELECT 
    day,
    day + INTERVAL '${startHour} hours' + INTERVAL '${startMinute} minutes' AS start_time,
    day + INTERVAL '${startHour} hours' + INTERVAL '${startMinute + intervalMinutes} minutes' AS end_time
  FROM dates

  UNION ALL

  /* Recursively add next time slots by adding intervalMinutes */
  SELECT 
    day,
    start_time + INTERVAL '${intervalMinutes} minutes',
    end_time + INTERVAL '${intervalMinutes} minutes'
  FROM time_slots
  WHERE start_time + INTERVAL '${intervalMinutes} minutes' <= day + INTERVAL '${endHour} hours' + INTERVAL '${endMinute} minutes'
)

/* Step 3: Select all generated time slots and order them */
SELECT 
  start_time AS "startDateTime",
  end_time AS "endDateTime"
FROM time_slots
ORDER BY start_time;

    `;
    // ! use generate_series to generate time slots
    // `
    //       SELECT
    //         gs AS "startDateTime",
    //         gs + INTERVAL '${intervalMinutes} minutes' AS "endDateTime"
    //       FROM generate_series(
    //         TIMESTAMP '${startDate} ${startHour}:${startMinute}:00',
    //         TIMESTAMP '${endDate} ${endHour}:${endMinute}:00',
    //         INTERVAL '${intervalMinutes} minutes'
    //       ) AS gs
    //       WHERE EXTRACT(DOW FROM gs) NOT IN (0, 6) /* <== Exclude saturday and sunday */
    //       ORDER BY "startDateTime";
    //     `;

    // Now map the results to the desired format
    const scheduleData = slots.map((slot) => ({
      startDateTime: slot.startDateTime,
      endDateTime: slot.endDateTime,
    }));

    // Insert all at once
    await prisma.schedule.createMany({
      data: scheduleData,
      skipDuplicates: true, // avoid inserting same slots again if re-triggered
    });

    return scheduleData;
  }

  static async deleteSchedule(id: string) {
    const result = await prisma.schedule.delete({
      where: { id }
    })
    return result;
  }
}
