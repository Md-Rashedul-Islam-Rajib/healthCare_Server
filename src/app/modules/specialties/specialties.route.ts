import { NextFunction, Request, Response, Router } from "express";
import { SpecialtiesController } from "./specialties.controller";
import upload from "../../middlewares/multer";
import { specialtiesCreationSchema } from "./specialties.validation";

const SpecialtiesRoutes: Router = Router();
SpecialtiesRoutes.post("/",upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = specialtiesCreationSchema.parse(JSON.parse(req.body.data));
        return SpecialtiesController.createSpecialties(req, res, next);
    })

SpecialtiesRoutes.get("/", SpecialtiesController.getAllSpecialties)
    SpecialtiesRoutes.delete("/:id",SpecialtiesController.deleteSpecialties)
export default SpecialtiesRoutes;