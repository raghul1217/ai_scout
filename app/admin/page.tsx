import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Users, Crown, FileText, Wrench, RefreshCw, CreditCard, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | Savzyen",
};

export default async function AdminDashboardPage() {
  let userCount = 0;
  let activeMembershipCount = 0;
  let articleCount = 0;
  let toolCount = 0;
  let pendingUpiCount = 0;
  let recentSync: any = null;
  let recentEnquiries: any[] = [];

  try {
    [
      userCount,
      activeMembershipCount,
      articleCount,
      toolCount,
      pendingUpiCount,
      recentSync,
      recentEnquiries,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.membership.count({ where: { status: "ACTIVE" } }),
      prisma.article.count(),
      prisma.aITool.count(),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.contentSyncRun.findFirst({ orderBy: { startedAt: "desc" } }),
      prisma.contactEnquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);
  } catch (error) {
    console.warn("DB not ready or unreachable in admin dashboard:", error);
  }

  const statCards = [
    { label: "Total Users", count: userCount, icon: Users, color: "text-[#3B82F6]" },
    { label: "Active Memberships", count: activeMembershipCount, icon: Crown, color: "text-[#F59E0B]" },
    { label: "Pending UPI Verifications", count: pendingUpiCount, icon: CreditCard, color: pendingUpiCount > 0 ? "text-amber-400" : "text-[#10B981]" },
    { label: "AI Tools", count: toolCount, icon: Wrench, color: "text-[#8B5CF6]" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Platform Overview</h1>
          <p className="text-xs md:text-sm text-[#A7B2CC] mt-1">
            Real-time metrics, user management, and manual payment verification queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:opacity-95 shadow-md transition"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Verify Payments</span>
            {pendingUpiCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center">
                {pendingUpiCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#A7B2CC] hover:text-white bg-[#0D1730] border border-[#24314F] hover:border-[#3B82F6] transition"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-xl bg-[#0D1730] border border-[#24314F] flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-[#6B7FA3] uppercase tracking-wider block">
                  {stat.label}
                </span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {stat.count}
                </span>
              </div>
              <Icon className={`w-8 h-8 ${stat.color} opacity-80`} />
            </div>
          );
        })}
      </div>

      {/* UPI Verifications Alert if Pending */}
      {pendingUpiCount > 0 && (
        <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {pendingUpiCount} UPI Payment{pendingUpiCount > 1 ? "s" : ""} Awaiting Verification
              </h3>
              <p className="text-xs text-[#A7B2CC] mt-0.5">
                Users have submitted their UTR reference. Verify and activate their SAVZYEN Premium access.
              </p>
            </div>
          </div>
          <Link
            href="/admin/payments"
            className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition shrink-0 text-center"
          >
            Open Verification Queue →
          </Link>
        </div>
      )}

      {/* Sync Status Banner */}
      <div className="p-5 rounded-xl bg-[#0D1730] border border-[#24314F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Google Sheets Pipeline</h3>
            <p className="text-xs text-[#A7B2CC] mt-0.5">
              {recentSync
                ? `Last sync: ${recentSync.status} (${recentSync.successRows} rows updated, ${recentSync.errorRows} errors)`
                : "No sync has run yet."}
            </p>
          </div>
        </div>

        <Link
          href="/admin/sync"
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#3B82F6] hover:bg-[#2563EB] text-white transition text-center"
        >
          View Sync Manager
        </Link>
      </div>

      {/* Recent Contact Enquiries */}
      <div className="p-5 rounded-xl bg-[#0D1730] border border-[#24314F] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recent Team & Enterprise Enquiries</h3>
          <span className="text-[11px] text-[#6B7FA3]">Showing last 5 enquiries</span>
        </div>
        {recentEnquiries.length === 0 ? (
          <p className="text-xs text-[#6B7FA3]">No enquiries received yet.</p>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[620px]">
              <thead>
                <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider bg-[#0A1024]">
                  <th className="py-2.5 px-3 font-semibold">Name</th>
                  <th className="py-2.5 px-3 font-semibold">Email</th>
                  <th className="py-2.5 px-3 font-semibold">Company / Org</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24314F]/50 text-[#A7B2CC]">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white max-w-[150px] truncate" title={enq.name}>
                      {enq.name}
                    </td>
                    <td className="py-3 px-3 max-w-[180px] truncate" title={enq.email}>
                      {enq.email}
                    </td>
                    <td className="py-3 px-3 max-w-[160px] truncate text-[#6B7FA3]" title={enq.company ?? "—"}>
                      {enq.company ?? "—"}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="capitalize">{enq.enquiryType?.replace(/_/g, " ")}</span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30">
                        {enq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
