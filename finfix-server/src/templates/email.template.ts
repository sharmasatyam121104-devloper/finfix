const appName = "FinFix";

const emailLayout = (
    title: string,
    heading: string,
    message: string,
    otp: string
) => {
    return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>${title}</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;margin:40px auto;border-radius:10px;overflow:hidden">

<tr>
<td style="background:#2563eb;padding:25px;text-align:center">
<h1 style="color:white;margin:0">${appName}</h1>
</td>
</tr>

<tr>
<td style="padding:40px">

<h2 style="margin-top:0;color:#222">
${heading}
</h2>

<p style="color:#555;font-size:16px;line-height:24px">
${message}
</p>

<div
style="
margin:35px 0;
background:#f3f4f6;
padding:18px;
text-align:center;
border-radius:8px">

<h1
style="
margin:0;
letter-spacing:8px;
font-size:34px;
color:#2563eb">

${otp}

</h1>

</div>

<p style="color:#666">
This OTP will expire in <strong>10 minutes</strong>.
</p>

<p style="color:#666">
If you didn't request this email, please ignore it.
</p>

</td>
</tr>

<tr>
<td
style="
padding:20px;
background:#fafafa;
text-align:center;
font-size:13px;
color:#999">

© ${new Date().getFullYear()} ${appName}. All rights reserved.

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

export const verifyAccountTemplate = (otp: string) =>
    emailLayout(
        "Verify Your Account",
        "Verify Your Email",
        "Welcome to FinFix. Please use the OTP below to verify your account.",
        otp
    );

export const forgotPasswordTemplate = (otp: string) =>
    emailLayout(
        "Reset Password",
        "Reset Your Password",
        "Use the OTP below to reset your password.",
        otp
    );