import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import upload from "../../middlewares/multer";
import {
  adminCreationSchema,
  doctorCreationSchema,
  patientCreationSchema,
} from "./user.validation";

const UserRouter: Router = Router();

UserRouter.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getAllUsers
);
UserRouter.get(
  "/me",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  UserController.getMyProfile
);
UserRouter.put(
  "/update-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.updateMyProfile(req, res, next);
  }
  
);

UserRouter.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = adminCreationSchema.parse(JSON.parse(req.body.data));

    return UserController.createAdmin(req, res, next);
  }
);
UserRouter.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = doctorCreationSchema.parse(JSON.parse(req.body.data));

    return UserController.createDoctor(req, res, next);
  }
);

UserRouter.post(
  "/create-patient",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = patientCreationSchema.parse(JSON.parse(req.body.data));

    return UserController.createPatient(req, res, next);
  }
);

UserRouter.put(
  "/change-status/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.changeUserStatus
);

export default UserRouter;
