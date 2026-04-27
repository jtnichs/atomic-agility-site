import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RegistrationConfirmationParams {
  to: string;
  firstName: string;
  lastName: string;
  courseTitle: string;
  startDate: string;
  endDate: string;
  amountPaid: number;
  registrationId: string;
}

export async function sendRegistrationConfirmation({
  to,
  firstName,
  courseTitle,
  startDate,
  endDate,
  amountPaid,
  registrationId,
}: RegistrationConfirmationParams) {
  const html = `
<div style="background-color:#000E22; padding:40px 20px; font-family:Arial,sans-serif;">

  <div style="max-width:600px; margin:0 auto; background-color:#00234B; border-radius:12px; overflow:hidden;">

    <!-- Header -->
    <div style="background-color:#000E22; padding:32px; text-align:center; border-bottom:2px solid #00487B;">
      <h1 style="color:#00A5F0; font-size:28px; margin:0;">Atomic Agility</h1>
      <p style="color:#94a3b8; margin:8px 0 0;">Start small. React rapidly.</p>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px;">

      <!-- Greeting -->
      <h2 style="color:#ffffff; font-size:24px; margin:0 0 8px;">You're Registered! 🎉</h2>
      <p style="color:#94a3b8; font-size:16px; margin:0 0 32px;">Hi ${firstName}, your registration is confirmed. Here are your details:</p>

      <!-- Course details box -->
      <div style="background-color:#000E22; border:1px solid #00487B; border-radius:8px; padding:24px; margin-bottom:32px;">
        <h3 style="color:#00A5F0; font-size:18px; margin:0 0 16px;">${courseTitle}</h3>
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="color:#94a3b8; font-size:14px; padding:6px 0; width:40%;">Dates</td>
            <td style="color:#ffffff; font-size:14px; padding:6px 0;">${startDate} – ${endDate}</td>
          </tr>
          <tr>
            <td style="color:#94a3b8; font-size:14px; padding:6px 0;">Time</td>
            <td style="color:#ffffff; font-size:14px; padding:6px 0;">9:00 AM – 5:00 PM ET (both days)</td>
          </tr>
          <tr>
            <td style="color:#94a3b8; font-size:14px; padding:6px 0;">Format</td>
            <td style="color:#ffffff; font-size:14px; padding:6px 0;">Virtual (Zoom)</td>
          </tr>
          <tr>
            <td style="color:#94a3b8; font-size:14px; padding:6px 0;">Amount Paid</td>
            <td style="color:#ffffff; font-size:14px; padding:6px 0;">$${amountPaid.toLocaleString("en-US")}</td>
          </tr>
          <tr>
            <td style="color:#94a3b8; font-size:14px; padding:6px 0;">Registration ID</td>
            <td style="color:#94a3b8; font-size:12px; padding:6px 0;">${registrationId}</td>
          </tr>
        </table>
      </div>

      <!-- What's included -->
      <h3 style="color:#ffffff; font-size:16px; margin:0 0 16px;">What's Included:</h3>
      <ul style="color:#94a3b8; font-size:14px; line-height:1.8; margin:0 0 32px; padding-left:20px;">
        <li>SAFe certification exam registration</li>
        <li>Pre-class AI-powered context questionnaire</li>
        <li>Two post-class office hours sessions</li>
        <li>AI Integration Toolkit</li>
        <li>30 days post-class implementation coaching</li>
      </ul>

      <!-- What's next -->
      <div style="background-color:#000E22; border-left:3px solid #00A5F0; padding:20px 24px; margin-bottom:32px; border-radius:0 8px 8px 0;">
        <h3 style="color:#00A5F0; font-size:16px; margin:0 0 8px;">What Happens Next</h3>
        <p style="color:#94a3b8; font-size:14px; margin:0; line-height:1.6;">You'll receive your Zoom link and pre-class materials 48 hours before class starts. Keep an eye on your inbox at ${to}.</p>
      </div>

      <!-- Refund policy -->
      <p style="color:#94a3b8; font-size:12px; margin:0 0 24px; line-height:1.6;">
        <strong style="color:#ffffff;">Refund Policy:</strong> Full refund if cancelled 7 or more days before class start. No refund within 7 days, but you may transfer your registration to a future cohort.
      </p>

      <!-- Questions -->
      <p style="color:#94a3b8; font-size:14px; margin:0;">Questions? Reply to this email or contact us at <a href="mailto:john@atomicagility.us" style="color:#00A5F0;">john@atomicagility.us</a></p>

    </div>

    <!-- Footer -->
    <div style="background-color:#000E22; padding:24px 32px; text-align:center; border-top:1px solid #00487B;">
      <p style="color:#94a3b8; font-size:12px; margin:0;">© 2026 Atomic Agility LLC. All rights reserved.</p>
      <p style="color:#94a3b8; font-size:12px; margin:8px 0 0;">Washington, D.C. Metro Area</p>
    </div>

  </div>
</div>
`;

  return resend.emails.send({
    from: "Atomic Agility <john@atomicagility.us>",
    to,
    subject: `You're registered! ${courseTitle} — ${startDate}`,
    html,
  });
}
