import Link from "next/link";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { formatDate, estimateReadingTime } from "@/lib/utils";

// Static featured items for Phase 2 — replaced with DB data in Phase 4
const featuredItems = [
  {
    id: "1",
    type: "news" as const,
    title: "OpenAI Releases GPT-5 with Enhanced Reasoning",
    excerpt: "The latest model from OpenAI brings significant improvements in multi-step reasoning, code generation, and factual accuracy across benchmarks.",
    category: "Industry News",
    date: new Date("2026-10-20"),
    readTime: 4,
    imageGradient: "from-purple-600/30 to-blue-600/20",
    href: "/news",
    badge: "Hot",
  },
  {
    id: "2",
    type: "tool" as const,
    title: "Perplexity AI Pro",
    excerpt: "An AI-powered search engine that provides direct, cited answers with real-time web access. Perfect for research and fact-checking.",
    category: "Productivity",
    date: new Date("2026-10-18"),
    readTime: 3,
    imageGradient: "from-blue-600/30 to-cyan-600/20",
    href: "/tools",
    badge: "Freemium",
  },
  {
    id: "3",
    type: "learn" as const,
    title: "Build Your First AI Agent with LangChain",
    excerpt: "A hands-on tutorial that walks you through building an autonomous AI agent from scratch using LangChain and Python.",
    category: "Beginner",
    date: new Date("2026-10-17"),
    readTime: 12,
    imageGradient: "from-green-600/30 to-teal-600/20",
    href: "/learn",
    badge: "Tutorial",
  },
];

const typeBadge = {
  news: { label: "News", class: "badge-blue" },
  tool: { label: "Tool", class: "badge-purple" },
  learn: { label: "Tutorial", class: "badge-green" },
};

export function FeaturedSection() {
  return (
    <section className="py-20 bg-[#0a1024]">
      <div className="container-max">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-2">
              This Week
            </p>
            <h2 className="text-3xl font-bold text-[#f8fafc]">
              Featured This Week
            </h2>
            <p className="text-[#a7b2cc] mt-2">
              Hand-picked AI news, tools, and tutorials
            </p>
          </div>
          <Link
            href="/news"
            className="hidden sm:flex items-center gap-2 text-sm text-[#a7b2cc] hover:text-[#f8fafc] transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/news" className="btn btn-secondary btn-sm">
            View All Content
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ item }: { item: typeof featuredItems[0] }) {
  const type = typeBadge[item.type];

  return (
    <Link href={item.href} className="card card-glow block group overflow-hidden">
      {/* Thumbnail */}
      <div className={`h-44 bg-gradient-to-br ${item.imageGradient} relative`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-20 h-20 rounded-full border-2 border-white/30" />
          <div className="absolute w-32 h-32 rounded-full border border-white/10" />
        </div>
        {/* Type + Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`badge ${type.class}`}>{type.label}</span>
          {item.badge && (
            <span className="badge badge-yellow">{item.badge}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3 text-xs text-[#6b7fa3]">
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {item.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(item.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.readTime}m
          </span>
        </div>

        <h3 className="text-base font-semibold text-[#f8fafc] leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
          {item.title}
        </h3>

        <p className="text-sm text-[#a7b2cc] leading-relaxed line-clamp-2">
          {item.excerpt}
        </p>

        <div className="flex items-center gap-1 text-sm text-purple-400 font-medium pt-1">
          Read more
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
