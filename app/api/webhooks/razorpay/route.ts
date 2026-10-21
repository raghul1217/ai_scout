import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    if (eventType === "payment.captured") {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      // Find payment record
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId },
        include: { plan: true },
      });

      if (payment && payment.status !== "CAPTURED") {
        const startDate = new Date();
        let endDate: Date | null = null;
        if (payment.plan.durationDays) {
          endDate = new Date(startDate.getTime() + payment.plan.durationDays * 24 * 60 * 60 * 1000);
        }

        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "CAPTURED",
              razorpayPaymentId: paymentId,
            },
          }),
          prisma.membership.create({
            data: {
              userId: payment.userId,
              planId: payment.planId,
              status: "ACTIVE",
              startDate,
              endDate,
            },
          }),
        ]);
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;

      await prisma.payment.updateMany({
        where: { razorpayOrderId: orderId },
        data: { status: "FAILED" },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Razorpay webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
