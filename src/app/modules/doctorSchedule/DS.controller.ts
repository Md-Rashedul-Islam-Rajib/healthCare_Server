import catchAsync from "../../../utilities/catchAsync";
import pick from "../../../utilities/pick";
import sendResponse from "../../../utilities/sendResponse";
import { doctorScheduleFilterOptions, doctorSchedulePaginationOption } from "./DS.constants";
import { DoctorScheduleService } from "./DS.service";

export class DoctorScheduleController {
  static getMySchedules = catchAsync(async (req, res) => {
    const filters = pick(req.query, doctorScheduleFilterOptions);
    const options = pick(req.query, doctorSchedulePaginationOption);
    const result = await DoctorScheduleService.getMySchedules(
      
      filters,
      options
    );
    sendResponse(
      res,
      200,
      true,
      "schedules fetched successfully",
      result.meta,
      result.data
    );
  });



  static createDoctorSchedule = catchAsync(async (req, res) => {
    const result = await DoctorScheduleService.createDoctorSchedule(
      req.user,
      req.body
    );
    sendResponse(
      res,
      200,
      true,
      "Doctor schedule created successfully",
      undefined,
      result
    );
  });

  static deleteDoctorSchedule = catchAsync(async (req, res) => {
    const result = await DoctorScheduleService.deleteDoctorSchedule(req.user, req.params.id);
    sendResponse(res,200,true,"Doctor schedule deleted successfully",undefined,result)
})

}