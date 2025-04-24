import { Resend } from "resend";
import config from "../app/config";

const resend = new Resend(config.resend_api); 
console.log(config.resend_api,"config.resend_api")

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const data = await resend.emails.send({
      from: "From an App <rajj1541@gmail.com>", // Use a verified sender
      to,
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
