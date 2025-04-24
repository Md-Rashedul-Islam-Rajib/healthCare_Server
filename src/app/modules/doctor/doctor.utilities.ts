import { Prisma } from "@prisma/client";
import { searchFields } from "./doctor.constant";
import { TDoctorFilterParams } from "./doctor.types";



export const doctorFilters = (params?: TDoctorFilterParams): Prisma.DoctorWhereInput | undefined => {
    if (!params) return undefined;
    const { searchTerm, ...exactFilters } = params;

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
    andConditions.push({ isDeleted: false })
    if (andConditions.length) {
        where.AND = andConditions;
    }
    return where;
}