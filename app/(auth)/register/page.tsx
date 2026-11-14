import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { RegisterClient, type PlanItem } from "./RegisterClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Join Savzyen | Account & Membership",
  description: "Create your Savzyen account and unlock lifetime access to SAVZYEN Premium, daily AI challenges, and real-time agent blueprints.",
};

const defaultPlans: PlanItem[] = [
  {
    id: "plan_free",
    name: "Savzyen Free",
    slug: "free",
    description: "Essential AI tool directory and curated daily updates.",
    price: 0,
    currency: "INR",
    billingType: "ONE_TIME",
    features: [
      "AI Updates Daily 1",
      "Weekly 1 news",
    ],
  },
  {
    id: "plan_pro",
    name: "SAVZYEN Premium",
    slug: "pro",
    description: "Stay Ahead. Learn Faster. Build Smarter.",
    price: 49900,
    currency: "INR",
    billingType: "YEARLY",
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
];

export default async function RegisterPage() {
  let plans: PlanItem[] = [];

  try {
    // 1. Ensure the ₹499 SAVZYEN Premium plan exists in DB and update its features/descriptions
    await prisma.plan.upsert({
      where: { slug: "pro" },
      update: {
        name: "SAVZYEN Premium",
        description: "Stay Ahead. Learn Faster. Build Smarter.",
        price: 49900, // ₹499.00
        currency: "INR",
        billingType: "YEARLY",
        durationDays: 365,
        isActive: true,
        sortOrder: 2,
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
      create: {
        name: "SAVZYEN Premium",
        slug: "pro",
        description: "Stay Ahead. Learn Faster. Build Smarter.",
        price: 49900, // ₹499.00
        currency: "INR",
        billingType: "YEARLY",
        durationDays: 365,
        isActive: true,
        sortOrder: 2,
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

    // Also update Free plan features in DB if present
    await prisma.plan.upsert({
      where: { slug: "free" },
      update: {
        name: "Savzyen Free",
        description: "Essential AI tool directory and curated daily updates.",
        price: 0,
        currency: "INR",
        billingType: "ONE_TIME",
        durationDays: null,
        isActive: true,
        sortOrder: 1,
        features: [
          "AI Updates Daily 1",
          "Weekly 1 news",
        ],
      },
      create: {
        name: "Savzyen Free",
        slug: "free",
        description: "Essential AI tool directory and curated daily updates.",
        price: 0,
        currency: "INR",
        billingType: "ONE_TIME",
        durationDays: null,
        isActive: true,
        sortOrder: 1,
        features: [
          "AI Updates Daily 1",
          "Weekly 1 news",
        ],
      },
    });

    // Deactivate old legacy plans if present
    await prisma.plan.updateMany({
      where: { slug: { in: ["pro-monthly", "pro-lifetime"] } },
      data: { isActive: false },
    });

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
