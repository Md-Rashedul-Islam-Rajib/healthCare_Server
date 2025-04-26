import catchAsync from "../../../utilities/catchAsync";
import pick from "../../../utilities/pick";
import sendResponse from "../../../utilities/sendResponse";
import { patientFilterOptions, patientPaginationOption } from "./patient.constants";
import { PatientService } from "./patient.service";


export class PatientController {
  static getAllPatients = catchAsync(async (req, res) => {
    // ? to ignore the filters that are not in the PatientFilterOptions array
    const filters = pick(req.query, patientFilterOptions);
    // ? to add the pagination options to the filters
    const options = pick(req.query, patientPaginationOption);

    const result = await PatientService.getAllPatients(filters, options);
    sendResponse(
      res,
      200,
      true,
      "Patient fetched Successfully",
      result.meta,
      result.data
    );
  });

  static getSinglePatient = catchAsync(async (req, res) => {
    const result = await PatientService.getSinglePatient(req.params.id);
    sendResponse(
      res,
      200,
      true,
      "Patient fetched Successfully",
      undefined,
      result
    );
  });

  static updatePatient = catchAsync(async (req, res) => {
    const result = await PatientService.updatePatient(req.params.id, req.body);
    sendResponse(
      res,
      200,
      true,
      "Patient updated Successfully",
      undefined,
      result
    );
  });

  static deletePatient = catchAsync(async (req, res) => {
    const result = await PatientService.deletePatient(req.params.id);
    sendResponse(
      res,
      200,
      true,
      "Patient deleted Successfully",
      undefined,
      result
    );
  });
}
