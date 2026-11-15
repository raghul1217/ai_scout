import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { UsersDirectoryClient } from "./UsersDirectoryClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Users & Member Directory | Savzyen Admin",
};

export default async function AdminUsersPage() {
  await requireAdmin();

  let users: any[] = [];
  try {
    users = await prisma.user.findMany({
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
      take: 200,
    });
  } catch (error) {
    console.warn("[Admin Users]: Could not load users from DB:", error);
  }

  const serialized = users.map((u) => {
    const activeMembership = u.memberships[0] || null;
    const isPremium = u.role === "ADMIN" || Boolean(activeMembership);

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: (u as any).phone || null,
      role: u.role,
      isPremium,
      membership: activeMembership
        ? {
            id: activeMembership.id,
            planName: activeMembership.plan?.name || "SAVZYEN Premium",
            status: activeMembership.status,
            startDate: activeMembership.startDate?.toISOString() || null,
            endDate: activeMembership.endDate?.toISOString() || null,
          }
        : null,
      recentPaymentsCount: u.payments.length,
      createdAt: u.createdAt.toISOString(),
    };
  });

  return <UsersDirectoryClient initialUsers={serialized} />;
}

