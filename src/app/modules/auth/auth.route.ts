import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const AuthRouter: Router = Router();
AuthRouter.post("/login", AuthController.loginUser);
AuthRouter.post("/refresh-token", AuthController.refreshToken);
AuthRouter.post(
  "/change-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  AuthController.changePassword
);
AuthRouter.post(
  "/forgot-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  AuthController.forgotPassword
);

AuthRouter.post(
  "/reset-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  AuthController.resetPassword
);
export default AuthRouter;
