import nodemailer from "nodemailer";
import { activateEmailTemplate } from "../emails/activateEmailTemplate";

const {
  EMAIL_USER,
  EMAIL_PASS,
} = process.env;

const senderEmail = EMAIL_USER;

export const sendEmail = async (to, url, txt, subject, template) => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "Email configuration is missing. Set EMAIL_USER and EMAIL_PASS for Gmail App Password."
    );
  }

  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  // Use custom template if provided, otherwise use default activation template
  const htmlContent = template || activateEmailTemplate(to, url);

  const mailOptions = {
    from: senderEmail,
    to,
    subject,
    html: htmlContent,
  };

  return smtpTransport.sendMail(mailOptions).catch((error) => {
    console.error("Error sending email:", error);
    throw error;
  });
};
