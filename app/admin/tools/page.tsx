import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Star, ExternalLink, CheckCircle } from "lucide-react";
import { SyncBestOfAIButton } from "@/components/admin/SyncBestOfAIButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage AI Tools | Admin | Savzyen",
};

export default async function AdminToolsPage() {
  let tools: any[] = [];
  try {
    tools = await prisma.aITool.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("DB not ready in admin tools page:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">AI Tools Directory</h1>
          <p className="text-xs text-[#A7B2CC] mt-1">
            Review listed tools, ratings, and category assignments synchronized from Best of AI.
          </p>
        </div>
        <SyncBestOfAIButton />
      </div>

      <div className="bg-[#0D1730] border border-[#24314F] rounded-xl overflow-hidden shadow-xl">
        {tools.length === 0 ? (
          <p className="p-6 text-xs text-[#6B7FA3]">No tools listed yet.</p>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider bg-[#0A1024]">
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Pricing</th>
                  <th className="py-3 px-4 font-semibold">Rating</th>
                  <th className="py-3 px-4 font-semibold">Featured</th>
                  <th className="py-3 px-4 font-semibold">Verified</th>
                  <th className="py-3 px-4 font-semibold text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24314F]/50 text-[#A7B2CC]">
                {tools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white max-w-[200px] truncate" title={tool.name}>
                      {tool.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{tool.category?.name ?? "General"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#112040] text-white">
                        {tool.pricingType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#F59E0B] font-semibold whitespace-nowrap">
                      ★ {tool.rating.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{tool.isFeatured ? "Yes" : "No"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{tool.isVerified ? "Yes" : "No"}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/tools/${tool.slug}`}
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
