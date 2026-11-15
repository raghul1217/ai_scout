import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    const users = await prisma.user.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        memberships: {
          where: {
            status: "ACTIVE",
            OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
          },
          include: {
            plan: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const formatted = users.map((u) => {
      const activeMembership = u.memberships[0] || null;
      const isPremium = u.role === "ADMIN" || Boolean(activeMembership);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        isPremium,
        membership: activeMembership
          ? {
              id: activeMembership.id,
              planName: activeMembership.plan.name,
              status: activeMembership.status,
              startDate: activeMembership.startDate,
              endDate: activeMembership.endDate,
            }
          : null,
        recentPaymentsCount: u.payments.length,
        createdAt: u.createdAt,
      };
    });

    return NextResponse.json({ users: formatted });
  } catch (error: any) {
    console.error("[Admin Users List Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

