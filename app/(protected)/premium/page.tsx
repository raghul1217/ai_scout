import type { Metadata } from "next";
import Link from "next/link";
import { requirePremium } from "@/lib/auth/session";
import {
  getPremiumArticles,
  getPremiumCategories,
  getToolsOfTheWeek,
} from "@/lib/premium/vault-data";
import {
  Crown,
  ShieldCheck,
  Search,
  Calendar,
  Clock,
  Cpu,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Member Vault | Savzyen",
  description:
    "Weekly intelligence briefings, vetted agent repositories, curated developer tools, and hands-on engineering challenges for Savzyen Premium members.",
};

export default async function PremiumVaultPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const [user, { q, category }] = await Promise.all([
    requirePremium(),
    searchParams,
  ]);

  const allArticles = getPremiumArticles();
  const categories = getPremiumCategories();
  const toolsOfTheWeek = getToolsOfTheWeek();

  const filteredArticles = allArticles.filter((article) => {
    if (category && category !== "All" && article.categorySlug !== category) {
      return false;
    }
    if (q) {
      const query = q.toLowerCase();
      const matchesTitle = article.title.toLowerCase().includes(query);
      const matchesSummary = article.summary.toLowerCase().includes(query);
      const matchesTag = article.tags.some((t) =>
        t.toLowerCase().includes(query)
      );
      if (!matchesTitle && !matchesSummary && !matchesTag) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-[#050816] text-[#F8FAFC]">
      <div className="container-max space-y-12">
        {/* ─── VAULT HEADER ─────────────────────────────────────────────── */}
        <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#7C3AED]/40 bg-gradient-to-r from-[#0D1730] via-[#112040] to-[#0A1024] overflow-hidden shadow-2xl shadow-[#7C3AED]/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#7C3AED]/20 to-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-xs font-bold text-[#C4B5FD] uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-yellow-300" />
                SAVZYEN PREMIUM VAULT
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Access
              </span>
              <span className="text-xs text-[#6B7FA3]">
                • {allArticles.length} Briefings Available
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
              Premium Intelligence &amp;{" "}
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">
                Engineering Vault
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#A7B2CC] leading-relaxed">
              Welcome,{" "}
              <strong className="text-white font-semibold">{user.name}</strong>.
              Browse your curated dossiers, frontier hardware reports, event
              briefings, and step-by-step agent walkthroughs. Select any card to
              open the full report.
            </p>
          </div>
        </div>

        {/* ─── SEARCH & CATEGORY FILTERS (MATCHES NEWS STRUCTURE) ───────── */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <form
            method="GET"
            action="/premium"
            className="relative flex-1 max-w-md"
          >
            {category && category !== "All" && (
              <input type="hidden" name="category" value={category} />
            )}
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7FA3]" />
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search premium briefings, topics, hardware…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1730] border border-[#24314F] text-sm text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#7C3AED] transition"
            />
          </form>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              href={q ? `/premium?q=${encodeURIComponent(q)}` : "/premium"}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition whitespace-nowrap ${
                !category || category === "All"
                  ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                  : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:border-[#7C3AED]"
              }`}
            >
              All Briefings
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/premium?category=${cat.slug}${
                  q ? `&q=${encodeURIComponent(q)}` : ""
                }`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition whitespace-nowrap ${
                  category === cat.slug
                    ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                    : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:border-[#7C3AED]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ─── BRIEFINGS OVERVIEW CARD GRID ─────────────────────────────── */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#24314F] rounded-2xl bg-[#0D1730]/40">
            <p className="text-base font-semibold text-white mb-2">
              No premium briefings found
            </p>
            <p className="text-xs text-[#6B7FA3] mb-6">
              Try adjusting your search query or category filter.
            </p>
            <Link
              href="/premium"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#24314F] text-white hover:bg-[#7C3AED] transition"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/premium/${article.slug}`}
                className="group relative bg-[#0D1730] border border-[#24314F] hover:border-[#7C3AED]/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Thumbnail with Ambient Blurred Backdrop */}
                  {article.coverImage && (
                    <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[#070B1E] mb-4 flex items-center justify-center border border-[#24314F]/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.coverImage}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-lg opacity-35 scale-110 pointer-events-none"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.coverImage}
                        alt={article.coverImageAlt}
                        className="relative z-10 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Category + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-[#60A5FA] uppercase tracking-wider truncate">
                      {article.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                        article.badge === "New"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : article.badge === "Summit"
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                          : "bg-[#7C3AED]/25 text-[#C4B5FD] border-[#7C3AED]/50"
                      }`}
                    >
                      {article.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition leading-snug mb-3 line-clamp-2">
                    {article.title}
                  </h2>

                  {/* Overview Summary */}
                  <p className="text-xs text-[#A7B2CC] line-clamp-3 leading-relaxed mb-5">
                    {article.summary}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between text-xs text-[#6B7FA3] pt-4 border-t border-[#24314F]/50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#60A5FA]" />
                      {article.readTimeMinutes} min
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#C4B5FD] group-hover:text-white transition">
                    Read
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ─── TOOLS OF THE WEEK STRIP (FROM JSON) ──────────────────────── */}
        <section className="pt-6 border-t border-[#24314F]/60 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Cpu className="w-4 h-4 text-[#9F67FF]" />
              <span className="text-xs font-bold text-[#9F67FF] uppercase tracking-widest">
                Weekly Report
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Tools of the Week
            </h2>
            <p className="text-xs sm:text-sm text-[#A7B2CC] mt-1">
              Curated developer utilities, frameworks, and agent harnesses tested by the Savzyen engineering lab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {toolsOfTheWeek.map((tool) => {
              const accentStyles =
                tool.accent === "amber"
                  ? {
                      borderHover: "hover:border-[#F59E0B]",
                      numBg: "bg-[#F59E0B]/20 text-[#F59E0B]",
                      tagStyle:
                        "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
                      titleHover: "group-hover:text-[#F59E0B]",
                      btnHover:
                        "hover:bg-[#F59E0B] hover:text-black hover:border-[#F59E0B]",
                    }
                  : tool.accent === "emerald"
                  ? {
                      borderHover: "hover:border-[#10B981]",
                      numBg: "bg-[#10B981]/20 text-[#10B981]",
                      tagStyle:
                        "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30",
                      titleHover: "group-hover:text-[#10B981]",
                      btnHover: "hover:bg-[#10B981] hover:border-[#10B981]",
                    }
                  : {
                      borderHover: "hover:border-[#60A5FA]",
                      numBg: "bg-[#3B82F6]/20 text-[#60A5FA]",
                      tagStyle:
                        "bg-[#3B82F6]/10 text-[#60A5FA] border-[#3B82F6]/30",
                      titleHover: "group-hover:text-[#60A5FA]",
                      btnHover: "hover:bg-[#3B82F6] hover:border-[#3B82F6]",
                    };

              return (
                <div
                  key={tool.name}
                  className={`bg-[#0D1730] border border-[#24314F] ${accentStyles.borderHover} rounded-2xl p-6 transition flex flex-col justify-between group`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`w-8 h-8 rounded-lg ${accentStyles.numBg} font-black text-xs flex items-center justify-center shrink-0`}
                      >
                        {tool.number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${accentStyles.tagStyle}`}
                      >
                        {tool.tag}
                      </span>
                    </div>
                    <h3
                      className={`text-lg font-bold text-white transition ${accentStyles.titleHover}`}
                    >
                      {tool.name}
                    </h3>
                    <p className="text-xs text-[#A7B2CC] leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#24314F]/60 mt-5">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#112040] border border-[#24314F] transition flex items-center justify-center gap-1.5 ${accentStyles.btnHover}`}
                    >
                      Explore {tool.name}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
