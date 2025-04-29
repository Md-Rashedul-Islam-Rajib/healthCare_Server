import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./DS.controller";

const DoctorScheduleRoutes: Router = Router();
DoctorScheduleRoutes.get("/get-mySchedules", auth(UserRole.DOCTOR), DoctorScheduleController.getMySchedules);
DoctorScheduleRoutes.post("/",auth(UserRole.DOCTOR),DoctorScheduleController.createDoctorSchedule)
DoctorScheduleRoutes.delete("/:id",auth(UserRole.DOCTOR),DoctorScheduleController.deleteDoctorSchedule)

export default DoctorScheduleRoutes;