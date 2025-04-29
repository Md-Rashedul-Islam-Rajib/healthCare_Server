import { paginationBuilder } from "../../../utilities/paginationbuilder";
import prisma from "../../prisma";
import { DoctorScheduleFilterParams } from "./DS.types";
import { doctorScheduleFilters } from "./DS.utilities";

export class DoctorScheduleService {
   static getMySchedules = async (
       params?: DoctorScheduleFilterParams,
       options?: any
     ) => {
       
       const { limit, page, skip } = paginationBuilder(options);
       const filterOptions = doctorScheduleFilters(params);
       const result = await prisma.doctorSchedules.findMany({
         where: 
           filterOptions,
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
   
       const totalCount = await prisma.doctorSchedules.count({
         where: filterOptions
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
    
    static async createDoctorSchedule(user:any,payload:any) {
        const doctorData = await prisma.doctor.findUniqueOrThrow({
           where:{email:user.email}
        })
        const doctorSchedule = payload.scheduleIds.map((scheduleId: string) => ({
            scheduleId,
            doctorId:doctorData.id
        }))

        const result = await prisma.doctorSchedules.createMany({
            data:doctorSchedule
        })
        return result;
    }

  static async deleteDoctorSchedule(user: any, id: string) {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
      where: { email: user.email },
    });

    const bookedSchedule = await prisma.doctorSchedules.findFirst({
      where: {
          doctorId: doctorData.id,
          scheduleId: id,
        isBooked:true
      },
    });

    if (bookedSchedule) {
      throw new Error("Cannot delete a booked schedule");
    }
    const result = await prisma.doctorSchedules.delete({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId:id
        }
      },
    });
    return result;
  }

}