"use client";

import { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Image as ImageIcon,
  X,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaymentItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  currency: string;
  status: "PENDING" | "CAPTURED" | "FAILED" | "AUTHORIZED" | "REFUNDED";
  utrNumber: string;
  screenshotUrl: string | null;
  paymentMethod: string;
  createdAt: string;
}

export function PaymentsQueueClient({
  initialPayments,
}: {
  initialPayments: PaymentItem[];
}) {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CAPTURED" | "FAILED">("PENDING");
  const [search, setSearch] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleVerify = async (paymentId: string) => {
    setLoadingId(paymentId);
    setActionMessage(null);

    try {
      const res = await fetch("/api/admin/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, action: "APPROVE" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to verify payment");
      }

      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: "CAPTURED" } : p))
      );
      setActionMessage({ text: data.message || "Payment verified & Pro activated!", type: "success" });
    } catch (err: any) {
      setActionMessage({ text: err.message || "Error verifying payment", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!confirm("Are you sure you want to mark this transaction as Failed / Rejected?")) {
      return;
    }

    setLoadingId(paymentId);
    setActionMessage(null);

    try {
      const res = await fetch("/api/admin/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, action: "REJECT" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reject payment");
      }

      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: "FAILED" } : p))
      );
      setActionMessage({ text: data.message || "Payment marked as rejected.", type: "success" });
    } catch (err: any) {
      setActionMessage({ text: err.message || "Error rejecting payment", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = payments.filter((p) => {
    if (filter !== "ALL" && p.status !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.userName.toLowerCase().includes(q) ||
      p.userEmail.toLowerCase().includes(q) ||
      p.utrNumber.toLowerCase().includes(q)
    );
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const displayedPayments = filtered.slice(startIndex, endIndex);

  const pendingCount = payments.filter((p) => p.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">UPI Payment Verifications</h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-[#A7B2CC] mt-1">
            Review incoming GPay / UPI payments, verify 12-digit UTR numbers, and activate Pro memberships.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#6B7FA3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or UTR…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0D1730] border border-[#24314F] text-xs text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>
      </div>

      {/* Action Banner */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between animate-fade-in ${
            actionMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: "PENDING", label: `Pending Verification (${pendingCount})` },
          { key: "ALL", label: `All Payments (${payments.length})` },
          { key: "CAPTURED", label: "Approved / Verified" },
          { key: "FAILED", label: "Rejected" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setFilter(tab.key as any);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              filter === tab.key
                ? "bg-[#3B82F6] border-[#3B82F6] text-white shadow-sm"
                : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:text-white hover:border-[#3B82F6]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Table Container (Clean rounded-xl border radius) */}
      <div className="bg-[#0D1730] border border-[#24314F] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead>
              <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider bg-[#0A1024]">
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Plan & Amount</th>
                <th className="py-3 px-4 font-semibold">12-Digit UTR Number</th>
                <th className="py-3 px-4 font-semibold">Proof</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24314F]/60 text-[#A7B2CC]">
              {displayedPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#6B7FA3]">
                    {filter === "PENDING"
                      ? "All pending UPI payments have been verified."
                      : "No payment records match your search."}
                  </td>
                </tr>
              ) : (
                displayedPayments.map((item) => {
                  const isLoading = loadingId === item.id;
                  const isPending = item.status === "PENDING";
                  const isCaptured = item.status === "CAPTURED";
                  const isFailed = item.status === "FAILED";

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* User Column with Truncation */}
                      <td className="py-3 px-4">
                        <div className="max-w-[200px]">
                          <p className="font-bold text-white text-sm truncate" title={item.userName}>
                            {item.userName}
                          </p>
                          <p className="text-[#6B7FA3] text-[11px] truncate" title={item.userEmail}>
                            {item.userEmail}
                          </p>
                        </div>
                      </td>

                      {/* Plan & Amount */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-white">₹{item.amount}</span>
                        <p className="text-[10px] text-[#A7B2CC] truncate max-w-[140px]" title={item.planName}>
                          {item.planName}
                        </p>
                      </td>

                      {/* UTR Number */}
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#050816] border border-[#24314F]">
                          <span className="text-white font-semibold text-xs">{item.utrNumber}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyUtr(item.utrNumber)}
                            className="text-[#6B7FA3] hover:text-white transition"
                            title="Copy UTR"
                          >
                            {copiedUtr === item.utrNumber ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Proof / Screenshot */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.screenshotUrl ? (
                          <button
                            type="button"
                            onClick={() => setActiveScreenshot(item.screenshotUrl)}
                            className="inline-flex items-center gap-1 text-[11px] text-[#3B82F6] hover:text-[#60A5FA] font-medium"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> View Proof
                          </button>
                        ) : (
                          <span className="text-[#6B7FA3] text-[11px]">UTR Only</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-[#A7B2CC] text-[11px] whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3" /> PENDING
                          </span>
                        )}
                        {isCaptured && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        )}
                        {isFailed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                            <XCircle className="w-3 h-3" /> REJECTED
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isPending ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleVerify(item.id)}
                              disabled={isLoading}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm transition disabled:opacity-50"
                            >
                              {isLoading ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              <span>Verify & Activate</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReject(item.id)}
                              disabled={isLoading}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition disabled:opacity-50"
                              title="Reject submission"
                            >
                              Reject
                            </button>
                          </div>
                        ) : isCaptured ? (
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                            <Crown className="w-3 h-3 text-yellow-400" /> Pro Active
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#6B7FA3]">Rejected</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination & Rows Selector Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#24314F] bg-[#0A1024]">
          {/* Bottom Left: Rows per page + Showing Range */}
          <div className="flex items-center gap-2 text-xs text-[#A7B2CC]">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#0D1730] border border-[#24314F] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-[#6B7FA3]">
              Showing {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} of {totalItems}
            </span>
          </div>

          {/* Bottom Right: Page Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg border border-[#24314F] bg-[#0D1730] text-[#A7B2CC] hover:text-white hover:bg-[#112040] disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .map((page, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && page - prev > 1;
                  return (
                    <span key={page} className="flex items-center gap-1">
                      {showEllipsis && <span className="text-xs text-[#6B7FA3] px-0.5">…</span>}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
                          safePage === page
                            ? "bg-[#3B82F6] text-white shadow-sm"
                            : "bg-[#0D1730] border border-[#24314F] text-[#A7B2CC] hover:text-white hover:bg-[#112040]"
                        }`}
                      >
                        {page}
                      </button>
                    </span>
                  );
                })}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages || totalItems === 0}
              className="p-1.5 rounded-lg border border-[#24314F] bg-[#0D1730] text-[#A7B2CC] hover:text-white hover:bg-[#112040] disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Screenshot Lightbox Modal */}
      {activeScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveScreenshot(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#0D1730] border border-[#24314F] rounded-xl p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#24314F]">
              <span className="text-xs font-bold text-white">Payment Proof Screenshot</span>
              <button
                type="button"
                onClick={() => setActiveScreenshot(null)}
                className="p-1 text-[#6B7FA3] hover:text-white rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="pt-3 max-h-[70vh] overflow-y-auto flex items-center justify-center">
              <img
                src={activeScreenshot}
                alt="Payment screenshot proof"
                className="rounded-lg max-w-full max-h-[60vh] object-contain border border-[#24314F]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
