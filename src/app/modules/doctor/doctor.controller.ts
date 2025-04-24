import catchAsync from "../../../utilities/catchAsync";
import pick from "../../../utilities/pick";
import sendResponse from "../../../utilities/sendResponse";
import { doctorFilterOptions, doctorPaginationOption } from "./doctor.constant";
import { DoctorService } from "./doctor.service";

export class DoctorController {
  static getAllDoctors = catchAsync(async (req, res) => {
    // ? to ignore the filters that are not in the adminFilterOptions array
      const filters = pick(req.query, doctorFilterOptions)
          ;
    // ? to add the pagination options to the filters
    const options = pick(req.query, doctorPaginationOption);

    const result = await DoctorService.getAllDoctors(filters, options);
    sendResponse(
      res,
      200,
      true,
      "Doctor fetched Successfully",
      result.meta,
      result.data
    );
  });

  static getSingleDoctor = catchAsync(async (req, res) => {
    const result = await DoctorService.getSingleDoctor(req.params.id);
    sendResponse(
      res,
      200,
      true,
      "Doctor fetched Successfully",
      undefined,
      result
    );
  });

  static updateDoctor = catchAsync(async (req, res) => {
    const result = await DoctorService.updateDoctor(req.params.id, req.body);
    sendResponse(
      res,
      200,
      true,
      "Doctor updated Successfully",
      undefined,
      result
    );
  });

  static deleteDoctor = catchAsync(async (req, res) => {
    const result = await DoctorService.deleteDoctor(req.params.id);
    sendResponse(
      res,
      200,
      true,
      "Doctor deleted Successfully",
      undefined,
      result
    );
  });
}
