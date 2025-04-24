import { Router } from "express";
import { AdminController } from "./admin.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const AdminRouter: Router = Router();

AdminRouter.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.getAllAdmin
);
AdminRouter.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.getSingleAdmin
);
AdminRouter.put("/:id",auth(UserRole.SUPER_ADMIN,UserRole.ADMIN), AdminController.updateAdmin);
AdminRouter.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.deleteAdmin
);
export default AdminRouter;