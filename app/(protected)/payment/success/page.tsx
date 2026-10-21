import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Crown, ArrowRight, Zap, BookOpen } from "lucide-react";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment Successful | Welcome to AI Scout Pro",
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const user = await requireAuth("/payment/success");
  const { plan } = await searchParams;

  // Retrieve active membership
  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
    },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  const planName = membership?.plan.name || plan || "AI Scout Pro";

  return (
    <div className="min-h-screen py-20 bg-[#050816] text-[#F8FAFC] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0D1730] border border-[#24314F] rounded-3xl p-8 md:p-10 text-center space-y-6 relative overflow-hidden shadow-2xl shadow-[#7C3AED]/20">
        <div className="w-16 h-16 rounded-full bg-[#16C784]/20 border border-[#16C784]/40 flex items-center justify-center mx-auto text-[#16C784]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#9F67FF] uppercase tracking-wider">
            Payment Confirmed
          </span>
          <h1 className="text-3xl font-black text-white">Welcome to {planName}!</h1>
          <p className="text-xs md:text-sm text-[#A7B2CC] leading-relaxed">
            Your membership is now active. All premium blueprints, prompts, and member-only updates are unlocked for your account ({user.email}).
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Link
            href="/premium"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 transition shadow-lg shadow-[#7C3AED]/25"
          >
            <Crown className="w-4 h-4 text-yellow-300" />
            Enter Member Vault
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/account"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-[#112040] hover:bg-[#24314F] text-[#A7B2CC] hover:text-white border border-[#24314F] transition"
          >
            View Account & Billing
          </Link>
        </div>
      </div>
    </div>
  );
}
