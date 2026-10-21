import type { Metadata } from "next";
import Link from "next/link";
import { Search, Calendar, Clock, Lock, Sparkles, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "AI News & Intelligence | AI Scout",
  description: "Curated updates on artificial intelligence, model releases, research benchmarks, and industry developments.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const { q, category, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const pageSize = 9;

  let articles: any[] = [];
  let totalArticles = 0;
  let categories: any[] = [];

  try {
    const whereClause: any = {
      status: "PUBLISHED",
    };

    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category && category !== "All") {
      whereClause.category = {
        slug: category,
      };
    }

    [articles, totalArticles, categories] = await Promise.all([
      prisma.article.findMany({
        where: whereClause,
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      }),
      prisma.article.count({ where: whereClause }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
  } catch (error) {
    console.warn("DB query fallback for news:", error);
  }

  const totalPages = Math.ceil(totalArticles / pageSize) || 1;

  return (
    <div className="min-h-screen py-14 bg-[#050816] text-[#F8FAFC]">
      <div className="container-max">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-xs font-semibold text-[#60A5FA] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Intelligence
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            AI News & Reports
          </h1>
          <p className="text-sm md:text-base text-[#A7B2CC] leading-relaxed">
            Filter through real developments in models, developer ecosystems, and AI products without hype or noise.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch md:items-center justify-between">
          <form method="GET" action="/news" className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7FA3]" />
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search news, topics, models…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1730] border border-[#24314F] text-sm text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#3B82F6] transition"
            />
          </form>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              href="/news"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition whitespace-nowrap ${
                !category || category === "All"
                  ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                  : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:border-[#3B82F6]"
              }`}
            >
              All Topics
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/news?category=${cat.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition whitespace-nowrap ${
                  category === cat.slug
                    ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                    : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:border-[#3B82F6]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#24314F] rounded-2xl bg-[#0D1730]/40">
            <p className="text-base font-semibold text-white mb-2">No articles found</p>
            <p className="text-xs text-[#6B7FA3] mb-6">
              Try adjusting your search criteria or topic filter.
            </p>
            <Link
              href="/news"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#24314F] text-white hover:bg-[#3B82F6] transition"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group relative bg-[#0D1730] border border-[#24314F] hover:border-[#3B82F6] rounded-2xl p-6 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-[#60A5FA] uppercase tracking-wider">
                      {article.category?.name ?? "Updates"}
                    </span>
                    {article.accessLevel === "PREMIUM" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#7C3AED]/20 text-[#9F67FF] border border-[#7C3AED]/40">
                        <Lock className="w-2.5 h-2.5" />
                        PREMIUM
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-white group-hover:text-[#60A5FA] transition leading-snug mb-3">
                    {article.title}
                  </h2>

                  <p className="text-xs text-[#A7B2CC] line-clamp-3 leading-relaxed mb-6">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6B7FA3] pt-4 border-t border-[#24314F]/50">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.publishedAt ? formatDate(article.publishedAt) : "Recent"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTimeMinutes} min read
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {currentPage > 1 && (
              <Link
                href={`/news?page=${currentPage - 1}${category ? `&category=${category}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0D1730] border border-[#24314F] text-[#A7B2CC] hover:text-white transition"
              >
                Previous
              </Link>
            )}
            <span className="px-4 py-2 rounded-lg text-xs font-bold bg-[#3B82F6] text-white">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/news?page=${currentPage + 1}${category ? `&category=${category}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0D1730] border border-[#24314F] text-[#A7B2CC] hover:text-white transition"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
