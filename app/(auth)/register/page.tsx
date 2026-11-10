import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { RegisterClient, type PlanItem } from "./RegisterClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Join Savzen | Account & Membership",
  description: "Create your Savzen account and unlock lifetime access to production blueprints and AI intelligence.",
};

const defaultPlans: PlanItem[] = [
  {
    id: "plan_free",
    name: "Free Community",
    slug: "free",
    description: "Essential AI tool directory and weekly curated updates.",
    price: 0,
    currency: "INR",
    billingType: "ONE_TIME",
    features: [
      "Curated directory of 150+ verified AI tools",
      "Weekly AI newsletter & curated headlines",
      "Public community access on WhatsApp",
      "Basic search and filtering",
    ],
  },
  {
    id: "plan_pro",
    name: "Savzen Pro",
    slug: "pro",
    description: "Full lifetime access to premium blueprints, advanced prompt packs, and member lounge.",
    price: 49900,
    currency: "INR",
    billingType: "LIFETIME",
    features: [
      "Everything in Free Community",
      "Access to all Premium Blueprints & Guides",
      "Production-tested agent prompt libraries",
      "Monthly commercial AI benchmark reports",
      "Priority VIP community lounge",
      "Lifetime access with zero recurring fees",
    ],
  },
];

export default async function RegisterPage() {
  let plans: PlanItem[] = [];

  try {
    // 1. Ensure the ₹499 Pro plan exists in DB and deactivate legacy ₹999 / ₹4999 plans
    let proPlan = await prisma.plan.findFirst({
      where: { slug: "pro", isActive: true },
    });

    if (!proPlan) {
      await prisma.plan.upsert({
        where: { slug: "pro" },
        update: {
          name: "Savzen Pro",
          description: "Full lifetime access to premium blueprints, advanced prompt packs, and member lounge.",
          price: 49900, // ₹499.00
          currency: "INR",
          billingType: "LIFETIME",
          durationDays: null,
          isActive: true,
          sortOrder: 2,
          features: [
            "Everything in Free Community",
            "Access to all Premium Blueprints & Guides",
            "Production-tested agent prompt libraries",
            "Monthly commercial AI benchmark reports",
            "Priority VIP community lounge",
            "Lifetime access with zero recurring fees",
          ],
        },
        create: {
          name: "Savzen Pro",
          slug: "pro",
          description: "Full lifetime access to premium blueprints, advanced prompt packs, and member lounge.",
          price: 49900, // ₹499.00
          currency: "INR",
          billingType: "LIFETIME",
          durationDays: null,
          isActive: true,
          sortOrder: 2,
          features: [
            "Everything in Free Community",
            "Access to all Premium Blueprints & Guides",
            "Production-tested agent prompt libraries",
            "Monthly commercial AI benchmark reports",
            "Priority VIP community lounge",
            "Lifetime access with zero recurring fees",
          ],
        },
      });

      // Deactivate old legacy plans if present
      await prisma.plan.updateMany({
        where: { slug: { in: ["pro-monthly", "pro-lifetime"] } },
        data: { isActive: false },
      });
    }

    const dbPlans = await prisma.plan.findMany({
      where: {
        isActive: true,
        slug: { in: ["free", "pro"] },
      },
      orderBy: { sortOrder: "asc" },
    });

    if (dbPlans && dbPlans.length > 0) {
      plans = dbPlans.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        currency: p.currency,
        billingType: p.billingType,
        features: p.features,
      }));
    }
  } catch (error) {
    console.warn("Could not fetch or auto-sync plans from DB, using fallback plans:", error);
  }

  if (plans.length === 0) {
    plans = defaultPlans;
  }

  return <RegisterClient plans={plans} />;
}
