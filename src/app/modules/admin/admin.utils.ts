import { Prisma } from "@prisma/client";
import { searchFields } from "./admin.constant";

type AdminFilterParams = {
  searchTerm?: string;
  role?: string;
  status?: string;
  email?: string;
  [key: string]: any; 
};

export const adminFilters = (
  params?: AdminFilterParams
): Prisma.AdminWhereInput | undefined => {
  if (!params) return undefined;

  const { searchTerm, ...exactFilters } = params;
  

  const where: Prisma.AdminWhereInput = {};

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
  const andConditions: Prisma.AdminWhereInput[] = [];

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
