import type { Metadata } from "next";
import Link from "next/link";
import { Search, Calendar, Clock, Lock, Sparkles, Crown } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { FEATURED_ARTICLES } from "@/lib/news/featured-news";

export const metadata: Metadata = {
  title: "AI News & Intelligence | Savzyen",
  description:
    "Curated updates on artificial intelligence, model releases, research benchmarks, and industry developments.",
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

  let dbArticles: any[] = [];
  let dbTotal = 0;
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

    [dbArticles, dbTotal, categories] = await Promise.all([
      prisma.article.findMany({
        where: whereClause,
        include: { category: true },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      }),
      prisma.article.count({ where: whereClause }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
  } catch (error) {
    console.warn("DB query fallback for news:", error);
  }

  // Prepend all featured news articles (including the remaining ones: Operator, Gemini 2.0, DeepSeek-V3)
  const featuredNewsItems = FEATURED_ARTICLES.map((fa) => ({
    id: fa.id,
    slug: fa.slug,
    title: fa.title,
    summary: fa.summary,
    coverImage: fa.imageUrl,
    accessLevel: fa.accessLevel,
    readTimeMinutes: fa.readTimeMinutes,
    publishedAt: new Date(),
    category: {
      id: fa.id,
      name: fa.category,
      slug: fa.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    },
  }));

  const dbSlugs = new Set(dbArticles.map((a) => a.slug));
  const filteredFeatured = featuredNewsItems.filter((fa) => {
    if (dbSlugs.has(fa.slug)) return false;
    if (q) {
      const query = q.toLowerCase();
      if (!fa.title.toLowerCase().includes(query) && !fa.summary.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (category && category !== "All") {
      if (fa.category.slug !== category) return false;
    }
    return true;
  });

  const articles = [...filteredFeatured, ...dbArticles];
  const totalArticles = dbTotal + filteredFeatured.length;
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
            {articles.map((article) => {
              const isPremium = article.accessLevel === "PREMIUM";

              return (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group relative bg-[#0D1730] border border-[#24314F] hover:border-[#7C3AED]/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Thumbnail if coverImage exists */}
                    {article.coverImage && (
                      <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[#070B1E] mb-4 flex items-center justify-center border border-[#24314F]/60">
                        <img
                          src={article.coverImage}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-lg opacity-35 scale-110 pointer-events-none"
                        />
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="relative z-10 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold text-[#60A5FA] uppercase tracking-wider">
                        {article.category?.name ?? "Updates"}
                      </span>
                      {isPremium ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7C3AED]/25 text-[#C4B5FD] border border-[#7C3AED]/50">
                          <Lock className="w-2.5 h-2.5 text-yellow-300" />
                          PRO ONLY
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          FREE
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition leading-snug mb-3 line-clamp-2">
                      {article.title}
                    </h2>

                    {isPremium ? (
                      <div className="space-y-2 mb-4">
                        <p className="text-xs text-[#A7B2CC] line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-yellow-400 bg-yellow-500/10 border border-yellow-500/25 px-2.5 py-1 rounded-lg w-fit">
                          <Crown className="w-3 h-3 text-yellow-400" />
                          <span>Pro Members Only • Click to Unlock</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#A7B2CC] line-clamp-3 leading-relaxed mb-6">
                        {article.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6B7FA3] pt-4 border-t border-[#24314F]/50">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      {article.publishedAt ? formatDate(article.publishedAt) : "Recent"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#60A5FA]" />
                      {article.readTimeMinutes} min read
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-[#24314F]/50">
            <p className="text-xs text-[#6B7FA3]">
              Showing <span className="text-white font-semibold">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalArticles)}</span> of{" "}
              <span className="text-white font-semibold">{totalArticles}</span> articles
            </p>

            <div className="flex items-center gap-1.5">
              {currentPage > 1 && (
                <Link
                  href={`/news?page=${currentPage - 1}${category ? `&category=${category}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0D1730] border border-[#24314F] text-[#A7B2CC] hover:text-white hover:border-[#3B82F6] transition"
                >
                  Previous
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/news?page=${p}${category ? `&category=${category}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition border ${
                    p === currentPage
                      ? "bg-[#3B82F6] border-[#3B82F6] text-white"
                      : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:border-[#3B82F6]"
                  }`}
                >
                  {p}
                </Link>
              ))}

              {currentPage < totalPages && (
                <Link
                  href={`/news?page=${currentPage + 1}${category ? `&category=${category}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0D1730] border border-[#24314F] text-[#A7B2CC] hover:text-white hover:border-[#3B82F6] transition"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
