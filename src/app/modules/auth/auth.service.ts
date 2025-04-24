import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { TLoginUser } from "./auth.types";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { createToken } from "./auth.utilites";
import config from "../../config";
import { ClassifiedError } from "../../errors/Error";
import { sendMail } from "../../../utilities/sendMail";

const prisma = new PrismaClient();
export class AuthServices {
  static async loginUser(payload: TLoginUser) {
    const userData = await prisma.user.findUniqueOrThrow({
      where: { email: payload.email, status: "ACTIVE" },
    });
    const isPasswordMatch = await bcrypt.compare(
      payload.password,
      userData.password
    );
    console.log(isPasswordMatch);
    //   if (!isPasswordMatch) {
    //       throw new Error("password is not correct");
    // }
    const accessToken = createToken(
      {
        email: userData.email,
        role: userData.role,
      },
      config.jwt.jwt_secret as string,
      config.jwt.expires_in as string
    );

    const refreshToken = createToken(
      {
        email: userData.email,
        role: userData.role,
      },
      config.jwt.jwt_refresh as string,
      config.jwt.expires_in_refresh as string
    );
    //   const accessToken = jwt.sign({
    //       email: userData.email,
    //       role: userData.role
    //   }, "asdfghjkl", {
    //       algorithm: "HS512",
    //       expiresIn: "15m"
    //   })
    //   const refreshToken = jwt.sign({
    //         email: userData.email,
    //         role: userData.role
    //     }, "asdfghjkl", {
    //         algorithm: "HS512",
    //         expiresIn: "30d"
    //   })

    return {
      needPasswordChange: userData.needPasswordChange,
      accessToken,
      refreshToken,
    };
  }

  static refreshToken = async (token: string) => {
    const decodedData = jwt.verify(token, "asdfghjkl") as JwtPayload;
    if (!decodedData) {
      throw new Error("you are not authorised");
    }
    const userData = await prisma.user.findUniqueOrThrow({
      where: { email: decodedData?.email },
    });
    const accessToken = createToken(
      {
        email: userData.email,
        role: userData.role,
      },
      "asdfghjkl",
      "15m"
    );
    return {
      needPasswordChange: userData.needPasswordChange,
      accessToken,
      refreshToken: token,
    };
  };

  static changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        email: user.email,
        status: "ACTIVE",
      },
    });

    const isPasswordMatch = await bcrypt.compare(
      payload.oldPassword,
      userData.password
    );
    if (!isPasswordMatch) {
      throw new ClassifiedError("Password incorrect", 400);
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: hashedPassword,
        needPasswordChange: false,
      },
    });
    return {
      message: "password changed successfully",
    };
  };

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
        status: "ACTIVE",
      },
    });

    const resetPasswordToken = createToken(
      { email: user.email, role: user.role },
      config.jwt.reset_secret as string,
      config.jwt.expires_in_reset as string
    );

    const resetPasswordLink = `${config.reset_password_link}?email=${user.email}&token=${resetPasswordToken}`;


   const htmlContent = `
    <p>Hello ,</p>
    <p>You requested to reset your password. Click the link below to proceed:</p>
    <a href="${resetPasswordLink}" target="_blank">Reset Password</a>
    <p>This link will expire in ${config.jwt.expires_in_reset}.</p>
  `;

   await sendMail({
     to: user.email,
     subject: "Password Reset Request",
     html: htmlContent,
   });

   return {
     message: "Password reset email sent successfully.",
   };
  }

  static resetPassword = async (email: string, token: string, password: string)=>{
    const user = prisma.user.findUniqueOrThrow({
      where: {
        email,
        status:"ACTIVE"
      }
    })

    const isTokenValid = jwt.verify(token, config.jwt.jwt_secret as Secret)
    if (!isTokenValid) {
      throw new ClassifiedError("token is not valid",403)
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
        needPasswordChange:false
      }
    })
  }


}
