import catchAsync from "../../../utilities/catchAsync";
import sendResponse from "../../../utilities/sendResponse";
import { SpecialtiesService } from "./specialties.service";

export class SpecialtiesController {
    static createSpecialties = catchAsync(async (req, res) => {
        const result = await SpecialtiesService.createSpecialties(req);
        sendResponse(res,200,true,"Specialties created successfully",undefined,result)
    })
}