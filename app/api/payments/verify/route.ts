import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { verifyPaymentSignature } from "@/lib/payments/razorpay";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      verifySchema.parse(body);

    // 1. Verify signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed. Invalid cryptographic signature." },
        { status: 400 }
      );
    }

    // 2. Locate payment record in database
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: { plan: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment order record not found." },
        { status: 404 }
      );
    }

    if (payment.userId !== user.id) {
      return NextResponse.json(
        { error: "Payment order does not belong to the authenticated user." },
        { status: 403 }
      );
    }

    // 3. Calculate membership dates
    const startDate = new Date();
    let endDate: Date | null = null;
    if (payment.plan.durationDays) {
      endDate = new Date(startDate.getTime() + payment.plan.durationDays * 24 * 60 * 60 * 1000);
    }

    // 4. Update payment and create membership in a transaction
    const [updatedPayment, membership] = await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "CAPTURED",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      }),
      prisma.membership.create({
        data: {
          userId: user.id,
          planId: payment.planId,
          status: "ACTIVE",
          startDate,
          endDate,
        },
      }),
      prisma.notificationOutbox.create({
        data: {
          userId: user.id,
          channel: "EMAIL",
          recipient: user.email,
          subject: `Welcome to ${payment.plan.name} — AI Scout`,
          template: "payment_confirmation",
          payload: {
            userName: user.name,
            planName: payment.plan.name,
            amount: (payment.amount / 100).toFixed(2),
            currency: payment.currency,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
          },
          status: "PENDING",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      membershipId: membership.id,
      planName: payment.plan.name,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal payment verification error." },
      { status: 500 }
    );
  }
}
