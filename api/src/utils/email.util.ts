export async function sendResetPasswordEmail(email: string, token: string) {
  const link = `${process.env.FRONTEND_URL}/reset-password/confirm?token=${token}`;

  console.log("SEND EMAIL TO:", email);
  console.log("RESET LINK:", link);

  // nanti ganti nodemailer / resend
}
