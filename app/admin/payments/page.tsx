import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { PaymentsQueueClient } from "./PaymentsQueueClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "UPI Payment Verifications | Savzyen Admin",
};

export default async function AdminPaymentsPage() {
  await requireAdmin();

  let payments: any[] = [];
  try {
    payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        plan: {
          select: {
            name: true,
            slug: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch (error) {
    console.warn("[Admin Payments]: Could not load payments from DB:", error);
  }

  const serialized = payments.map((p) => ({
    id: p.id,
    userId: p.userId,
    userName: p.user?.name || "Anonymous",
    userEmail: p.user?.email || "N/A",
    planName: p.plan?.name || "SAVZYEN Premium",
    amount: Math.round(p.amount / 100),
    currency: p.currency,
    status: p.status,
    utrNumber: p.receiptNumber || (p.rawPayload as any)?.utrNumber || "N/A",
    screenshotUrl: (p.rawPayload as any)?.screenshotUrl || null,
    paymentMethod: (p.rawPayload as any)?.paymentMethod || "UPI_QR",
    createdAt: p.createdAt.toISOString(),
  }));

  return <PaymentsQueueClient initialPayments={serialized} />;
}

