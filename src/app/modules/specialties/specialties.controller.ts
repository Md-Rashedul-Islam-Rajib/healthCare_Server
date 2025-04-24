import catchAsync from "../../../utilities/catchAsync";
import sendResponse from "../../../utilities/sendResponse";
import { SpecialtiesService } from "./specialties.service";

export class SpecialtiesController {
    static createSpecialties = catchAsync(async (req, res) => {
        const result = await SpecialtiesService.createSpecialties(req);
        sendResponse(res,200,true,"Specialties created successfully",undefined,result)
    })
    static getAllSpecialties = catchAsync(async (req, res) => {
        const result = await SpecialtiesService.getAllSpecialties();
        sendResponse(res, 200, true, "Specialties fetched successfully", undefined, result)
    })

    static deleteSpecialties = catchAsync(async (req, res) => {
        const result = await SpecialtiesService.deleteSpecialties(req.params.id)
        sendResponse(res,200,true,"Specialties deleted successfully",undefined,result)
    })
}