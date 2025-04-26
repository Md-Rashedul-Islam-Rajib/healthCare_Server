import { PatientController } from './patient.controller';
import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from '../../middlewares/auth';

const PatientRoute: Router = Router();
PatientRoute.get("/", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientController.getAllPatients);
PatientRoute.get("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientController.getSinglePatient);
PatientRoute.put("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientController.updatePatient);
PatientRoute.delete("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),PatientController.deletePatient);
export default PatientRoute;