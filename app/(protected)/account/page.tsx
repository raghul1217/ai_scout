import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { Crown, User, Mail, Shield, Calendar, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account | AI Scout",
  description: "Manage your AI Scout profile, membership status, and access.",
};

export default async function AccountPage() {
  const user = await requireAuth("/account");

  // Fetch recent payments and full membership details
  const [payments, currentMembership] = await Promise.all([
    prisma.payment.findMany({
      where: { userId: user.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
      take: 5,
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
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-[#24314F] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Account Overview</h1>
            <p className="text-[#A7B2CC] mt-1 text-sm">
              Manage your subscription, security settings, and learning profile.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-90 transition"
              >
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/"
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#24314F] text-[#A7B2CC] hover:text-white hover:border-[#3B82F6] transition"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Profile & Membership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Profile Card */}
          <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-[#3B82F6]" />
              Profile Details
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[#6B7FA3] uppercase tracking-wider block">Full Name</span>
                <span className="text-sm font-medium text-white">{user.name}</span>
              </div>
              <div>
                <span className="text-xs text-[#6B7FA3] uppercase tracking-wider block">Email Address</span>
                <span className="text-sm font-medium text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#6B7FA3]" />
                  {user.email}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#6B7FA3] uppercase tracking-wider block">Role</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#112040] text-[#60A5FA] border border-[#24314F] mt-1">
                  <Shield className="w-3 h-3" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Membership Card */}
          <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/10 rounded-full blur-2xl pointer-events-none" />
            
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Crown className="w-5 h-5 text-[#F59E0B]" />
              Membership Status
            </h2>

            {user.isPremium && currentMembership ? (
              <div className="space-y-4">
                <div className="p-3 bg-[#112040] border border-[#7C3AED]/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#9F67FF] uppercase tracking-wider">Current Plan</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#16C784]/20 text-[#16C784] border border-[#16C784]/30">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-xl font-bold text-white mt-1">
                    {currentMembership.plan.name}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#A7B2CC]">
                  <div className="flex justify-between py-1 border-b border-[#24314F]">
                    <span>Started</span>
                    <span className="text-white">{formatDate(currentMembership.startDate)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#24314F]">
                    <span>Renewal / Expiry</span>
                    <span className="text-white">
                      {currentMembership.endDate ? formatDate(currentMembership.endDate) : "Lifetime Access"}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/premium"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 transition"
                  >
                    <Zap className="w-4 h-4" /> Access Premium Content
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-[#112040] border border-[#24314F] rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B7FA3] uppercase tracking-wider">Current Tier</span>
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
                  href="/pricing"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 transition shadow-lg shadow-[#7C3AED]/20"
                >
                  <Crown className="w-4 h-4 text-yellow-300" />
                  Upgrade to Premium
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-[#16C784]" />
            Billing & Invoices
          </h2>

          {payments.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[#24314F] rounded-xl">
              <p className="text-sm text-[#6B7FA3]">No transaction history found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Order ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#24314F]/50 text-[#A7B2CC]">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 text-white">{formatDate(p.createdAt)}</td>
                      <td className="py-3">{p.plan.name}</td>
                      <td className="py-3 font-semibold text-white">
                        ₹{(p.amount / 100).toFixed(0)}
                      </td>
                      <td className="py-3">
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
                      <td className="py-3 font-mono text-[11px] text-[#6B7FA3]">
                        {p.razorpayOrderId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
