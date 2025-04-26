import { Doctor, PrismaClient } from "@prisma/client";
import { TDoctorFilterParams } from "./doctor.types";
import { doctorFilters } from "./doctor.utilities";

const prisma = new PrismaClient();
export class DoctorService {
  static getAllDoctors = async (
    params?: TDoctorFilterParams,
    options?: any
  ) => {
    const { limit, page, skip } = options;
    const filterOptions = doctorFilters(params);
    const result = await prisma.doctor.findMany({
      where: filterOptions,
      skip: page ? skip : undefined,
      take: limit ? limit : undefined,
      orderBy:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { createdAt: "desc" },
      include: {
        doctorSpecialties: {
          include: {
            specialties:true
          }
        }
      }
    });

    const totalCount = await prisma.doctor.count({ where: filterOptions });
    return {
      meta: {
        page: page || 1,
        limit: limit || 10,
        total: totalCount,
      },
      data: result,
    };
  };

  static getSingleDoctor = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
      where: { id, isDeleted: false },
    });
    return result;
  };

  static updateDoctor = async (id: string, payload: any) => {
    const { specialties, ...rest } = payload;
    await prisma.$transaction(async (transaction) => {
      await transaction.doctor.update({
        where: { id, isDeleted: false },
        data: rest,
      });

      if (specialties && specialties.length > 0) {
        const deleteSpecialties = specialties.filter(
          (specialty: any) => specialty.isDeleted
        );
        for (const specialty of deleteSpecialties) {
          await transaction.doctorSpecialties.deleteMany({
            where: {
              doctorId: id,
              specialtiesId: specialty.specialtiesId,
            },
          });
        }

        const addSpecialties = specialties.filter((specialty:any) => !specialty.isDeleted);
        for (const specialty of addSpecialties) {
          await transaction.doctorSpecialties.create({
            data: {
              doctorId: id,
              specialtiesId: specialty.specialtiesId
            }
          })
        }
      }
    });

    const result = await prisma.doctor.findUnique({
      where: { id },
      include: {
        doctorSpecialties: {
          include: {specialties:true}
        }
      }
    })

    return result;
  };

  static deleteDoctor = async (id: string): Promise<Doctor | null> => {
    // ? soft delete
    //    const result = await prisma.$transaction(async (transaction) => {
    //      const doctorDeletedData = await transaction.doctor.update({
    //          where: { id,isDeleted:false },
    //          data: {isDeleted:true}
    //      });
    //      const userDeletedData = await transaction.user.update({
    //        where: { email: doctorDeletedData.email },
    //        data: { status: Status.DELETED },
    //      });
    //      return doctorDeletedData;
    //    });
    const result = await prisma.$transaction(async (transaction) => {
      const doctorDeletedData = await transaction.doctor.delete({
        where: { id },
      });
      const userDeletedData = await transaction.user.delete({
        where: { email: doctorDeletedData.email },
      });
      return doctorDeletedData;
    });
    return result;
  };
}
