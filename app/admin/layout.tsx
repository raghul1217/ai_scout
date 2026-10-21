import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { LayoutDashboard, FileText, Wrench, GraduationCap, Users, RefreshCw, Settings, ShieldAlert, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "News & Articles", href: "/admin/content", icon: FileText },
    { label: "AI Tools", href: "/admin/tools", icon: Wrench },
    { label: "Learning Vault", href: "/admin/learn", icon: GraduationCap },
    { label: "Google Sheets Sync", href: "/admin/sync", icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0A1024] border-r border-[#24314F] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Admin Control</span>
            </div>
            <h2 className="text-lg font-black text-white">AI Scout HQ</h2>
            <p className="text-xs text-[#6B7FA3] mt-0.5">{admin.email}</p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#A7B2CC] hover:text-white hover:bg-[#112040] transition"
                >
                  <Icon className="w-4 h-4 text-[#60A5FA]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#24314F] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-[#6B7FA3] hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
