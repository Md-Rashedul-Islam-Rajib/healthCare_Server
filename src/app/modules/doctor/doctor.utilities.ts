import { Prisma } from "@prisma/client";
import { searchFields } from "./doctor.constant";
import { TDoctorFilterParams } from "./doctor.types";



export const doctorFilters = (params?: TDoctorFilterParams): Prisma.DoctorWhereInput | undefined => {
    if (!params) return undefined;
    const { searchTerm,specialties, ...exactFilters } = params;

    const where: Prisma.DoctorWhereInput = {};
    
    if (searchTerm) {
        where.OR = searchFields.map((field) => ({
            [field]: {
                contains: searchTerm,
                mode: "insensitive"
            }
        }))
    }

    const andConditions: Prisma.DoctorWhereInput[] = [];

    for (const key in exactFilters) {
        const value = exactFilters[key];
        if (value !== undefined && value !== "") {
            andConditions.push({[key]:value})
        }
    }

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: "insensitive"
                        }
                    }
                }
            }
        })
    }
    // if (specialties && specialties.length > 0) {
    //   andConditions.push({
    //     OR: specialties.map((specialty: string) => ({
    //       doctorSpecialties: {
    //         some: {
    //           specialties: {
    //             title: {
    //               contains: specialty,
    //               mode: "insensitive",
    //             },
    //           },
    //         },
    //       },
    //     })),
    //   });
    // }


    andConditions.push({ isDeleted: false })
    if (andConditions.length) {
        where.AND = andConditions;
    }
    return where;
}