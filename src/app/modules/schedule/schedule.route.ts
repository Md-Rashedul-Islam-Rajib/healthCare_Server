import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const ScheduleRoutes: Router = Router();

ScheduleRoutes.get('/',auth(UserRole.ADMIN,UserRole.DOCTOR,UserRole.SUPER_ADMIN),ScheduleController.getAllSchedules)
ScheduleRoutes.post('/',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),ScheduleController.createSchedule)
ScheduleRoutes.get('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), ScheduleController.getSingleSchedule)
ScheduleRoutes.delete('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), ScheduleController.deleteSchedule)
export default ScheduleRoutes;