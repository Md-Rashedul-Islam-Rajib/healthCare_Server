import { Router } from "express";
import UserRouter from "../modules/user/user.route";
import AdminRouter from "../modules/admin/admin.route";
import AuthRouter from "../modules/auth/auth.route";
import SpecialtiesRoutes from "../modules/specialties/specialties.route";
import DoctorRoutes from "../modules/doctor/doctor.route";

const router: Router = Router();

const allRoutes = [
  {
    path: '/user',
    route: UserRouter,
    },
    {
        path: '/admin',
        route: AdminRouter
  }, {
      path: "/doctor",
    route: DoctorRoutes
  },
  {
    path: '/auth',
    route: AuthRouter
  },
  {
    path:'/specialties',
    route: SpecialtiesRoutes
  }
  
];

allRoutes.forEach((singleRoute) =>
  router.use(singleRoute.path!, singleRoute.route!),
);

export default router;