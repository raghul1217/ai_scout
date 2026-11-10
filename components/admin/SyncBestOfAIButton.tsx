"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export function SyncBestOfAIButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      const res = await fetch("/api/sync/bestofai", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sync failed");
      }

      setMessage(data.message || `Successfully synced ${data.count} tools.`);
      setIsError(false);
      router.refresh();
    } catch (err: any) {
      setMessage(err.message || "Failed to sync tools");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#3B82F6] hover:bg-[#2563EB] text-white disabled:opacity-50 transition shadow-lg shadow-blue-500/20"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Syncing Best of AI..." : "Sync from Best of AI"}
      </button>

      {message && (
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${
            isError
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          }`}
        >
          {isError ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}

