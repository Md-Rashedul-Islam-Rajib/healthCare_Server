import catchAsync from "../../../utilities/catchAsync";
import pick from "../../../utilities/pick";
import sendResponse from "../../../utilities/sendResponse";
import { userFilterOptions, userPaginationOption } from "./user.constant";
import { UserService } from "./user.service";

export class UserController {
  static createAdmin = catchAsync(async (req, res) => {
    const result = await UserService.createAdmin(req);
    sendResponse(
      res,
      200,
      true,
      "Admin created Successfully",
      undefined,
      result
    );
  });
  static createDoctor = catchAsync(async (req, res) => {
    const result = await UserService.createDoctor(req);
    sendResponse(
      res,
      200,
      true,
      "Doctor created Successfully",
      undefined,
      result
    );
  });

  static createPatient = catchAsync(async (req, res) => {
    const result = await UserService.createPatient(req);
    sendResponse(
      res,
      200,
      true,
      "Patient created Successfully",
      undefined,
      result
    );
  });

   static getAllUsers = catchAsync(async (req, res) => {
        // ? to ignore the filters that are not in the adminFilterOptions array
       const filters = pick(req.query, userFilterOptions);
 
        // ? to add the pagination options to the filters
        const options = pick(req.query,userPaginationOption)

        const result = await UserService.getAllUsers(filters,options);
        sendResponse(res,200,true,"User(s) fetched Successfully",result.meta,result.data)
    })

    static changeUserStatus = catchAsync(async (req, res) => {
        const result = await UserService.changeUserStatus(req.params.id, req.body.status)
        sendResponse(res,200,true,`User status changed successfully to ${req.body.status}`,undefined,result)
    })

    static getMyProfile = catchAsync(async (req, res) => {
        const result = await UserService.getMyProfile(req.user);
        sendResponse(res,200,true,"My profile fetched successfully",undefined,result)
    })
    static updateMyProfile = catchAsync(async (req, res) => {
        const result = await UserService.updateMyProfile(req.user, req);
        sendResponse(res,200,true,"My profile updated successfully",undefined,result)
    })
}