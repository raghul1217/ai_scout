import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Note: user session will be fetched here once auth is wired up in Phase 3
// For now, server-side session check placeholder
async function getSessionUser() {
  // Will be replaced with: return await auth.getSession()
  return null;
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
