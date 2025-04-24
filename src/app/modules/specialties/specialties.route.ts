import { NextFunction, Request, Response, Router } from "express";
import { SpecialtiesController } from "./specialties.controller";
import upload from "../../middlewares/multer";

const SpecialtiesRoutes: Router = Router();
SpecialtiesRoutes.post("/",upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        return SpecialtiesController.createSpecialties(req, res, next);
    })

export default SpecialtiesRoutes;