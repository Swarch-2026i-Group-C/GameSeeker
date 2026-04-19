import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function processNotificationQueue(data: any) {
  const { email, name, message, gameName } = data;

  if (!email || !message) {
    console.warn(
      "[notification] Received incomplete payload, missing email or message:",
      data,
    );
    return;
  }

  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "GameSeeker Notificaciones <onboarding@resend.dev>",
        to: email,
        subject: `¡Descuento en tu wishlist: ${gameName}!`,
        html: `<p>Hola ${name},</p><p>${message}</p>`,
      });
    }

    console.log(`[notification] Processed notification for user ${email}`);
  } catch (err) {
    console.error(
      `[notification] Error processing notification for user ${email}:`,
      err,
    );
  }
}
