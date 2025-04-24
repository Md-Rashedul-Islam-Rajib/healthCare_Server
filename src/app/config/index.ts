import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRATION,
    jwt_refresh: process.env.JWT_REFRESH,
    expires_in_refresh: process.env.JWT_REFRESH_EXPIRATION,
    reset_secret: process.env.RESET_PASSWORD_SECRET,
    expires_in_reset: process.env.RESET_PASSWORD_EXPIRATION,
  },
    reset_password_link: process.env.RESET_PASSWORD_LINK,
  resend_api: process.env.RESEND_API_KEY
};