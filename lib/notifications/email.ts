import nodemailer, { type Transporter } from "nodemailer";
import { prisma } from "@/lib/db/prisma";

export async function processNotificationOutbox() {
  const pendingNotifications = await prisma.notificationOutbox.findMany({
    where: {
      status: "PENDING",
      channel: "EMAIL",
      retryCount: { lt: 3 },
    },
    take: 10,
  });

  if (pendingNotifications.length === 0) return { processed: 0 };

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const emailFrom = process.env.EMAIL_FROM || "AI Scout <hello@aiscout.in>";

  const isConfigured = Boolean(smtpHost && smtpUser && smtpPass);

  let transporter: Transporter | null = null;
  if (isConfigured) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  let successCount = 0;

  for (const notif of pendingNotifications) {
    try {
      if (transporter) {
        const payload: any = notif.payload || {};
        const info = await transporter.sendMail({
          from: emailFrom,
          to: notif.recipient,
          subject: notif.subject,
          text: `Hello ${payload.userName || "there"},\n\nThank you for joining ${payload.planName || "AI Scout"}! Your transaction (${payload.orderId || ""}) has been completed.\n\nBest regards,\nThe AI Scout Team`,
          html: `<div style="font-family: sans-serif; background: #050816; color: #f8fafc; padding: 24px; border-radius: 8px;">
            <h2 style="color: #9f67ff;">Welcome to ${payload.planName || "AI Scout"}</h2>
            <p>Hello ${payload.userName || "there"},</p>
            <p>Your membership has been confirmed. You now have unrestricted access to all member vaults and blueprints.</p>
            <p style="color: #a7b2cc; font-size: 12px;">Order ID: ${payload.orderId || ""}</p>
          </div>`,
        });

        await prisma.notificationOutbox.update({
          where: { id: notif.id },
          data: {
            status: "SENT",
            sentAt: new Date(),
          },
        });

        await prisma.notificationLog.create({
          data: {
            outboxId: notif.id,
            channel: "EMAIL",
            recipient: notif.recipient,
            status: "SENT",
            providerResponse: { messageId: info.messageId },
          },
        });
      } else {
        // Dev fallback simulation
        console.log(`[Notification Outbox Simulated] To: ${notif.recipient} | Subject: ${notif.subject}`);
        await prisma.notificationOutbox.update({
          where: { id: notif.id },
          data: {
            status: "SENT",
            sentAt: new Date(),
          },
        });
      }
      successCount++;
    } catch (err: any) {
      console.error(`Failed to dispatch notification ${notif.id}:`, err);
      await prisma.notificationOutbox.update({
        where: { id: notif.id },
        data: {
          retryCount: { increment: 1 },
          lastError: err?.message || "Send error",
          status: notif.retryCount >= 2 ? "FAILED" : "PENDING",
        },
      });
    }
  }

  return { processed: pendingNotifications.length, sent: successCount };
}
