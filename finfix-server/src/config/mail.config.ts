import nodemailer from "nodemailer";
import "dotenv/config";

console.log({
  user: process.env.SMTP_USER,
  passExists: !!process.env.SMTP_PASS,
});

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


export default transporter;