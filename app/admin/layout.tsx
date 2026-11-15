import { requireAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col md:flex-row">
      {/* Collapsible Sidebar with Icon-Only and Full-View modes */}
      <AdminSidebar admin={{ email: admin.email, name: admin.name }} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
