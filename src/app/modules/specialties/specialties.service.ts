import { PrismaClient } from "@prisma/client";
import { uploadToCloud } from "../../middlewares/multer";
import { TFile } from "../../types/file";

const prisma = new PrismaClient();
export class SpecialtiesService {
    static async createSpecialties(req: any) {
        const file: TFile = req.file;
        if (file) {
          const uploadResult = await uploadToCloud(file);
    
          req.body.icon = uploadResult.secure_url as string;
        }
        const result = await prisma.specialties.create({
            data: req.body
        })
        
    
        return result;
      }

  static async getAllSpecialties() {
    const result = await prisma.specialties.findMany();
    return result;
      }

  static async deleteSpecialties(id: string) {
    const result = await prisma.specialties.delete({
      where: {id}
    })
    return result;
  }
}