import type { Metadata } from "next";
import Link from "next/link";
import { Search, Zap } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { ToolCard } from "@/components/tools/ToolCard";
import { BEST_OF_AI_TOOLS, syncBestOfAITools } from "@/lib/tools/bestofai";

export const metadata: Metadata = {
  title: "AI Tools Directory | Savzen",
  description:
    "Browse 150+ verified artificial intelligence tools across coding, productivity, design, and reasoning, benchmarked and synchronized with Best of AI.",
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

    // If database has very few tools and no search filter is active, automatically populate from Best of AI catalog
    if (
      tools.length < 8 &&
      !q &&
      (!category || category === "All") &&
      (!pricing || pricing === "All")
    ) {
      try {
        await syncBestOfAITools();
        [tools, categories] = await Promise.all([
          prisma.aITool.findMany({
            where: whereClause,
            include: { category: true },
            orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
          }),
          prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
        ]);
      } catch (syncErr) {
        console.warn("Auto-sync from Best of AI skipped:", syncErr);
      }
    }
  } catch (error) {
    console.warn("Error fetching tools from DB:", error);
  }

  // Resilient fallback if DB had an issue or returns empty on default view
  if (tools.length === 0 && !q && (!category || category === "All") && (!pricing || pricing === "All")) {
    tools = BEST_OF_AI_TOOLS.map((t) => ({
      id: t.slug,
      slug: t.slug,
      name: t.name,
      tagline: t.tagline,
      description: t.description,
      websiteUrl: t.websiteUrl,
      logoUrl: t.logoUrl,
      pricingType: t.pricingType,
      priceStart: t.priceStart,
      isVerified: t.isVerified,
      rating: t.rating,
      reviewCount: t.reviewCount,
      category: {
        name: t.categoryName,
        slug: t.categorySlug,
      },
    }));
  }

  const pricingFilters = ["All", "FREE", "FREEMIUM", "PAID"];

  return (
    <div className="min-h-screen py-12 bg-[#050816] text-[#F8FAFC]">
      <div className="container-max">
        {/* Header */}
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-semibold text-[#10B981] mb-3">
            <Zap className="w-3.5 h-3.5" />
            Verified Tool Index • Best of AI
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            AI Tools Directory
          </h1>
          <p className="text-sm md:text-base text-[#A7B2CC] leading-relaxed">
            Curated and benchmarked software for developers, creatives, and enterprises. Synchronized with Best of AI repository standards.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4 mb-8">
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
              href={`/tools${pricing ? `?pricing=${pricing}` : ""}${q ? `${pricing ? "&" : "?"}q=${encodeURIComponent(q)}` : ""}`}
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

        {/* Tools Count Indicator */}
        <div className="flex items-center justify-between text-xs text-[#6B7FA3] mb-4 px-1">
          <span>Showing {tools.length} curated AI tools</span>
          {category && category !== "All" && (
            <span>Category: <strong className="text-white capitalize">{category.replace("-", " ")}</strong></span>
          )}
        </div>

        {/* Small Tools Grid (4 columns on desktop, like Best of AI) */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
