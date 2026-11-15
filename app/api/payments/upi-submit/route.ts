import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { sendPaymentProofSubmittedEmails } from "@/lib/email/sender";
import { auth } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

const upiSubmitSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  utrNumber: z.string().min(6, "Valid 12-digit UTR or Transaction ID is required").max(50),
  screenshotBase64: z.string().optional(),
  planSlug: z.string().default("pro"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = upiSubmitSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues[0]?.message || "Invalid submission data";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, email, password, utrNumber, screenshotBase64, planSlug } = result.data;

    // 1. Check if user is already logged in or exists
    const loggedInUser = await getCurrentUser();
    let targetUserId = loggedInUser?.id;

    if (!targetUserId) {
      let existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!existingUser) {
        // Create user account via better-auth or direct prisma fallback
        if (password) {
          try {
            const authRes = await auth.api.signUpEmail({
              body: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password,
              },
            });
            targetUserId = authRes?.user?.id;
          } catch (signUpErr) {
            console.warn("[UPI Submit]: Better-auth signup notice, falling back to prisma:", signUpErr);
          }
        }

        if (!targetUserId) {
          const newUser = await prisma.user.create({
            data: {
              name: name.trim(),
              email: email.toLowerCase().trim(),
              role: "USER",
            },
          });
          targetUserId = newUser.id;
        }
      } else {
        targetUserId = existingUser.id;
      }
    }

    // 2. Fetch the SAVZYEN Premium Plan
    let plan = await prisma.plan.findUnique({
      where: { slug: planSlug },
    });

    if (!plan) {
      plan = await prisma.plan.findFirst({
        where: { slug: "pro" },
      });
    }

    if (!plan) {
      // Fallback create plan if missing
      plan = await prisma.plan.create({
        data: {
          name: "SAVZYEN Premium",
          slug: "pro",
          description: "Stay Ahead. Learn Faster. Build Smarter.",
          price: 49900,
          currency: "INR",
          billingType: "YEARLY",
          durationDays: 365,
          features: [
            "Daily AI News & Industry Updates",
            "Latest AI Tools & Feature Discoveries",
            "Practical AI Daily Challenges with Tutorials & Learning Resources",
            "Industry Insights & Weekly Reports",
            "Weekly AI Challenges",
            "Tech Events, Meetups & Conferences",
            "Exclusive Live Sessions with Founders & Experts",
            "Exclusive Learning & Career Opportunities",
            "GitHub News, Projects & Trending Repositories",
            "Build Real-Time AI Agents & Practical Modules",
          ],
        },
      });
    }

    // 3. Create the Payment Record with status PENDING
    const cleanUtr = utrNumber.trim();
    const orderRef = `UPI_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const payment = await prisma.payment.create({
      data: {
        userId: targetUserId,
        planId: plan.id,
        razorpayOrderId: orderRef,
        amount: plan.price || 49900,
        currency: "INR",
        status: "PENDING",
        receiptNumber: cleanUtr,
        rawPayload: {
          paymentMethod: "UPI_QR",
          payeeUpi: "prabhasreddy093-1@oksbi",
          payeeName: "Prabhas Reddy",
          utrNumber: cleanUtr,
          screenshotUrl: screenshotBase64 ? screenshotBase64.slice(0, 500) + "..." : null,
          hasFullScreenshot: Boolean(screenshotBase64),
          submittedAt: new Date().toISOString(),
        },
      },
    });

    // 4. Send dual notification emails (Admin alert + User receipt)
    try {
      await sendPaymentProofSubmittedEmails({
        userName: name,
        userEmail: email,
        utrNumber: cleanUtr,
        amount: Math.round((plan.price || 49900) / 100),
        screenshotUrl: screenshotBase64,
      });
    } catch (emailErr) {
      console.error("[UPI Submit Email Dispatch Error]:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Payment proof submitted successfully! Our team will verify your transaction and activate your Pro membership shortly.",
      paymentId: payment.id,
      utr: cleanUtr,
    });
  } catch (error: any) {
    console.error("[UPI Submit Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit UPI payment proof" },
      { status: 500 }
    );
  }
}

