import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { FileText, Plus, Lock, CheckCircle, Edit3 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Articles | Admin | AI Scout",
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

      <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6">
        {articles.length === 0 ? (
          <p className="text-xs text-[#6B7FA3]">No articles created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Access</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24314F]/50 text-[#A7B2CC]">
                {articles.map((art) => (
                  <tr key={art.id}>
                    <td className="py-3 font-semibold text-white max-w-xs truncate">
                      {art.title}
                    </td>
                    <td className="py-3">{art.category?.name ?? "General"}</td>
                    <td className="py-3">
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
                    <td className="py-3">
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
                    <td className="py-3">{formatDate(art.createdAt)}</td>
                    <td className="py-3">
                      <Link
                        href={`/news/${art.slug}`}
                        target="_blank"
                        className="text-[#60A5FA] hover:underline"
                      >
                        View
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
