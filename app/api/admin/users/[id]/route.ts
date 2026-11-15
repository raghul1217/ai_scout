import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { sendPremiumActivatedEmail } from "@/lib/email/sender";

export const dynamic = "force-dynamic";

const updateUserSchema = z.object({
  role: z.enum(["USER", "ADMIN"]).optional(),
  isPremium: z.boolean().optional(),
  durationDays: z.number().min(1).max(3650).default(365),
  sendConfirmationEmail: z.boolean().default(true),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = updateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { role, isPremium, durationDays, sendConfirmationEmail } = result.data;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          where: { status: "ACTIVE" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Update Role if provided
    if (role && role !== user.role) {
      await prisma.user.update({
        where: { id },
        data: { role },
      });
    }

    // 2. Update Membership / Premium status if provided
    if (typeof isPremium === "boolean") {
      if (isPremium) {
        // Upgrade to Premium
        let proPlan = await prisma.plan.findUnique({ where: { slug: "pro" } });
        if (!proPlan) {
          proPlan = await prisma.plan.findFirst({ where: { slug: "pro" } });
        }

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + durationDays);

        // Deactivate old active memberships
        await prisma.membership.updateMany({
          where: { userId: id, status: "ACTIVE" },
          data: { status: "EXPIRED" },
        });

        // Create new active membership
        await prisma.membership.create({
          data: {
            userId: id,
            planId: proPlan?.id || "plan_pro",
            status: "ACTIVE",
            startDate: new Date(),
            endDate,
            autoRenew: false,
          },
        });

        // Dispatch confirmation email if requested
        if (sendConfirmationEmail) {
          try {
            await sendPremiumActivatedEmail({
              userName: user.name,
              userEmail: user.email,
              planName: proPlan?.name || "Premium – 1 Year",
              amount: 499,
              paymentId: `ADM-UPG-${id.slice(-6).toUpperCase()}`,
              endDate,
            });
          } catch (emailErr) {
            console.error("[Admin Edit User]: Email dispatch error:", emailErr);
          }
        }
      } else {
        // Revoke / downgrade to free
        await prisma.membership.updateMany({
          where: { userId: id, status: "ACTIVE" },
          data: { status: "CANCELLED" },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `User ${user.name} successfully updated.`,
    });
  } catch (error: any) {
    console.error("[Admin Update User Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (admin.id === id) {
      return NextResponse.json(
        { error: "You cannot delete your own admin account." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cascade delete any remaining related records safely
    await prisma.$transaction([
      prisma.session.deleteMany({ where: { userId: id } }),
      prisma.account.deleteMany({ where: { userId: id } }),
      prisma.membership.deleteMany({ where: { userId: id } }),
      prisma.payment.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({
      success: true,
      message: `User ${user.name} (${user.email}) has been permanently deleted.`,
    });
  } catch (error: any) {
    console.error("[Admin Delete User Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}


