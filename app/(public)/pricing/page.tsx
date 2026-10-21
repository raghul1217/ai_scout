import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { PricingClient } from "@/components/payment/PricingClient";
import { Crown, Sparkles, Shield, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing & Membership Plans | AI Scout",
  description: "Flexible membership tiers with instant access to production AI blueprints, agent prompts, and founder lounges.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  let plans: any[] = [];
  try {
    plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.warn("Error fetching plans from DB:", error);
  }

  // Fallback plans if DB not seeded
  if (plans.length === 0) {
    plans = [
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
        id: "plan_monthly",
        name: "AI Scout Pro (Monthly)",
        slug: "pro-monthly",
        description: "Full access to premium blueprints, advanced prompt packs, and member lounge.",
        price: 99900,
        currency: "INR",
        billingType: "MONTHLY",
        features: [
          "Everything in Free Community",
          "Access to all Premium Blueprints & Guides",
          "Production-tested agent prompt libraries",
          "Monthly commercial AI benchmark reports",
          "Priority VIP community lounge",
        ],
      },
      {
        id: "plan_lifetime",
        name: "Founder Lifetime Access",
        slug: "pro-lifetime",
        description: "One-time investment for permanent access to all current and future intelligence.",
        price: 499900,
        currency: "INR",
        billingType: "LIFETIME",
        features: [
          "Permanent lifetime access to all vaults",
          "All future courses, workshops & blueprints",
          "Private WhatsApp & Discord Founders channel",
          "Commercial rights to all provided prompt kits",
          "Direct architectural Q&A with AI Scout authors",
        ],
      },
    ];
  }

  return (
    <div className="min-h-screen py-16 bg-[#050816] text-[#F8FAFC]">
      <div className="container-max max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-xs font-semibold text-[#9F67FF]">
            <Crown className="w-3.5 h-3.5 text-yellow-300" />
            Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Invest in High-Leverage <span className="text-gradient">AI Competence</span>
          </h1>
          <p className="text-sm md:text-base text-[#A7B2CC] leading-relaxed">
            Choose the tier that matches your roadmap. Cancel anytime or secure lifetime access.
          </p>

          {reason === "premium_required" && (
            <div className="p-3.5 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/40 text-xs text-[#9F67FF] font-medium">
              🔒 That content requires an active AI Scout Pro membership. Select a plan below to unlock immediate access.
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <PricingClient plans={plans} />

        {/* Trust & Guarantee */}
        <div className="border-t border-[#24314F] pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 space-y-2">
            <Zap className="w-6 h-6 text-[#3B82F6] mx-auto" />
            <h4 className="text-sm font-bold text-white">Instant Provisioning</h4>
            <p className="text-xs text-[#6B7FA3]">
              Your account is upgraded the millisecond payment is confirmed by Razorpay.
            </p>
          </div>
          <div className="p-4 space-y-2">
            <Shield className="w-6 h-6 text-[#16C784] mx-auto" />
            <h4 className="text-sm font-bold text-white">Secure Transactions</h4>
            <p className="text-xs text-[#6B7FA3]">
              Bank-grade 256-bit SSL encryption. We never handle or store your raw card numbers.
            </p>
          </div>
          <div className="p-4 space-y-2">
            <Sparkles className="w-6 h-6 text-[#9F67FF] mx-auto" />
            <h4 className="text-sm font-bold text-white">Always Fresh Intelligence</h4>
            <p className="text-xs text-[#6B7FA3]">
              New blueprints, benchmarks, and model evaluations added weekly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
