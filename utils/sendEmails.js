import nodemailer from "nodemailer";
import { activateEmailTemplate } from "../emails/activateEmailTemplate";

export const sendEmail = async (to, url, txt, subject, template) => {
  const host = process.env.SMTP_HOST || "smtp-relay.brevo.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const senderEmail = process.env.EMAIL_FROM || user;

  if (!user || !pass) {
    throw new Error(
      "Email configuration is missing. Set SMTP_USER and SMTP_PASS (Brevo) or EMAIL_USER and EMAIL_PASS (Gmail)."
    );
  }

  // Nếu có SMTP_PASS (Brevo/Custom SMTP) thì dùng SMTP Transport, ngược lại fallback Gmail
  const isBrevoOrCustom = Boolean(process.env.SMTP_PASS || process.env.SMTP_HOST);

  const smtpTransport = nodemailer.createTransport(
    isBrevoOrCustom
      ? {
          host,
          port,
          secure: port === 465,
          auth: {
            user,
            pass,
          },
        }
      : {
          service: "gmail",
          auth: {
            user,
            pass,
          },
        }
  );

  // Use custom template if provided, otherwise use default activation template
  const htmlContent = template || activateEmailTemplate(to, url);

  const mailOptions = {
    from: `"BT Academy" <${senderEmail}>`,
    to,
    subject,
    html: htmlContent,
  };

  return smtpTransport.sendMail(mailOptions).catch((error) => {
    console.error("Error sending email:", error);
    throw error;
  });
};
