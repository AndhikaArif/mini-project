import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to,
    subject,
    html,
  });

  if (result.error) {
    console.error("EMAIL_FAILED", result.error);
  } else {
    console.log("EMAIL_SENT", result.data.id);
  }

  return result;
}
