import type { Metadata } from "next";
import Link from "next/link";
import { Search, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { ToolCard } from "@/components/tools/ToolCard";
import { BEST_OF_AI_TOOLS, syncBestOfAITools } from "@/lib/tools/bestofai";

export const metadata: Metadata = {
  title: "AI Tools Directory | Savzyen",
  description:
    "Browse 500+ verified artificial intelligence tools across coding, productivity, design, and reasoning, benchmarked and updated regularly.",
  alternates: { canonical: "/tools" },
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; pricing?: string; page?: string }>;
}) {
  const { q, category, pricing, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const PAGE_SIZE = 48;

  let tools: any[] = [];
  let categories: any[] = [];
  let totalTools = 0;

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

    [totalTools, tools, categories] = await Promise.all([
      prisma.aITool.count({ where: whereClause }),
      prisma.aITool.findMany({
        where: whereClause,
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    // If database has very few tools and no search filter is active, automatically populate catalog
    if (
      totalTools < 8 &&
      !q &&
      (!category || category === "All") &&
      (!pricing || pricing === "All")
    ) {
      try {
        await syncBestOfAITools();
        [totalTools, tools, categories] = await Promise.all([
          prisma.aITool.count({ where: whereClause }),
          prisma.aITool.findMany({
            where: whereClause,
            include: { category: true },
            orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
            skip: (currentPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
          }),
          prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
        ]);
      } catch (syncErr) {
        console.warn("Auto-sync skipped:", syncErr);
      }
    }
  } catch (error) {
    console.warn("Error fetching tools from DB:", error);
  }

  // Resilient fallback if DB had an issue or returns empty on default view
  if (tools.length === 0 && !q && (!category || category === "All") && (!pricing || pricing === "All")) {
    totalTools = BEST_OF_AI_TOOLS.length;
    tools = BEST_OF_AI_TOOLS.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((t) => ({
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

  const totalPages = Math.max(1, Math.ceil(totalTools / PAGE_SIZE));
  const pricingFilters = ["All", "FREE", "FREEMIUM", "PAID"];

  // Helper to build URL with query params
  const buildUrl = (newParams: { page?: number; category?: string; pricing?: string; q?: string }) => {
    const params = new URLSearchParams();
    const effectiveCategory = newParams.category !== undefined ? newParams.category : category;
    const effectivePricing = newParams.pricing !== undefined ? newParams.pricing : pricing;
    const effectiveQ = newParams.q !== undefined ? newParams.q : q;
    const effectivePage = newParams.page !== undefined ? newParams.page : currentPage;

    if (effectiveQ) params.set("q", effectiveQ);
    if (effectiveCategory && effectiveCategory !== "All") params.set("category", effectiveCategory);
    if (effectivePricing && effectivePricing !== "All") params.set("pricing", effectivePricing);
    if (effectivePage && effectivePage > 1) params.set("page", effectivePage.toString());

    const qs = params.toString();
    return `/tools${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen py-12 bg-[#050816] text-[#F8FAFC]">
      <div className="container-max">
        {/* Header */}
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-semibold text-[#10B981] mb-3">
            <Zap className="w-3.5 h-3.5" />
            Verified Tool Index • 500+ Curated AI Tools
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            AI Tools Directory
          </h1>
          <p className="text-sm md:text-base text-[#A7B2CC] leading-relaxed">
            Curated, benchmarked, and categorized software for developers, creatives, and enterprises. Explore top-rated free and freemium AI tools.
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
                placeholder="Search tools by name, utility, or keyword…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1730] border border-[#24314F] text-sm text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#3B82F6] transition"
              />
              {category && category !== "All" && (
                <input type="hidden" name="category" value={category} />
              )}
              {pricing && pricing !== "All" && (
                <input type="hidden" name="pricing" value={pricing} />
              )}
            </form>

            {/* Pricing Filter Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B7FA3] mr-1 hidden sm:inline">Pricing:</span>
              {pricingFilters.map((p) => (
                <Link
                  key={p}
                  href={buildUrl({ pricing: p, page: 1 })}
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
              href={buildUrl({ category: "All", page: 1 })}
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
                href={buildUrl({ category: cat.slug, page: 1 })}
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
          <span>
            Showing {totalTools === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, totalTools)} of {totalTools} curated AI tools
          </span>
          {category && category !== "All" && (
            <span>
              Category: <strong className="text-white capitalize">{category.replace("-", " ")}</strong>
            </span>
          )}
        </div>

        {/* Tools Grid (4 columns on desktop) */}
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <Link
              href={buildUrl({ page: Math.max(1, currentPage - 1) })}
              aria-disabled={currentPage <= 1}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                currentPage <= 1
                  ? "pointer-events-none opacity-40 bg-[#0D1730] border-[#24314F] text-[#6B7FA3]"
                  : "bg-[#0D1730] hover:bg-[#112040] border-[#24314F] hover:border-[#3B82F6] text-white"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Link>

            <span className="text-xs font-semibold text-[#A7B2CC] px-3">
              Page <strong className="text-white">{currentPage}</strong> of{" "}
              <strong className="text-white">{totalPages}</strong>
            </span>

            <Link
              href={buildUrl({ page: Math.min(totalPages, currentPage + 1) })}
              aria-disabled={currentPage >= totalPages}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                currentPage >= totalPages
                  ? "pointer-events-none opacity-40 bg-[#0D1730] border-[#24314F] text-[#6B7FA3]"
                  : "bg-[#0D1730] hover:bg-[#112040] border-[#24314F] hover:border-[#3B82F6] text-white"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
