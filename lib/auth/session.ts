import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "@/lib/db/prisma";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  image?: string | null;
  isPremium: boolean;
  membership?: {
    id: string;
    planName: string;
    status: string;
    endDate: Date | null;
  } | null;
}

export async function getServerSession() {
  try {
    const reqHeaders = await headers();
    return await auth.api.getSession({
      headers: reqHeaders,
    });
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          where: {
            status: "ACTIVE",
            OR: [
              { endDate: null },
              { endDate: { gt: new Date() } },
            ],
          },
          include: {
            plan: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) return null;

    const activeMembership = user.memberships[0] ?? null;
    const isPremium = user.role === "ADMIN" || Boolean(activeMembership);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      isPremium,
      membership: activeMembership
        ? {
            id: activeMembership.id,
            planName: activeMembership.plan.name,
            status: activeMembership.status,
            endDate: activeMembership.endDate,
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function requireAuth(returnUrl?: string): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    const query = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : "";
    redirect(`/login${query}`);
  }
  return user;
}

export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    redirect("/?error=unauthorized");
  }
  return user;
}

export async function requirePremium(): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!user.isPremium) {
    redirect("/pricing?reason=premium_required");
  }
  return user;
}
