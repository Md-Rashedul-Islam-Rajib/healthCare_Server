import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const DoctorRoutes: Router = Router();

DoctorRoutes.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.getAllDoctors
);

DoctorRoutes.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.getSingleDoctor
);
DoctorRoutes.put(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.updateDoctor
);
DoctorRoutes.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.deleteDoctor
);
export default DoctorRoutes;
