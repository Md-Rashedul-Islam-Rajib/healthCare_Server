import { PrismaClient } from "@prisma/client";
import { paginationBuilder } from "../../../utilities/paginationbuilder";
import { patientFilters } from "./patient.utilities";

const prisma = new PrismaClient();
export class PatientService {
    static getAllPatients = async (params?: any, options?: any) => {
        const { limit, page, skip } = paginationBuilder(options);
        const filterOptions = patientFilters(params);
        const result = await prisma.patient.findMany({
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
            include: {
                patientHealthData: true,
                medicalReport: true
            }
        })

        const totalCount = await prisma.patient.count({
            where:filterOptions
        })
        return {
            meta: {
                page: page || 1,
                limit: limit || 10,
                total: totalCount
            },
            data: result
        }
    }

    static getSinglePatient = async (id: string) => {
        const result = await prisma.patient.findUnique({
            where: { id, isDeleted: false },
            include: {
                patientHealthData: true,
                medicalReport:true
            }
        })
        return result;
    }

    static updatePatient = async (id: string, payload: any) => {
        const { PatientHealthData, medicalReport, ...rest } = payload;
        const patientInfo = await prisma.patient.findUniqueOrThrow({
            where: {id}
        })

        await prisma.$transaction(async (tra) => {
            const patientUpdatedData = await tra.patient.update({
                where: {id,isDeleted:false},
                data: rest,
                include: {
                    patientHealthData: true,
                    medicalReport:true
                }
            })

            if (PatientHealthData) {
            await tra.patientHealthData.upsert({
                where: { patientId: patientInfo.id },
                update: PatientHealthData,
                create: {...PatientHealthData, patientId: patientInfo.id}
            })    
            }

            if (medicalReport) {
                await tra.medicalReport.create({
                    data: {...medicalReport,patientId: patientInfo.id}})
            }
            
        })
        const result = await prisma.patient.findUnique({
            where: { id },
            include: {
                patientHealthData: true,
                medicalReport:true
            }
        })
        return result;

    }

    static deletePatient = async (id: string) => {
        const result = await prisma.$transaction(async (tra) => {
           // ! use these for hard delete 
            // await tra.medicalReport.deleteMany({
            //     where: {patientId: id}
            // })

            // await tra.patientHealthData.delete({
            //     where: {patientId:id}
            // })
            
            const patientDeletedData = await tra.patient.update({
                where: { id, isDeleted: false },
                data:{isDeleted:true}
            })
            
            await tra.user.update({
                where: { email: patientDeletedData.email },
                data: {status:"DELETED"}
            })
            return patientDeletedData;
        })
        return result;
        
    }
}