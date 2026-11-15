"use client";

import { useState } from "react";
import {
  Users,
  Crown,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Mail,
  Loader2,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isPremium: boolean;
  membership: {
    id: string;
    planName: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
  } | null;
  recentPaymentsCount: number;
  createdAt: string;
}

export function UsersDirectoryClient({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [filter, setFilter] = useState<"ALL" | "PRO" | "FREE" | "ADMIN">("ALL");
  const [search, setSearch] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editRole, setEditRole] = useState<"USER" | "ADMIN">("USER");
  const [editIsPremium, setEditIsPremium] = useState<boolean>(false);
  const [sendEmail, setSendEmail] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal State
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback Notification
  const [banner, setBanner] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const openEditModal = (u: UserItem) => {
    setEditingUser(u);
    setEditRole(u.role);
    setEditIsPremium(u.isPremium);
    setSendEmail(true);
    setBanner(null);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: editRole,
          isPremium: editIsPremium,
          durationDays: 365,
          sendConfirmationEmail: sendEmail && editIsPremium && !editingUser.isPremium,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === editingUser.id) {
            return {
              ...u,
              role: editRole,
              isPremium: editIsPremium,
              membership: editIsPremium
                ? {
                    id: u.membership?.id || "mem_" + Date.now(),
                    planName: "SAVZYEN Premium",
                    status: "ACTIVE",
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                  }
                : null,
            };
          }
          return u;
        })
      );

      setBanner({ text: data.message || "User updated successfully!", type: "success" });
      setEditingUser(null);
    } catch (err: any) {
      setBanner({ text: err.message || "Failed to update user", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setBanner({ text: data.message || "User permanently deleted.", type: "success" });
      setDeletingUser(null);

      // Reset to page 1 if current page becomes empty
      if (displayedUsers.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    } catch (err: any) {
      setBanner({ text: err.message || "Error deleting user", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered dataset
  const filtered = users.filter((u) => {
    if (filter === "PRO" && !u.isPremium) return false;
    if (filter === "FREE" && u.isPremium) return false;
    if (filter === "ADMIN" && u.role !== "ADMIN") return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const displayedUsers = filtered.slice(startIndex, endIndex);

  const proCount = users.filter((u) => u.isPremium).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Users & Member Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {users.length} Users
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-yellow-400 border border-yellow-500/30">
              {proCount} Pro
            </span>
          </div>
          <p className="text-xs text-[#A7B2CC] mt-1">
            Manage user access, upgrade to SAVZYEN Premium, edit roles, or remove accounts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#6B7FA3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0D1730] border border-[#24314F] text-xs text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>
      </div>

      {/* Banner Message */}
      {banner && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between animate-fade-in ${
            banner.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          <span>{banner.text}</span>
          <button onClick={() => setBanner(null)} className="opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: "ALL", label: `All Users (${users.length})` },
          { key: "PRO", label: `👑 Pro Members (${proCount})` },
          { key: "FREE", label: `Free Tier (${users.length - proCount})` },
          { key: "ADMIN", label: `Admins (${users.filter((u) => u.role === "ADMIN").length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setFilter(tab.key as any);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
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
        {/* Horizontal Scroll Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider bg-[#0A1024]">
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Membership Tier</th>
                <th className="py-3 px-4 font-semibold">Platform Role</th>
                <th className="py-3 px-4 font-semibold">Pro Valid Until</th>
                <th className="py-3 px-4 font-semibold">Joined Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24314F]/50 text-[#A7B2CC]">
              {displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#6B7FA3]">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                displayedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* User: Avatar + Name + Email with Text Truncation */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5 max-w-[240px]">
                        <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="font-bold text-white text-sm truncate"
                            title={u.name}
                          >
                            {u.name}
                          </p>
                          <p
                            className="text-[#6B7FA3] text-[11px] truncate"
                            title={u.email}
                          >
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Membership Tier */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {u.isPremium ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-yellow-400 border border-yellow-500/30">
                          <Crown className="w-3 h-3" /> SAVZYEN Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Free Community
                        </span>
                      )}
                    </td>

                    {/* Platform Role */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {u.role === "ADMIN" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          ADMIN
                        </span>
                      ) : (
                        <span className="text-[#6B7FA3]">USER</span>
                      )}
                    </td>

                    {/* Pro Valid Until */}
                    <td className="py-3 px-4 text-[11px] whitespace-nowrap">
                      {u.membership?.endDate ? (
                        <span className="text-white font-medium">
                          {new Date(u.membership.endDate).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      ) : u.isPremium && u.role === "ADMIN" ? (
                        <span className="text-[#6B7FA3]">Unlimited (Admin)</span>
                      ) : (
                        <span className="text-[#6B7FA3]">—</span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 px-4 text-[11px] text-[#6B7FA3] whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions: Edit & Delete Buttons */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#112040] hover:bg-[#3B82F6] text-[#A7B2CC] hover:text-white border border-[#24314F] hover:border-[#3B82F6] transition"
                          title="Edit user role & membership"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingUser(u)}
                          className="p-1.5 rounded-lg text-xs font-semibold bg-[#112040] hover:bg-red-500/20 text-[#6B7FA3] hover:text-red-400 border border-[#24314F] hover:border-red-500/30 transition"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: Edit User & Membership
      ───────────────────────────────────────────────────────────── */}
      {editingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setEditingUser(null)}
        >
          <div
            className="relative max-w-md w-full bg-[#0D1730] border border-[#24314F] rounded-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#24314F]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#60A5FA]" />
                <h3 className="text-sm font-bold text-white">Edit User Access</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 text-[#6B7FA3] hover:text-white rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 mt-4">
              {/* User Readonly Profile */}
              <div className="p-3 rounded-lg bg-[#050816] border border-[#24314F]">
                <p className="text-[11px] text-[#6B7FA3]">User Profile</p>
                <p className="text-sm font-bold text-white truncate" title={editingUser.name}>
                  {editingUser.name}
                </p>
                <p className="text-xs text-[#A7B2CC] truncate" title={editingUser.email}>
                  {editingUser.email}
                </p>
              </div>

              {/* Membership Tier Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A7B2CC] block">
                  Membership Tier
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditIsPremium(false)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                      !editIsPremium
                        ? "bg-[#112040] text-white border-[#3B82F6]"
                        : "bg-[#050816] text-[#A7B2CC] border-[#24314F] hover:border-[#3B82F6]"
                    }`}
                  >
                    Free Community
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditIsPremium(true)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      editIsPremium
                        ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white border-transparent shadow-md shadow-purple-500/20"
                        : "bg-[#050816] text-yellow-400 border-[#24314F] hover:border-[#7C3AED]"
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 text-yellow-300" />
                    SAVZYEN Pro (₹499)
                  </button>
                </div>
              </div>

              {/* Platform Role Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A7B2CC] block">
                  Platform Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#050816] border border-[#24314F] text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                >
                  <option value="USER">USER (Learner / Builder)</option>
                  <option value="ADMIN">ADMIN (Full Dashboard Access)</option>
                </select>
              </div>

              {/* Send Email Checkbox (Only if upgrading to Pro) */}
              {editIsPremium && !editingUser.isPremium && (
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/25 space-y-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="mt-0.5 rounded border-[#24314F] text-[#7C3AED] focus:ring-0"
                    />
                    <span className="text-[#E2E8F0]">
                      <strong>Send Activation Email:</strong> Notify user via Resend that their payment is verified and Pro is active.
                    </span>
                  </label>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#050816] hover:bg-[#112040] text-[#A7B2CC] border border-[#24314F] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: Delete User Confirmation Dialog
      ───────────────────────────────────────────────────────────── */}
      {deletingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setDeletingUser(null)}
        >
          <div
            className="relative max-w-sm w-full bg-[#0D1730] border border-red-500/40 rounded-xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete User Account?</h3>
                <p className="text-xs text-[#6B7FA3]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#A7B2CC] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white">{deletingUser.name}</strong> ({deletingUser.email})?
              All associated memberships, sessions, and payments will be removed.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#050816] hover:bg-[#112040] text-[#A7B2CC] border border-[#24314F] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <span>Delete User</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
