import { Prisma } from "@prisma/client";
import { searchFields } from "./patient.constants";
import { PatientFilterParams } from "./patient.types";




export const patientFilters = (
  params?: PatientFilterParams
): Prisma.PatientWhereInput | undefined => {
  if (!params) return undefined;

  const { searchTerm, ...exactFilters } = params;
  

  const where: Prisma.PatientWhereInput = {};

  // SearchTerm filtering (OR across fields)
  if (searchTerm) {
    where.OR = searchFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));
  }

  // Exact match filtering (AND logic)
  const andConditions: Prisma.PatientWhereInput[] = [];

  for (const key in exactFilters) {
    const value = exactFilters[key];
    if (value !== undefined && value !== "") {
      andConditions.push({ [key]: value });
    }
  }
  andConditions.push({isDeleted:false})

  if (andConditions.length) {
    where.AND = andConditions;
  }

  return where;
};
