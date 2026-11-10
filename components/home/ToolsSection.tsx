"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { ToolCard } from "@/components/tools/ToolCard";
import { BEST_OF_AI_TOOLS } from "@/lib/tools/bestofai";

const categories = [
  "All",
  "Coding & Dev",
  "Productivity",
  "Design & Video",
  "Study & Learning",
  "Enterprise & Agents",
];

const featuredTools = BEST_OF_AI_TOOLS.slice(0, 12).map((t) => ({
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

export function ToolsSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? featuredTools
      : featuredTools.filter((t) => t.category?.name === activeCategory);

  return (
    <section className="py-20 bg-[#050816]">
      <div className="container-max">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-xs font-semibold text-[#60A5FA] mb-3">
              <Zap className="w-3.5 h-3.5" />
              Best of AI Showcase
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#f8fafc] tracking-tight">
              Featured AI Tools
            </h2>
            <p className="text-[#a7b2cc] text-sm mt-1">
              Curated and benchmarked tools from the open-source Best of AI directory.
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#60A5FA] hover:text-white transition group"
          >
            Explore All 150+ Tools
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`tools-filter-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg shadow-blue-500/20"
                  : "border-[#24314f] text-[#a7b2cc] hover:border-[#3B82F6]/50 hover:text-white bg-[#0D1730]/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Small Tools Grid (4 columns on desktop, Best of AI style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#6b7fa3]">
            <p className="text-base font-semibold">No tools found in this category yet.</p>
            <p className="text-xs mt-1">Check back soon as we sync more tools from the repository!</p>
          </div>
        )}

        {/* Mobile View All CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/tools" className="btn btn-secondary btn-sm w-full">
            View All Tools Directory
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
