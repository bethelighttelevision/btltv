import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const from = process.env.FROM_EMAIL || "noreply@btl-tv.com";
  await transporter.sendMail({
    from: `"BTL Bible School" <${from}>`,
    to: email,
    subject: "Reset Your BTL Bible School Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0f0f0f; color: #e5e5e5; border-radius: 12px; border: 1px solid #222;">
        <h2 style="color: #fff; margin-bottom: 16px;">BTL Bible School</h2>
        <p>You requested a password reset. Click the button below to set a new password.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background: #dc2626; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        <p style="color: #888; font-size: 13px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}
