import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { Crown, User, Mail, Shield, Calendar, ArrowRight, Zap, Home } from "lucide-react";
import { SignOutButton } from "@/components/account/SignOutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account | Savzyen",
  description: "Manage your Savzyen profile, membership status, and access.",
};

export default async function AccountPage() {
  const user = await requireAuth("/account");

  // Fetch recent payments and full membership details
  const [payments, currentMembership] = await Promise.all([
    prisma.payment.findMany({
      where: { userId: user.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.membership.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="border-b border-[#24314F] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Account Overview</h1>
            <p className="text-[#A7B2CC] mt-1 text-xs sm:text-sm">
              Manage your subscription, security settings, and learning profile.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-90 transition shadow-sm text-center whitespace-nowrap w-full sm:w-auto"
              >
                <Shield className="w-3.5 h-3.5 shrink-0" />
                Admin Dashboard
              </Link>
            )}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-xl border border-[#24314F] bg-[#0D1730] text-[#A7B2CC] hover:text-white hover:border-[#3B82F6] transition text-center whitespace-nowrap"
              >
                <Home className="w-3.5 h-3.5 shrink-0" />
                Back to Home
              </Link>
              <SignOutButton className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition text-center whitespace-nowrap w-full" />
            </div>
          </div>
        </div>

        {/* Profile & Membership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* User Profile Card */}
          <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-[#3B82F6]" />
              Profile Details
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-[11px] text-[#6B7FA3] uppercase tracking-wider block font-semibold">Full Name</span>
                <span className="text-sm font-medium text-white mt-0.5 block">{user.name}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#6B7FA3] uppercase tracking-wider block font-semibold">Email Address</span>
                <span className="text-sm font-medium text-white flex items-center gap-2 mt-0.5 break-all">
                  <Mail className="w-4 h-4 text-[#6B7FA3] shrink-0" />
                  {user.email}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#6B7FA3] uppercase tracking-wider block font-semibold">Role</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#112040] text-[#60A5FA] border border-[#24314F] mt-1">
                  <Shield className="w-3 h-3" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Membership Card */}
          <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/10 rounded-full blur-2xl pointer-events-none" />
            
            <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Crown className="w-5 h-5 text-[#F59E0B]" />
              Membership Status
            </h2>

            {user.isPremium && currentMembership ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-[#112040] border border-[#7C3AED]/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#9F67FF] uppercase tracking-wider">Current Plan</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#16C784]/20 text-[#16C784] border border-[#16C784]/30">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white mt-1">
                    {currentMembership.plan.name}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#A7B2CC]">
                  <div className="flex justify-between py-1.5 border-b border-[#24314F]">
                    <span>Started</span>
                    <span className="text-white font-medium">{formatDate(currentMembership.startDate)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#24314F]">
                    <span>Renewal / Expiry</span>
                    <span className="text-white font-medium">
                      {currentMembership.endDate ? formatDate(currentMembership.endDate) : "Lifetime Access"}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/premium"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 transition shadow-lg shadow-[#7C3AED]/20"
                  >
                    <Zap className="w-4 h-4 text-yellow-300" /> Access Premium Content
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 bg-[#112040] border border-[#24314F] rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#6B7FA3] uppercase tracking-wider">Current Tier</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#24314F] text-[#A7B2CC]">
                      FREE TIER
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white mt-1">
                    Community Member
                  </div>
                </div>

                <p className="text-xs text-[#A7B2CC] leading-relaxed">
                  Upgrade to unlock full prompt libraries, in-depth architectural guides, and premium AI workflows.
                </p>

                <Link
                  href="/join"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 transition shadow-lg shadow-[#7C3AED]/20"
                >
                  <Crown className="w-4 h-4 text-yellow-300" />
                  Upgrade to Premium
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Billing & Invoices */}
        <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-[#16C784]" />
            Billing & Invoices
          </h2>

          {payments.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[#24314F] rounded-xl">
              <p className="text-xs sm:text-sm text-[#6B7FA3]">No transaction history found.</p>
            </div>
          ) : (
            <>
              {/* Mobile Vertical View (sm:hidden) */}
              <div className="space-y-3 sm:hidden">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-[#112040]/70 border border-[#24314F] space-y-3"
                  >
                    {/* Top Row: Plan & Status */}
                    <div className="flex items-center justify-between border-b border-[#24314F]/60 pb-2.5">
                      <div>
                        <span className="text-[10px] text-[#6B7FA3] uppercase tracking-wider font-semibold block">Plan</span>
                        <span className="text-sm font-bold text-white">{p.plan.name}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === "CAPTURED"
                            ? "bg-[#16C784]/20 text-[#16C784] border border-[#16C784]/30"
                            : p.status === "PENDING"
                            ? "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30"
                            : "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    {/* Middle Row: Date & Amount */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-[#6B7FA3] uppercase tracking-wider font-semibold block">Date</span>
                        <span className="text-xs text-[#CBD5E1] font-medium">{formatDate(p.createdAt)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#6B7FA3] uppercase tracking-wider font-semibold block">Amount</span>
                        <span className="text-base font-extrabold text-white">
                          ₹{(p.amount / 100).toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Order ID */}
                    <div className="pt-2 border-t border-[#24314F]/40 flex items-center justify-between text-[11px]">
                      <span className="text-[#6B7FA3]">Order ID</span>
                      <span className="font-mono text-[#94A3B8] select-all truncate max-w-[200px]">
                        {p.razorpayOrderId || "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (hidden sm:block) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Plan</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Order ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#24314F]/50 text-[#A7B2CC]">
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3.5 text-white whitespace-nowrap">{formatDate(p.createdAt)}</td>
                        <td className="py-3.5 font-medium whitespace-nowrap">{p.plan.name}</td>
                        <td className="py-3.5 font-semibold text-white whitespace-nowrap">
                          ₹{(p.amount / 100).toFixed(0)}
                        </td>
                        <td className="py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              p.status === "CAPTURED"
                                ? "bg-[#16C784]/20 text-[#16C784]"
                                : p.status === "PENDING"
                                ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                                : "bg-[#EF4444]/20 text-[#EF4444]"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-[11px] text-[#6B7FA3]">
                          {p.razorpayOrderId || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
