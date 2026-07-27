import transporter from "../config/mail.config";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({
  to,
  subject,
  html,
}: SendMailOptions) => {
  try {
    const result = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("Mail sent:", result.messageId);

    return result;
  } catch (error) {
    console.error("Send Mail Error:", error);

    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }

    throw error; // controller me error handle hoga
  }
};