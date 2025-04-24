import catchAsync from "../../../utilities/catchAsync";
import sendResponse from "../../../utilities/sendResponse";
import { AuthServices } from "./auth.service";

export class AuthController {
    static loginUser = catchAsync(async (req, res) => {
        const result = await AuthServices.loginUser(req.body);
        const { refreshToken,accessToken } = result;
        res.cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly:true
        })
        res.cookie("accessToken", accessToken, {
            secure: false,
            httpOnly:true
        })
        const data =  {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        }
        sendResponse(res, 200, true, "User login successfully", undefined, data)
    })

    static refreshToken = catchAsync(async (req, res) => {
        const result = await AuthServices.refreshToken(req.cookies.refreshToken);
        sendResponse(res,200,true,"accessToken generated successfully",undefined, result)
})

    
    static changePassword = catchAsync(async (req, res) => {
        const result = await AuthServices.changePassword(req.user,req.body)
        sendResponse(res,200,true,"password changed successfully",undefined,result)
    })

    static forgotPassword = catchAsync(async (req,res)=> {
        const result = await AuthServices.forgotPassword(req.body.email);
        sendResponse(res,200,true,"password reset link sent successfully",undefined,result)
    })


    static resetPassword = catchAsync(async (req, res) => {
        const token = req.headers.authorization || "";
        await AuthServices.resetPassword(req.body.email, token, req.body.password);
        sendResponse(res,200,true,"password reset successfully",undefined,undefined)
    })
}