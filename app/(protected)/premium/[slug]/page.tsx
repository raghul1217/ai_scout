import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Crown,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Info,
  Terminal,
} from "lucide-react";
import { requirePremium } from "@/lib/auth/session";
import {
  getPremiumArticleBySlug,
  getPremiumArticles,
} from "@/lib/premium/vault-data";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getPremiumArticleBySlug(slug);

  if (!article) {
    return { title: "Briefing Not Found | Savzyen Premium Vault" };
  }

  return {
    title: `${article.title} | Savzyen Premium Vault`,
    description: article.summary,
  };
}

export default async function PremiumArticlePage({ params }: PageProps) {
  const [, { slug }] = await Promise.all([requirePremium(), params]);

  const article = getPremiumArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const relatedArticles = getPremiumArticles()
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  return (
    <article className="min-h-screen py-10 sm:py-16 bg-[#050816] text-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back Navigation */}
        <Link
          href="/premium"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#60A5FA] hover:text-white transition mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Premium Vault</span>
        </Link>

        {/* Article Header */}
        <header className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30">
              {article.category}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                article.badge === "New"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : article.badge === "Summit"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                  : "bg-purple-500/20 text-purple-300 border-purple-500/40"
              }`}
            >
              {article.badge}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#7C3AED]/25 text-[#C4B5FD] border border-[#7C3AED]/50">
              <Crown className="w-3 h-3 text-yellow-300" />
              <span>PRO VAULT</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-sm sm:text-lg text-[#A7B2CC] leading-relaxed">
              {article.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#6B7FA3] pt-4 border-t border-[#24314F]">
            <span>
              By <strong className="text-white">{article.authorName}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              {article.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#60A5FA]" />
              {article.readTimeMinutes} min read
            </span>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#112040] text-[#A7B2CC] border border-[#24314F]"
                >
                  <Tag className="w-3 h-3 text-[#60A5FA]" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Hero Image Showcase */}
        {article.coverImage && (
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#24314F] bg-[#070B1E] mb-8 flex items-center justify-center p-3 sm:p-6 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110 pointer-events-none"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.coverImageAlt}
              className="relative z-10 max-h-[500px] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        )}

        {/* Primary Action Buttons (Optional) */}
        {article.primaryActions && article.primaryActions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {article.primaryActions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  action.variant === "secondary"
                    ? "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#0D1730] hover:bg-[#112040] text-[#CBD5E1] hover:text-white border border-[#24314F] hover:border-[#3B82F6] transition"
                    : "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 transition shadow-lg shadow-[#7C3AED]/20"
                }
              >
                <span>{action.label}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
            ))}
          </div>
        )}

        {/* Summary Callout Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0D1730] to-[#112040] border border-[#24314F] mb-10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#60A5FA]">
            Key Takeaway
          </div>
          <p className="text-sm sm:text-base text-[#F8FAFC] leading-relaxed font-medium">
            {article.summary}
          </p>
        </div>

        {/* Structured Content Sections */}
        <div className="space-y-8 text-[#D1D5DB] text-sm sm:text-base leading-relaxed">
          {article.sections.map((sec, idx) => (
            <section key={idx} className="space-y-4">
              {sec.heading && (
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2">
                  {sec.heading}
                </h2>
              )}

              {sec.paragraphs?.map((para, pIdx) => (
                <p key={pIdx} className="leading-relaxed text-[#D1D5DB]">
                  {para}
                </p>
              ))}

              {/* Code / Prompt Block */}
              {sec.codeBlock && (
                <div className="p-4 rounded-xl bg-[#0D1730] border border-[#24314F] font-mono text-xs sm:text-sm text-emerald-400 flex items-start gap-3">
                  <Terminal className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>&ldquo;{sec.codeBlock}&rdquo;</span>
                </div>
              )}

              {/* Bullet Points */}
              {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                <div className="grid gap-3 pt-1">
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

              {/* Repository / External Links */}
              {sec.links && sec.links.length > 0 && (
                <div className="grid gap-3 pt-1">
                  {sec.links.map((item) => (
                    <div
                      key={item.name}
                      className="p-4 rounded-xl bg-[#0D1730] border border-[#24314F] hover:border-[#7C3AED]/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs sm:text-sm font-bold text-white">
                            {item.name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7C3AED]/20 text-[#C4B5FD] border border-[#7C3AED]/30 uppercase">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#A7B2CC] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#112040] hover:bg-[#7C3AED] text-white border border-[#24314F] transition shrink-0"
                      >
                        GitHub
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Section Images (1-col or 2-col responsive gallery) */}
              {sec.images && sec.images.length > 0 && (
                <div
                  className={`grid gap-4 pt-2 ${
                    sec.images.length >= 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  {sec.images.map((img, iIdx) => (
                    <figure
                      key={iIdx}
                      className="rounded-xl overflow-hidden border border-[#24314F] bg-[#070B1E] flex flex-col"
                    >
                      <div className="relative w-full bg-[#070B1E] flex items-center justify-center p-2 sm:p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-auto max-h-[420px] object-contain rounded-lg"
                        />
                      </div>
                      {img.caption && (
                        <figcaption className="px-3.5 py-2.5 text-[11px] text-[#A7B2CC] bg-[#0D1730] border-t border-[#24314F]">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}

              {/* Callout Box */}
              {sec.callout && (
                <div
                  className={`p-5 rounded-2xl border my-4 ${
                    sec.callout.type === "warning"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                      : sec.callout.type === "insight"
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-200"
                      : "bg-blue-500/10 border-blue-500/30 text-blue-200"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    {sec.callout.type === "warning" ? (
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                    ) : sec.callout.type === "insight" ? (
                      <Sparkles className="w-4 h-4 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 shrink-0" />
                    )}
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

        {/* Related Briefings from the Vault */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#24314F] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                More from the Premium Vault
              </h2>
              <Link
                href="/premium"
                className="text-xs font-semibold text-[#60A5FA] hover:text-white transition inline-flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/premium/${rel.slug}`}
                  className="group bg-[#0D1730] border border-[#24314F] hover:border-[#7C3AED]/70 rounded-xl p-4 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-28 w-full rounded-lg overflow-hidden bg-[#070B1E] mb-3 flex items-center justify-center border border-[#24314F]/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.coverImage}
                        alt={rel.coverImageAlt}
                        className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#60A5FA] uppercase tracking-wider block mb-1">
                      {rel.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition line-clamp-2 leading-snug">
                      {rel.title}
                    </h3>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#24314F]/50 flex items-center justify-between text-[11px] text-[#6B7FA3]">
                    <span>{rel.date}</span>
                    <span>{rel.readTimeMinutes} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
