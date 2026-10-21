import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Lock, Crown, ArrowRight, Share2, Tag, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, summary: true },
  });

  if (!article) {
    return { title: "Article Not Found | AI Scout" };
  }

  return {
    title: `${article.title} | AI Scout`,
    description: article.summary,
    alternates: { canonical: `/news/${slug}` },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: true,
    },
  });

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  const user = await getCurrentUser();
  const isPremiumRequired = article.accessLevel === "PREMIUM";
  const hasAccess = !isPremiumRequired || (user && user.isPremium);

  // Fetch related articles
  const relatedArticles = await prisma.article.findMany({
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
            <span>By <strong className="text-white">{article.authorName}</strong></span>
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

        {/* Content Section or Premium Gate */}
        {hasAccess ? (
          <div className="prose prose-invert max-w-none space-y-6 text-[#F8FAFC] leading-relaxed text-sm md:text-base border-t border-[#24314F]/50 pt-8">
            {/* Render article body */}
            <div className="whitespace-pre-line space-y-4 font-normal text-[#E2E8F0]">
              {article.content}
            </div>

            {/* Author card */}
            <div className="mt-12 p-6 rounded-2xl bg-[#0D1730] border border-[#24314F] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6B7FA3] uppercase tracking-wider font-semibold">Published By</p>
                <p className="text-sm font-bold text-white mt-0.5">{article.authorName}</p>
                <p className="text-xs text-[#A7B2CC] mt-1">Research & Technical Intelligence Team at AI Scout</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-[#16C784]" />
            </div>
          </div>
        ) : (
          /* Server-Side Premium Gate — content is strictly omitted from unauthenticated responses */
          <div className="space-y-8 border-t border-[#24314F]/50 pt-8">
            {/* Blurred Teaser preview */}
            <div className="relative p-6 rounded-2xl bg-[#0D1730] border border-[#24314F] overflow-hidden select-none filter blur-[2px] opacity-40">
              <p className="text-sm text-gray-400">
                The technical deep dive uncovers benchmarks, memory overhead patterns, and multi-agent coordination architectures that enterprise teams are using to scale model reliability. In tests across production nodes, we observed significant variance in tool call reliability…
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Furthermore, prompt tuning techniques demonstrate how temperature adjustments correlate with deterministic schema execution…
              </p>
            </div>

            {/* High-conversion Gate Card */}
            <div className="relative rounded-2xl p-8 border border-[#7C3AED]/50 bg-gradient-to-b from-[#0D1730] to-[#112040] shadow-2xl shadow-[#7C3AED]/10 text-center space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center mx-auto text-[#9F67FF]">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Exclusive to AI Scout Premium Members
                </h2>
                <p className="text-xs md:text-sm text-[#A7B2CC] max-w-md mx-auto mt-2 leading-relaxed">
                  This report includes proprietary performance benchmarks, production architectures, and deployment blueprints.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/pricing"
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
