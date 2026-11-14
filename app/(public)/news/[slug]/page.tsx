import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Lock,
  Crown,
  ArrowRight,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { FEATURED_ARTICLES } from "@/lib/news/featured-news";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // 1. Check in static featured articles
  const featured = FEATURED_ARTICLES.find((a) => a.slug === slug);
  if (featured) {
    return {
      title: `${featured.title} | Savzyen News`,
      description: featured.summary,
      alternates: { canonical: `/news/${slug}` },
    };
  }

  // 2. Check in database
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { title: true, summary: true },
    });

    if (article) {
      return {
        title: `${article.title} | Savzyen`,
        description: article.summary,
        alternates: { canonical: `/news/${slug}` },
      };
    }
  } catch (error) {
    console.warn("DB metadata query error:", error);
  }

  return { title: "Article Not Found | Savzyen" };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  // ─── 1. Check if it matches a Featured Article ───
  const featured = FEATURED_ARTICLES.find((a) => a.slug === slug);

  if (featured) {
    const otherFeatured = FEATURED_ARTICLES.filter((a) => a.slug !== slug);
    const isPremiumRequired = featured.accessLevel === "PREMIUM";
    const hasAccess = !isPremiumRequired || (user && user.isPremium);

    return (
      <article className="min-h-screen py-14 sm:py-20 bg-[#050816] text-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back navigation */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#60A5FA] hover:text-white transition mb-8 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All News</span>
          </Link>

          {/* Article Header */}
          <header className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${featured.categoryColor}`}>
                {featured.category}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-md ${
                  featured.badge === "Breaking"
                    ? "bg-red-500/20 text-red-300 border-red-500/40"
                    : featured.badge === "Analysis"
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}
              >
                {featured.badge}
              </span>

              {isPremiumRequired ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#7C3AED]/25 text-[#C4B5FD] border border-[#7C3AED]/50">
                  <Lock className="w-3 h-3 text-yellow-300" />
                  <span>PRO REPORT</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span>FREE ACCESS</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {featured.title}
            </h1>

            {featured.subtitle && (
              <p className="text-base sm:text-lg text-[#A7B2CC] leading-relaxed">
                {featured.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7FA3] pt-4 border-t border-[#24314F]">
              <span>
                By <strong className="text-white">{featured.authorName}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                {featured.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#60A5FA]" />
                {featured.readTimeMinutes} min read
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {featured.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#112040] text-[#A7B2CC] border border-[#24314F]"
                >
                  <Tag className="w-3 h-3 text-[#60A5FA]" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Hero Image Showcase (Proper aspect ratio handling for both landscape and portrait) */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#24314F] bg-[#070B1E] mb-10 flex items-center justify-center p-3 sm:p-6 shadow-2xl">
            {/* Ambient blurred backdrop to fit any size seamlessly */}
            <img
              src={featured.imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110 pointer-events-none"
            />
            {/* Crisp foreground graphic */}
            <img
              src={featured.imageUrl}
              alt={featured.imageAlt}
              className="relative z-10 max-h-[500px] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>

          {/* Summary Callout Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0D1730] to-[#112040] border border-[#24314F] mb-10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#60A5FA]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Takeaway</span>
            </div>
            <p className="text-sm sm:text-base text-[#F8FAFC] leading-relaxed font-medium">
              {featured.summary}
            </p>
          </div>

          {/* ─── FULL CONTENT OR PREMIUM BLURRED PAYWALL ─── */}
          {hasAccess ? (
            /* Clear, unlocked view for Free article or Pro users */
            <div className="space-y-8 text-[#D1D5DB] text-sm sm:text-base leading-relaxed">
              {featured.sections.map((sec, idx) => (
                <section key={idx} className="space-y-4">
                  {sec.heading && (
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-3">
                      {sec.heading}
                    </h2>
                  )}

                  {sec.paragraphs.map((para, pIdx) => (
                    <p key={pIdx} className="leading-relaxed text-[#D1D5DB]">
                      {para}
                    </p>
                  ))}

                  {sec.bulletPoints && (
                    <div className="grid gap-3 pt-2">
                      {sec.bulletPoints.map((bp) => (
                        <div
                          key={bp.label}
                          className="p-4 rounded-xl bg-[#0D1730] border border-[#24314F] hover:border-[#3B82F6]/50 transition-all flex gap-3.5"
                        >
                          <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-[#60A5FA] flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-white">
                              {bp.label}
                            </p>
                            <p className="text-xs sm:text-sm text-[#A7B2CC] mt-0.5 leading-relaxed">
                              {bp.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.callout && (
                    <div
                      className={`p-5 rounded-2xl border my-6 ${
                        sec.callout.type === "warning"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                          : sec.callout.type === "insight"
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-200"
                          : "bg-blue-500/10 border-blue-500/30 text-blue-200"
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{sec.callout.title}</span>
                      </p>
                      <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                        {sec.callout.text}
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          ) : (
            /* Premium Gate: Teaser + Blurred Content + Pro Upgrade Callout */
            <div className="space-y-6">
              {/* Teaser: Section 1's opening */}
              {featured.sections[0] && (
                <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#D1D5DB]">
                  {featured.sections[0].heading && (
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2">
                      {featured.sections[0].heading}
                    </h2>
                  )}
                  {featured.sections[0].paragraphs.slice(0, 2).map((p, pIdx) => (
                    <p key={pIdx} className="leading-relaxed text-[#D1D5DB]">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {/* Blurred Remaining Content */}
              <div className="relative">
                <div className="relative select-none pointer-events-none filter blur-[3.5px] opacity-30 space-y-6 pt-4 max-h-[380px] overflow-hidden">
                  {featured.sections.slice(1).map((sec, idx) => (
                    <div key={idx} className="space-y-3">
                      <h3 className="text-xl font-bold text-white">{sec.heading}</h3>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-[#D1D5DB]">{p}</p>
                      ))}
                    </div>
                  ))}
                </div>

                {/* High-conversion Savzyen Pro Gate Card */}
                <div className="relative -mt-40 z-20 rounded-3xl p-8 sm:p-10 border border-[#7C3AED]/60 bg-gradient-to-b from-[#0D1730]/95 via-[#0D1730] to-[#112040] shadow-2xl shadow-[#7C3AED]/20 text-center space-y-5 backdrop-blur-xl">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED]/30 to-[#3B82F6]/20 border border-[#7C3AED]/50 flex items-center justify-center mx-auto text-[#9F67FF] shadow-lg shadow-purple-500/20">
                    <Crown className="w-7 h-7 text-yellow-400" />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                      <Lock className="w-3.5 h-3.5" />
                      Savzyen Pro Exclusive
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Unlock Full Intelligence Report
                    </h2>
                    <p className="text-xs sm:text-sm text-[#A7B2CC] max-w-md mx-auto leading-relaxed">
                      This analysis contains verified operational root causes, technical architecture breakdowns, and post-mortem metrics available to Savzyen Pro members.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                      href="/register?plan=pro"
                      className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 transition shadow-lg shadow-[#7C3AED]/30 flex items-center justify-center gap-2"
                    >
                      <Crown className="w-4 h-4 text-yellow-300" />
                      <span>Join Pro • ₹499/year</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {!user && (
                      <Link
                        href={`/login?returnUrl=/news/${featured.slug}`}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#112040] border border-[#24314F] text-[#A7B2CC] hover:text-white transition"
                      >
                        Already a member? Log In
                      </Link>
                    )}
                  </div>

                  <p className="text-[11px] text-[#6B7FA3] pt-1">
                    ⚡ ₹499/year • Instant access to all blueprints, daily updates & exclusive sessions
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Author Signature */}
          <div className="mt-14 p-6 rounded-2xl bg-[#0D1730] border border-[#24314F] flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-[#6B7FA3] uppercase tracking-wider font-semibold">
                Published By
              </p>
              <p className="text-sm font-bold text-white mt-0.5">
                {featured.authorName}
              </p>
              <p className="text-xs text-[#A7B2CC] mt-0.5">
                {featured.authorRole}
              </p>
            </div>
            <ShieldCheck className="w-8 h-8 text-[#16C784] shrink-0" />
          </div>

          {/* Related Stories */}
          {otherFeatured.length > 0 && (
            <section className="mt-16 pt-10 border-t border-[#24314F]">
              <h3 className="text-xl font-bold text-white mb-6">
                More Featured Intelligence & Reports
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {otherFeatured.slice(0, 4).map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/news/${rel.slug}`}
                    className="p-4 rounded-xl bg-[#0D1730] border border-[#24314F] hover:border-[#7C3AED]/70 transition group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#60A5FA]">
                          {rel.category}
                        </span>
                        {rel.accessLevel === "PREMIUM" && (
                          <span className="text-[10px] font-bold text-yellow-400 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> PRO
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition line-clamp-2 mt-1 mb-2">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-[#A7B2CC] line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#6B7FA3] mt-4 pt-3 border-t border-[#24314F]/50">
                      <span>{rel.date}</span>
                      <span className="text-[#60A5FA] font-medium flex items-center gap-1">
                        Read Story <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    );
  }

  // ─── 2. Fallback to Database Query ───
  let article: any = null;
  let relatedArticles: any[] = [];

  try {
    article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
      },
    });

    if (article) {
      relatedArticles = await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          slug: { not: slug },
          ...(article.categoryId ? { categoryId: article.categoryId } : {}),
        },
        take: 3,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          accessLevel: true,
          readTimeMinutes: true,
        },
      });
    }
  } catch (error) {
    console.warn("DB query failed for article slug:", slug, error);
  }

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  const isPremiumRequired = article.accessLevel === "PREMIUM";
  const hasAccess = !isPremiumRequired || (user && user.isPremium);

  return (
    <article className="min-h-screen py-16 bg-[#050816] text-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back navigation */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#60A5FA] hover:text-white transition mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to News & Updates
        </Link>

        {/* Article Header */}
        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {article.category && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/30">
                {article.category.name}
              </span>
            )}
            {isPremiumRequired && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#7C3AED]/20 text-[#9F67FF] border border-[#7C3AED]/40">
                <Crown className="w-3 h-3 text-yellow-300" />
                PREMIUM ANALYSIS
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base md:text-lg text-[#A7B2CC] leading-relaxed">
            {article.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7FA3] pt-4 border-t border-[#24314F]">
            <span>
              By <strong className="text-white">{article.authorName}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishedAt ? formatDate(article.publishedAt) : "Recently"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTimeMinutes} min read
            </span>
          </div>
        </header>

        {/* Article Cover Image (if present in DB) */}
        {article.coverImage && (
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#24314F] bg-[#070B1E] mb-10 flex items-center justify-center p-3 sm:p-6 shadow-2xl">
            <img
              src={article.coverImage}
              alt={article.title}
              className="max-h-[500px] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        )}

        {/* Content Section or Premium Gate */}
        {hasAccess ? (
          <div className="prose prose-invert max-w-none space-y-6 text-[#F8FAFC] leading-relaxed text-sm md:text-base border-t border-[#24314F]/50 pt-8">
            <div className="whitespace-pre-line space-y-4 font-normal text-[#E2E8F0]">
              {article.content}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-[#0D1730] border border-[#24314F] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6B7FA3] uppercase tracking-wider font-semibold">
                  Published By
                </p>
                <p className="text-sm font-bold text-white mt-0.5">
                  {article.authorName}
                </p>
                <p className="text-xs text-[#A7B2CC] mt-1">
                  Research & Technical Intelligence Team at Savzyen
                </p>
              </div>
              <ShieldCheck className="w-8 h-8 text-[#16C784]" />
            </div>
          </div>
        ) : (
          <div className="space-y-8 border-t border-[#24314F]/50 pt-8">
            <div className="relative p-6 rounded-2xl bg-[#0D1730] border border-[#24314F] overflow-hidden select-none filter blur-[2px] opacity-40">
              <p className="text-sm text-gray-400">
                The technical deep dive uncovers benchmarks, memory overhead patterns, and multi-agent coordination architectures that enterprise teams are using to scale model reliability. In tests across production nodes, we observed significant variance in tool call reliability…
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Furthermore, prompt tuning techniques demonstrate how temperature adjustments correlate with deterministic schema execution…
              </p>
            </div>

            <div className="relative rounded-2xl p-8 border border-[#7C3AED]/50 bg-gradient-to-b from-[#0D1730] to-[#112040] shadow-2xl shadow-[#7C3AED]/10 text-center space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center mx-auto text-[#9F67FF]">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Exclusive to Savzyen Premium Members
                </h2>
                <p className="text-xs md:text-sm text-[#A7B2CC] max-w-md mx-auto mt-2 leading-relaxed">
                  This report includes proprietary performance benchmarks, production architectures, and deployment blueprints.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/register?plan=pro"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 transition shadow-lg shadow-[#7C3AED]/25 flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 text-yellow-300" />
                  Unlock Member Access
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {!user && (
                  <Link
                    href={`/login?returnUrl=/news/${slug}`}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-[#0D1730] border border-[#24314F] text-[#A7B2CC] hover:text-white transition"
                  >
                    Already a member? Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#24314F]">
            <h3 className="text-xl font-bold text-white mb-6">
              More Intelligence & Analysis
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/news/${rel.slug}`}
                  className="p-4 rounded-xl bg-[#0D1730] border border-[#24314F] hover:border-[#3B82F6] transition group flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#60A5FA] transition line-clamp-2 mb-2">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-[#A7B2CC] line-clamp-2">
                      {rel.summary}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#6B7FA3] mt-3 block">
                    {rel.readTimeMinutes}m read
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
