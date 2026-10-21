"use client";

import { useState } from "react";
import { RefreshCw, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function SyncTriggerButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const router = useRouter();

  async function handleSync() {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/sync/sheets", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sync request failed");
      }

      setMessage({
        text: `Sync finished with status: ${data.status}. Rows: ${data.successRows ?? 0} updated, ${data.errorRows ?? 0} errors.`,
        error: data.status === "FAILED",
      });
      router.refresh();
    } catch (err: any) {
      setMessage({
        text: err.message || "Failed to trigger sync",
        error: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#3B82F6] hover:bg-[#2563EB] text-white disabled:opacity-50 transition shadow-lg shadow-[#3B82F6]/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Synchronizing Sheets…
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            Trigger Manual Sync Now
          </>
        )}
      </button>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
            message.error
              ? "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]"
              : "bg-[#16C784]/10 border border-[#16C784]/30 text-[#16C784]"
          }`}
        >
          {message.error ? (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}
