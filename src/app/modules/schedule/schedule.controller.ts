import catchAsync from "../../../utilities/catchAsync";
import sendResponse from "../../../utilities/sendResponse";
import { ScheduleService } from "./schedule.service";

export class ScheduleController {
    static createSchedule = catchAsync(async (req, res) => {
        const result = await ScheduleService.createSchedule(req.body);
        sendResponse(res,200,true,"Schedule created successfully",undefined,result)
    })
}