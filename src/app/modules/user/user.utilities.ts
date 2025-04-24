import { Prisma } from "@prisma/client";
import { searchFields } from "./user.constant";


type UserFilterParams = {
  searchTerm?: string;
  [key: string]: any; 
};

export const userFilters = (
  params?: UserFilterParams
): Prisma.UserWhereInput | undefined => {
  if (!params) return undefined;

  const { searchTerm, ...exactFilters } = params;
  

  const where: Prisma.UserWhereInput = {};

  // SearchTerm filtering (OR across fields)
  if (searchTerm) {
    where.OR = searchFields.map((field) => (
      {

      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
      }
    ));
  }

  // Exact match filtering (AND logic)
  const andConditions: Prisma.UserWhereInput[] = [];

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
