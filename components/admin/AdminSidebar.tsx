"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Wrench,
  GraduationCap,
  Users,
  RefreshCw,
  CreditCard,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
} from "lucide-react";

interface AdminSidebarProps {
  admin: {
    email: string;
    name?: string;
  };
}

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "UPI Verifications", href: "/admin/payments", icon: CreditCard },
  { label: "Users & Members", href: "/admin/users", icon: Users },
  { label: "News & Articles", href: "/admin/content", icon: FileText },
  { label: "AI Tools", href: "/admin/tools", icon: Wrench },
  { label: "Learning Vault", href: "/admin/learn", icon: GraduationCap },
  { label: "Google Sheets Sync", href: "/admin/sync", icon: RefreshCw },
];

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync preference with localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("savzyen_admin_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("savzyen_admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <aside
      className={`bg-[#0A1024] border-r border-[#24314F] flex flex-col justify-between shrink-0 transition-[width] duration-300 ease-in-out relative ${
        isCollapsed ? "w-[72px] p-3" : "w-64 p-5"
      }`}
    >
      <div className="space-y-6">
        {/* Top Header & Collapse Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-[#24314F]/50">
          {!isCollapsed ? (
            <div className="min-w-0 flex-1 pr-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                  Admin Control
                </span>
              </div>
              <h2 className="text-base font-black text-white truncate">Savzyen HQ</h2>
              <p className="text-[11px] text-[#6B7FA3] truncate" title={admin.email}>
                {admin.email}
              </p>
            </div>
          ) : (
            <div className="mx-auto mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse block" title="Admin Control" />
            </div>
          )}

          {/* Toggle Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-[#6B7FA3] hover:text-white hover:bg-white/5 border border-transparent hover:border-[#24314F] transition shrink-0"
            title={isCollapsed ? "Expand sidebar (Full View)" : "Collapse sidebar (Icon-Only Mode)"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#60A5FA]" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-xl text-xs font-semibold transition-all group ${
                  isCollapsed
                    ? "justify-center p-2.5"
                    : "gap-3 px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/20"
                    : "text-[#A7B2CC] hover:text-white hover:bg-[#112040]"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`shrink-0 transition-transform ${
                    isCollapsed ? "w-5 h-5" : "w-4 h-4"
                  } ${isActive ? "text-white" : "text-[#60A5FA] group-hover:scale-105"}`}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer: Return to Website */}
      <div className="pt-4 border-t border-[#24314F]/60">
        <Link
          href="/"
          className={`flex items-center rounded-xl text-xs font-medium text-[#6B7FA3] hover:text-white hover:bg-white/5 transition ${
            isCollapsed ? "justify-center p-2" : "gap-2 px-3 py-2"
          }`}
          title={isCollapsed ? "Return to Website" : undefined}
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span className="truncate">Return to Website</span>}
        </Link>
      </div>
    </aside>
  );
}

