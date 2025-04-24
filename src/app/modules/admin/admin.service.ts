import { Admin, PrismaClient, Status } from "@prisma/client"
import { adminFilters } from "./admin.utils";
import { paginationBuilder } from "../../../utilities/paginationbuilder";
import { TAdminFilterParam } from "./admin.types";

const prisma = new PrismaClient();
export class AdminService {
  static getAllAdmin = async (params?: TAdminFilterParam, options?: any) => {
    const { limit, page, skip } = paginationBuilder(options);
    const filterOptions = adminFilters(params);
    const result = await prisma.admin.findMany({
      where: filterOptions,
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

    const totalCount = await prisma.admin.count({
      where: filterOptions,
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

  static getSingleAdmin = async (id: string): Promise<Admin | null> => {
    const result = await prisma.admin.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    });
    return result;
  };

  static updateAdmin = async (
    id: string,
    payload: Partial<Admin>
  ): Promise<Admin | null> => {
    const result = await prisma.admin.update({
      where: { id, isDeleted: false },
      data: payload,
    });
    return result;
  };

  static deleteAdmin = async (id: string): Promise<Admin | null> => {
    // ? soft delete
    //    const result = await prisma.$transaction(async (transaction) => {
    //      const adminDeletedData = await transaction.admin.update({
    //          where: { id,isDeleted:false },
    //          data: {isDeleted:true}
    //      });
    //      const userDeletedData = await transaction.user.update({
    //        where: { email: adminDeletedData.email },
    //        data: { status: Status.DELETED },
    //      });
    //      return adminDeletedData;
    //    });
    const result = await prisma.$transaction(async (transaction) => {
      const adminDeletedData = await transaction.admin.delete({
        where: { id },
      });
      const userDeletedData = await transaction.user.delete({
        where: { email: adminDeletedData.email },
      });
      return adminDeletedData;
    });
    return result;
  };
}