import { PrismaClient, Status, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { uploadToCloud } from "../../middlewares/multer";
import { TFile } from "../../types/file";
import { paginationBuilder } from "../../../utilities/paginationbuilder";
import { userFilters } from "./user.utilities";
import { TUserFilterParam } from "./user.types";
const prisma = new PrismaClient();
export class UserService {
  static async createAdmin(req: any) {
    const file: TFile = req.file;
    if (file) {
      const uploadResult = await uploadToCloud(file);

      req.body.admin.profilePhoto = uploadResult.secure_url as string;
    }
    const payload = req.body;
    const hashedPassword: string = await bcrypt.hash(payload?.password, 12);
    const userData = {
      email: payload.admin.email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    };

    const result = await prisma.$transaction(async (transaction) => {
      const createdUserData = await transaction.user.create({
        data: userData,
      });
      const createdAdminData = await transaction.admin.create({
        data: payload.admin,
      });
      return { createdAdminData, createdUserData };
    });

    return result;
  }

  static async createDoctor(req: any) {
    const file: TFile = req.file;
    if (file) {
      const uploadResult = await uploadToCloud(file);

      req.body.doctor.profilePhoto = uploadResult?.secure_url as string;
    }
    const payload = req.body;
    const hashedPassword: string = await bcrypt.hash(payload?.password, 12);
    const userData = {
      email: payload.doctor.email,
      password: hashedPassword,
      role: UserRole.DOCTOR,
    };

    const result = await prisma.$transaction(async (transaction) => {
      const createdUserData = await transaction.user.create({
        data: userData,
      });
      const createdDoctorData = await transaction.doctor.create({
        data: payload.doctor,
      });
      return { createdDoctorData, createdUserData };
    });

    return result;
  }

  static async createPatient(req: any) {
    const file: TFile = req.file;
    if (file) {
      const uploadResult = await uploadToCloud(file);

      req.body.patient.profilePhoto = uploadResult?.secure_url as string;
    }
    const payload = req.body;
    const hashedPassword: string = await bcrypt.hash(payload?.password, 12);
    const userData = {
      email: payload.patient.email,
      password: hashedPassword,
      role: UserRole.PATIENT,
    };

    const result = await prisma.$transaction(async (transaction) => {
      const createdUserData = await transaction.user.create({
        data: userData,
      });
      const createdPatientData = await transaction.patient.create({
        data: payload.patient,
      });
      return { createdPatientData, createdUserData };
    });

    return result;
  }

  static getAllUsers = async (params?: TUserFilterParam, options?: any) => {
    const { limit, page, skip } = paginationBuilder(options);
    const filterOptions = userFilters(params);
    
    const result = await prisma.user.findMany({
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

      select: {
        id: true,
        email: true,
        role: true,
        needPasswordChange: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        admin: true,
        doctor: true,
        patient: true,
      },
    });

    const totalCount = await prisma.user.count({
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

  static async changeUserStatus(id: string, status: Status) {
    const result = await prisma.user.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  static async getMyProfile(user: any) {
    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        email: user.email,
        status: "ACTIVE",
      },
    });
    let profile;
    if (userData.role === UserRole.SUPER_ADMIN) {
      profile = await prisma.admin.findUnique({
        where: { email: user.email },
      });
    } else if (userData.role === UserRole.ADMIN) {
      profile = await prisma.admin.findUnique({
        where: { email: user.email },
      });
    } else if (userData.role === UserRole.DOCTOR) {
      profile = await prisma.doctor.findUnique({
        where: { email: user.email },
      });
    } else if (userData.role === UserRole.PATIENT) {
      profile = await prisma.patient.findUnique({
        where: { email: user.email },
      });
    }
    return { ...userData, ...profile };
  }

  static updateMyProfile = async (user: any, req: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        email: user.email,
        status: "ACTIVE",
      },
    });

    const file = req.file as TFile;
    if (file) {
      const uploadResult = await uploadToCloud(file);
      req.body.profilePhoto = uploadResult?.secure_url;
    }
    const updateData = { ...req.body };
    let profile;
    switch (userData.role) {
      case UserRole.SUPER_ADMIN:
        profile = await prisma.admin.update({
          where: { email: user.email },
          data: updateData,
        });
            break;
        
      case UserRole.ADMIN:
        profile = await prisma.admin.update({
          where: { email: user.email },
          data: updateData,
        });
        break;

      case UserRole.DOCTOR:
        profile = await prisma.doctor.update({
          where: { email: user.email },
          data: updateData,
        });
        break;

      case UserRole.PATIENT:
        profile = await prisma.patient.update({
          where: { email: user.email },
          data: updateData,
        });
        break;

      default:
        throw new Error("Unsupported user role");
    }
    return profile;
  };
}
