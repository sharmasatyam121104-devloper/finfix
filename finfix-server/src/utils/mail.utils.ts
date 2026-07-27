import "dotenv/config";

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
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "DevSync", // Apne app ka naam
        email: process.env.BREVO_EMAIL!, // Verified sender email
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Brevo Error:", data);
    throw new Error(data.message || "Failed to send email");
  }

  return data;
};