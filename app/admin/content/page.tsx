import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { FileText, Plus, Lock, CheckCircle, Edit3 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Articles | Admin | Savzyen",
};

export default async function AdminContentPage() {
  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("DB not ready in admin content page:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">News & Articles</h1>
          <p className="text-xs text-[#A7B2CC] mt-1">
            Manage published news, status gates, and access levels.
          </p>
        </div>
      </div>

      <div className="bg-[#0D1730] border border-[#24314F] rounded-xl overflow-hidden shadow-xl">
        {articles.length === 0 ? (
          <p className="p-6 text-xs text-[#6B7FA3]">No articles created yet.</p>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider bg-[#0A1024]">
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Access</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24314F]/50 text-[#A7B2CC]">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white max-w-[260px] truncate" title={art.title}>
                      {art.title}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{art.category?.name ?? "General"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          art.accessLevel === "PREMIUM"
                            ? "bg-[#7C3AED]/20 text-[#9F67FF]"
                            : "bg-[#10B981]/20 text-[#10B981]"
                        }`}
                      >
                        {art.accessLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          art.status === "PUBLISHED"
                            ? "bg-[#16C784]/20 text-[#16C784]"
                            : "bg-[#F59E0B]/20 text-[#F59E0B]"
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[#6B7FA3]">{formatDate(art.createdAt)}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/news/${art.slug}`}
                        target="_blank"
                        className="text-[#60A5FA] hover:underline font-semibold"
                      >
                        View →
                      </Link>
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
