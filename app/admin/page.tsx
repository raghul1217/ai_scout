import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Users, Crown, FileText, Wrench, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | AI Scout",
};

export default async function AdminDashboardPage() {
  let userCount = 0;
  let activeMembershipCount = 0;
  let articleCount = 0;
  let toolCount = 0;
  let resourceCount = 0;
  let recentSync: any = null;
  let recentEnquiries: any[] = [];

  try {
    [
      userCount,
      activeMembershipCount,
      articleCount,
      toolCount,
      resourceCount,
      recentSync,
      recentEnquiries,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.membership.count({ where: { status: "ACTIVE" } }),
      prisma.article.count(),
      prisma.aITool.count(),
      prisma.learningResource.count(),
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
    { label: "Published Articles", count: articleCount, icon: FileText, color: "text-[#10B981]" },
    { label: "AI Tools", count: toolCount, icon: Wrench, color: "text-[#8B5CF6]" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Platform Overview</h1>
        <p className="text-xs md:text-sm text-[#A7B2CC] mt-1">
          Real-time metrics, content status, and sync telemetry.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-[#0D1730] border border-[#24314F] flex items-center justify-between"
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

      {/* Sync Status Banner */}
      <div className="p-6 rounded-2xl bg-[#0D1730] border border-[#24314F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
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
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#3B82F6] hover:bg-[#2563EB] text-white transition text-center"
        >
          View Sync Manager
        </Link>
      </div>

      {/* Recent Contact Enquiries */}
      <div className="p-6 rounded-2xl bg-[#0D1730] border border-[#24314F] space-y-4">
        <h3 className="text-base font-bold text-white">Recent Team & Enterprise Enquiries</h3>
        {recentEnquiries.length === 0 ? (
          <p className="text-xs text-[#6B7FA3]">No enquiries received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24314F]/50 text-[#A7B2CC]">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id}>
                    <td className="py-3 font-semibold text-white">{enq.name}</td>
                    <td className="py-3">{enq.email}</td>
                    <td className="py-3">{enq.company ?? "—"}</td>
                    <td className="py-3">{enq.enquiryType}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#3B82F6]/20 text-[#60A5FA]">
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
