import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Star, ExternalLink, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage AI Tools | Admin | AI Scout",
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
            Review listed tools, ratings, and category assignments.
          </p>
        </div>
      </div>

      <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6">
        {tools.length === 0 ? (
          <p className="text-xs text-[#6B7FA3]">No tools listed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Pricing</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Featured</th>
                  <th className="pb-3">Verified</th>
                  <th className="pb-3">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24314F]/50 text-[#A7B2CC]">
                {tools.map((tool) => (
                  <tr key={tool.id}>
                    <td className="py-3 font-semibold text-white">{tool.name}</td>
                    <td className="py-3">{tool.category?.name ?? "General"}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#112040] text-white">
                        {tool.pricingType}
                      </span>
                    </td>
                    <td className="py-3 text-[#F59E0B] font-semibold">
                      ★ {tool.rating.toFixed(1)}
                    </td>
                    <td className="py-3">{tool.isFeatured ? "Yes" : "No"}</td>
                    <td className="py-3">{tool.isVerified ? "Yes" : "No"}</td>
                    <td className="py-3">
                      <Link
                        href={`/tools/${tool.slug}`}
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
