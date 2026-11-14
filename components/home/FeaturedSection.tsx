import Link from "next/link";
import { ArrowRight, Calendar, Clock, Sparkles, Lock, Crown } from "lucide-react";
import {
  FEATURED_SECTION_HEADER,
  FEATURED_ARTICLES,
  type FeaturedArticle,
} from "@/lib/news/featured-news";

export function FeaturedSection() {
  // Only first three are displayed on the home page
  const homeFeaturedArticles = FEATURED_ARTICLES.slice(0, 3);

  return (
    <section className="py-20 bg-[#0a1024]">
      <div className="container-max">
        {/* Section Header (dynamically configured via JSON) */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest mb-2.5">
              <Sparkles className="w-3 h-3" />
              <span>{FEATURED_SECTION_HEADER.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] tracking-tight">
              {FEATURED_SECTION_HEADER.title}
            </h2>
            <p className="text-sm text-[#a7b2cc] mt-1.5">
              {FEATURED_SECTION_HEADER.description}
            </p>
          </div>
          <Link
            href={FEATURED_SECTION_HEADER.viewAllHref}
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#60A5FA] hover:text-white transition-colors group"
          >
            <span>{FEATURED_SECTION_HEADER.viewAllText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Grid: Only 3 displayed on homepage */}
        <div className="grid md:grid-cols-3 gap-6">
          {homeFeaturedArticles.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link href={FEATURED_SECTION_HEADER.viewAllHref} className="btn btn-secondary btn-sm">
            {FEATURED_SECTION_HEADER.viewAllText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ item }: { item: FeaturedArticle }) {
  const isPremium = item.accessLevel === "PREMIUM";

  return (
    <Link
      href={`/news/${item.slug}`}
      className="card card-glow block group overflow-hidden border border-[#24314F] hover:border-[#7C3AED]/70 bg-[#0D1730] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-500/15 flex flex-col justify-between rounded-2xl"
    >
      <div>
        {/* Responsive, Aspect-ratio aware Thumbnail Container */}
        <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#070B1E] flex items-center justify-center border-b border-[#24314F]/70">
          {/* Ambient blurred backdrop to harmonize any portrait/landscape variance */}
          <img
            src={item.imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
          />

          {/* Foreground Crisp Image (object-contain ensures zero clipping of texts or badges) */}
          <img
            src={item.imageUrl}
            alt={item.imageAlt}
            className="relative z-10 w-full h-full object-contain p-2.5 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-md backdrop-blur-md ${
                item.badge === "Breaking"
                  ? "bg-red-500/20 text-red-300 border-red-500/40"
                  : item.badge === "Analysis"
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
              }`}
            >
              {item.badge}
            </span>

            {isPremium ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7C3AED]/30 text-[#C4B5FD] border border-[#7C3AED]/50 backdrop-blur-md shadow-sm">
                <Lock className="w-2.5 h-2.5 text-yellow-300" />
                <span>PRO</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                <span>FREE</span>
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 text-xs text-[#6B7FA3]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              {item.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#60A5FA]" />
              {item.readTimeMinutes} min read
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          <p className="text-xs text-[#A7B2CC] line-clamp-3 leading-relaxed">
            {item.excerpt}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#60A5FA] group-hover:text-purple-400 flex items-center gap-1 transition-colors">
            <span>{isPremium ? "Read Pro Analysis" : "Read Full Story"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
          {isPremium && (
            <span className="text-[11px] text-yellow-400/90 font-medium flex items-center gap-1">
              <Crown className="w-3 h-3 text-yellow-400" />
              <span>Pro Report</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
