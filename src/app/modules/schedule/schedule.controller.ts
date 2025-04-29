import catchAsync from "../../../utilities/catchAsync";
import pick from "../../../utilities/pick";
import sendResponse from "../../../utilities/sendResponse";
import { scheduleFilterOptions, SchedulePaginationOption } from "./schedule.constants";
import { ScheduleService } from "./schedule.service";

export class ScheduleController {

    static getAllSchedules = catchAsync(async (req, res) => {
        const filters = pick(req.query, scheduleFilterOptions);
        const options = pick(req.query, SchedulePaginationOption);
        const result = await ScheduleService.getAllSchedules(req.user,filters, options);
        sendResponse(res,200,true,"schedules fetched successfully",result.meta,result.data)
    })

    static createSchedule = catchAsync(async (req, res) => {
        const result = await ScheduleService.createSchedule(req.body);
        sendResponse(res,200,true,"Schedule created successfully",undefined,result)
    })

    static getSingleSchedule = catchAsync(async (req, res) => {
        const result = await ScheduleService.getSingleSchedule(req.params.id);
        sendResponse(res,200,true,"Schedule fetched successfully",undefined,result)
    })

    static deleteSchedule = catchAsync(async (req, res) => {
        const result = await ScheduleService.deleteSchedule(req.params.id);
        sendResponse(res,200,true,"Schedule deleted successfully",undefined,result)
    })
}