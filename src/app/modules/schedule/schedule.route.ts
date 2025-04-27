import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const ScheduleRoutes: Router = Router();
ScheduleRoutes.post('/',ScheduleController.createSchedule)

export default ScheduleRoutes;