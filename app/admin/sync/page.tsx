import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { SyncTriggerButton } from "./SyncClient";
import { Table, Sheet, Info, AlertTriangle, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Google Sheets Sync Manager | Admin | AI Scout",
};

export default async function AdminSyncPage() {
  let syncRuns: any[] = [];
  try {
    syncRuns = await prisma.contentSyncRun.findMany({
      orderBy: { startedAt: "desc" },
      take: 10,
      include: {
        rowLogs: {
          where: { status: "ERROR" },
          take: 5,
        },
      },
    });
  } catch (error) {
    console.warn("DB not ready in admin sync page:", error);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Google Sheets Publishing Pipeline</h1>
        <p className="text-xs md:text-sm text-[#A7B2CC] mt-1">
          Automate content publishing from Google Sheets directly to AI Scout with validation and error reporting.
        </p>
      </div>

      {/* Trigger & Instruction Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sheet className="w-5 h-5 text-[#3B82F6]" />
            Manual Sync Trigger
          </h2>
          <p className="text-xs text-[#A7B2CC] leading-relaxed">
            Clicking the button will query the Google Sheets API, validate all rows according to the strict schema, and upsert records into the database.
          </p>
          <SyncTriggerButton />
        </div>

        <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-[#9F67FF]" />
            Required Sheet Schema (Tab: "Articles")
          </h2>
          <div className="text-xs text-[#A7B2CC] space-y-2">
            <p className="font-mono text-[11px] bg-[#112040] p-2.5 rounded-lg border border-[#24314F] text-[#60A5FA]">
              Col A: Title | Col B: Summary | Col C: Content | Col D: CategorySlug | Col E: Status (DRAFT/PUBLISHED) | Col F: AccessLevel (FREE/PREMIUM) | Col G: Author | Col H: ReadTime
            </p>
            <p className="text-[11px] text-[#6B7FA3]">
              Tip: Automated cron on a Linux VPS can trigger sync periodically using:
              <br />
              <code className="text-white font-mono">curl -X POST -H &quot;Authorization: Bearer $SYNC_SECRET&quot; https://aiscout.in/api/sync/sheets</code>
            </p>
          </div>
        </div>
      </div>

      {/* Sync Run History */}
      <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Sync Run Telemetry</h3>
        {syncRuns.length === 0 ? (
          <p className="text-xs text-[#6B7FA3]">No sync history logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Total Rows</th>
                  <th className="pb-3">Success</th>
                  <th className="pb-3">Errors</th>
                  <th className="pb-3">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24314F]/50 text-[#A7B2CC]">
                {syncRuns.map((run) => (
                  <tr key={run.id}>
                    <td className="py-3 text-white font-medium">
                      {formatDate(run.startedAt)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          run.status === "SUCCESS"
                            ? "bg-[#16C784]/20 text-[#16C784]"
                            : run.status === "RUNNING"
                            ? "bg-[#3B82F6]/20 text-[#60A5FA]"
                            : "bg-[#EF4444]/20 text-[#EF4444]"
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="py-3">{run.totalRows}</td>
                    <td className="py-3 text-[#16C784] font-semibold">{run.successRows}</td>
                    <td className="py-3 text-[#EF4444] font-semibold">{run.errorRows}</td>
                    <td className="py-3 max-w-xs truncate text-[#6B7FA3]">
                      {run.errorMessage ?? "—"}
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
