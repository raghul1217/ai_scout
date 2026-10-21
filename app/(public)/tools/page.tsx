import type { Metadata } from "next";
import Link from "next/link";
import { Search, ExternalLink, Star, CheckCircle, Zap, Shield, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "AI Tools Directory | AI Scout",
  description: "Browse 150+ verified artificial intelligence tools across coding, productivity, design, audio, and reasoning.",
  alternates: { canonical: "/tools" },
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; pricing?: string }>;
}) {
  const { q, category, pricing } = await searchParams;

  let tools: any[] = [];
  let categories: any[] = [];

  try {
    const whereClause: any = {};

    if (q) {
      whereClause.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { tagline: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category && category !== "All") {
      whereClause.category = {
        slug: category,
      };
    }

    if (pricing && pricing !== "All") {
      whereClause.pricingType = pricing;
    }

    [tools, categories] = await Promise.all([
      prisma.aITool.findMany({
        where: whereClause,
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
      }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
  } catch (error) {
    console.warn("Error fetching tools:", error);
  }

  const pricingFilters = ["All", "FREE", "FREEMIUM", "PAID"];

  return (
    <div className="min-h-screen py-14 bg-[#050816] text-[#F8FAFC]">
      <div className="container-max">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-semibold text-[#10B981] mb-3">
            <Zap className="w-3.5 h-3.5" />
            Verified Tool Index
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            AI Tools Directory
          </h1>
          <p className="text-sm md:text-base text-[#A7B2CC] leading-relaxed">
            Curated and benchmarked software for developers, creatives, and enterprises. No sponsored spam.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search */}
            <form method="GET" action="/tools" className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7FA3]" />
              <input
                type="search"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search tools by name, utility, or framework…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1730] border border-[#24314F] text-sm text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#3B82F6] transition"
              />
            </form>

            {/* Pricing Filter Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B7FA3] mr-1 hidden sm:inline">Pricing:</span>
              {pricingFilters.map((p) => (
                <Link
                  key={p}
                  href={`/tools?pricing=${p}${category ? `&category=${category}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    (!pricing && p === "All") || pricing === p
                      ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                      : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:border-[#3B82F6]"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories Tab */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              href="/tools"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition whitespace-nowrap ${
                !category || category === "All"
                  ? "bg-[#10B981] text-white border-[#10B981]"
                  : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:border-[#10B981]"
              }`}
            >
              All Categories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/tools?category=${cat.slug}${pricing ? `&pricing=${pricing}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition whitespace-nowrap ${
                  category === cat.slug
                    ? "bg-[#10B981] text-white border-[#10B981]"
                    : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:border-[#10B981]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        {tools.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#24314F] rounded-2xl bg-[#0D1730]/40">
            <p className="text-base font-semibold text-white mb-2">No tools match your criteria</p>
            <p className="text-xs text-[#6B7FA3] mb-6">
              Try resetting your search query or pricing filter.
            </p>
            <Link
              href="/tools"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#24314F] text-white hover:bg-[#3B82F6] transition"
            >
              View All Tools
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="bg-[#0D1730] border border-[#24314F] hover:border-[#3B82F6] rounded-2xl p-6 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-[#60A5FA] uppercase tracking-wider">
                      {tool.category?.name ?? "AI Tool"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        tool.pricingType === "FREE"
                          ? "bg-[#16C784]/20 text-[#16C784]"
                          : tool.pricingType === "FREEMIUM"
                          ? "bg-[#3B82F6]/20 text-[#60A5FA]"
                          : "bg-[#F59E0B]/20 text-[#F59E0B]"
                      }`}
                    >
                      {tool.pricingType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-[#60A5FA] transition">
                      {tool.name}
                    </h2>
                    {tool.isVerified && (
                      <span title="Verified by AI Scout" className="text-[#16C784]">
                        <CheckCircle className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-[#9F67FF] mb-2">
                    {tool.tagline}
                  </p>

                  <p className="text-xs text-[#A7B2CC] line-clamp-3 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#24314F]/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#F59E0B] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{tool.rating.toFixed(1)}</span>
                    <span className="text-[#6B7FA3] font-normal text-[11px]">
                      ({tool.reviewCount})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-xs font-semibold text-[#A7B2CC] hover:text-white transition"
                    >
                      Overview
                    </Link>
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#112040] hover:bg-[#3B82F6] text-white border border-[#24314F] hover:border-[#3B82F6] transition"
                    >
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
