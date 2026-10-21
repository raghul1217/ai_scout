import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";

export const razorpayClient = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_secret",
});

export async function createOrderForPlan(planId: string, userId: string) {
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan || !plan.isActive) {
    throw new Error("Invalid or inactive plan selected.");
  }

  if (plan.price === 0) {
    throw new Error("Free plan does not require a payment transaction.");
  }

  const receiptNumber = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Create Razorpay Order
  const order = await razorpayClient.orders.create({
    amount: plan.price, // Amount in paise
    currency: plan.currency || "INR",
    receipt: receiptNumber,
    notes: {
      userId,
      planId: plan.id,
      planName: plan.name,
    },
  });

  // Store pending payment in database
  const payment = await prisma.payment.create({
    data: {
      userId,
      planId: plan.id,
      razorpayOrderId: order.id,
      amount: plan.price,
      currency: plan.currency || "INR",
      status: "PENDING",
      receiptNumber,
      rawPayload: order as any,
    },
  });

  return {
    orderId: order.id,
    amount: plan.price,
    currency: plan.currency || "INR",
    planName: plan.name,
    paymentId: payment.id,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "",
  };
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.error("RAZORPAY_KEY_SECRET is not configured.");
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch (err) {
    return false;
  }
}

export function verifyWebhookSignature(
  payloadString: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const generated = crypto
    .createHmac("sha256", secret)
    .update(payloadString)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generated, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch (err) {
    return false;
  }
}
