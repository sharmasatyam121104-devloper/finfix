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
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
    });
};