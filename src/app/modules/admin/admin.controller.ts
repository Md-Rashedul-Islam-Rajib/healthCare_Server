import catchAsync from "../../../utilities/catchAsync";
import pick from "../../../utilities/pick";
import sendResponse from "../../../utilities/sendResponse";
import { adminFilterOptions, adminPaginationOption } from "./admin.constant";
import { AdminService } from "./admin.service";

export class AdminController {
    static getAllAdmin = catchAsync(async (req, res) => {
        // ? to ignore the filters that are not in the adminFilterOptions array
        const filters = pick(req.query, adminFilterOptions);
        // ? to add the pagination options to the filters
        const options = pick(req.query,adminPaginationOption)

        const result = await AdminService.getAllAdmin(filters,options);
        sendResponse(res,200,true,"Admin fetched Successfully",result.meta,result.data)
    })

    static getSingleAdmin = catchAsync(async (req, res) => {
        const result = await AdminService.getSingleAdmin(req.params.id);
        sendResponse(res,200,true,"Admin fetched Successfully",undefined,result)
    })

    static updateAdmin = catchAsync(async (req, res) => {
        const result = await AdminService.updateAdmin(req.params.id, req.body);
        sendResponse(res,200,true,"Admin updated Successfully",undefined,result)
    })

    static deleteAdmin = catchAsync(async (req, res) => {
        const result = await AdminService.deleteAdmin(req.params.id);
        sendResponse(res,200,true,"Admin deleted Successfully",undefined,result)
    })
}