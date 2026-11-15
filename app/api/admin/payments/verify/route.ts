import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { sendPremiumActivatedEmail } from "@/lib/email/sender";

export const dynamic = "force-dynamic";

const verifyActionSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  action: z.enum(["APPROVE", "REJECT"]),
  rejectionReason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize Admin
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = verifyActionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { paymentId, action, rejectionReason } = result.data;

    // 2. Fetch the payment record
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: true,
        plan: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    if (action === "REJECT") {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "FAILED",
          rawPayload: {
            ...(payment.rawPayload as any),
            rejectedBy: admin.email,
            rejectionReason: rejectionReason || "Invalid or unverified transaction ID",
            rejectedAt: new Date().toISOString(),
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Payment from ${payment.user.name} has been rejected.`,
      });
    }

    // 3. APPROVE Action
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    // a. Update Payment Status to CAPTURED
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "CAPTURED",
        rawPayload: {
          ...(payment.rawPayload as any),
          verifiedBy: admin.email,
          verifiedAt: new Date().toISOString(),
        },
      },
    });

    // b. Deactivate any existing active memberships for this user
    await prisma.membership.updateMany({
      where: {
        userId: payment.userId,
        status: "ACTIVE",
      },
      data: {
        status: "EXPIRED",
      },
    });

    // c. Create new active SAVZYEN Premium membership for 1 year
    const membership = await prisma.membership.create({
      data: {
        userId: payment.userId,
        planId: payment.planId,
        status: "ACTIVE",
        startDate: new Date(),
        endDate: oneYearFromNow,
        autoRenew: false,
      },
    });

    // d. Dispatch Celebration Activation Email via Resend
    try {
      await sendPremiumActivatedEmail({
        userName: payment.user.name,
        userEmail: payment.user.email,
        planName: payment.plan.name || "SAVZYEN Premium",
        endDate: oneYearFromNow,
      });
    } catch (emailErr) {
      console.error("[Verify Admin - Email Dispatch Error]:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully verified ₹${payment.amount / 100} payment and activated SAVZYEN Premium for ${payment.user.name}!`,
      membershipId: membership.id,
      endDate: oneYearFromNow.toISOString(),
    });
  } catch (error: any) {
    console.error("[Admin Verify Payment Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process payment verification" },
      { status: 500 }
    );
  }
}

