"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Star } from "lucide-react";

const categories = [
  "All",
  "Productivity",
  "Study & Learning",
  "Design",
  "Video",
  "Coding",
  "Marketing",
  "Business",
];

const tools = [
  {
    id: "1",
    name: "ChatGPT",
    description: "Powerful conversational AI for writing, coding, analysis, and more. The most widely used AI assistant.",
    category: "Productivity",
    pricing: "Freemium" as const,
    url: "https://chat.openai.com",
    logoText: "ChatGPT",
    featured: true,
  },
  {
    id: "2",
    name: "GitHub Copilot",
    description: "AI pair programmer that helps you write code faster with smart completions directly in your editor.",
    category: "Coding",
    pricing: "Paid" as const,
    url: "https://github.com/features/copilot",
    logoText: "Copilot",
    featured: true,
  },
  {
    id: "3",
    name: "Midjourney",
    description: "Create stunning AI-generated art and images with text prompts. Industry-leading image quality.",
    category: "Design",
    pricing: "Paid" as const,
    url: "https://midjourney.com",
    logoText: "MJ",
    featured: true,
  },
  {
    id: "4",
    name: "Notion AI",
    description: "AI writing assistant built into Notion to help you write, summarize, and brainstorm faster.",
    category: "Productivity",
    pricing: "Freemium" as const,
    url: "https://notion.so",
    logoText: "Notion",
    featured: false,
  },
  {
    id: "5",
    name: "Runway ML",
    description: "Professional AI video creation and editing platform for creators and filmmakers.",
    category: "Video",
    pricing: "Freemium" as const,
    url: "https://runwayml.com",
    logoText: "Runway",
    featured: false,
  },
  {
    id: "6",
    name: "Perplexity",
    description: "AI-powered search engine that provides direct answers with real-time citations.",
    category: "Study & Learning",
    pricing: "Freemium" as const,
    url: "https://perplexity.ai",
    logoText: "Pplx",
    featured: false,
  },
  {
    id: "7",
    name: "HubSpot AI",
    description: "AI-powered marketing, sales, and CRM tools to grow your business smarter.",
    category: "Marketing",
    pricing: "Freemium" as const,
    url: "https://hubspot.com",
    logoText: "HubSpot",
    featured: false,
  },
  {
    id: "8",
    name: "Gamma",
    description: "Create beautiful presentations and documents with AI in minutes, no design skills needed.",
    category: "Business",
    pricing: "Freemium" as const,
    url: "https://gamma.app",
    logoText: "Gamma",
    featured: false,
  },
];

const pricingBadge = {
  Free: "badge-green",
  Freemium: "badge-blue",
  Paid: "badge-purple",
};

const pricingColor: Record<string, string> = {
  Free: "badge-green",
  Freemium: "badge-blue",
  Paid: "badge-purple",
};

// Logo gradient per category
const categoryGradient: Record<string, string> = {
  Productivity: "from-purple-600 to-violet-800",
  Coding: "from-blue-600 to-indigo-800",
  Design: "from-pink-600 to-rose-800",
  Video: "from-orange-600 to-red-800",
  "Study & Learning": "from-teal-600 to-cyan-800",
  Marketing: "from-amber-600 to-yellow-800",
  Business: "from-emerald-600 to-green-800",
};

export function ToolsSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? tools
      : tools.filter((t) => t.category === activeCategory);

  return (
    <section className="py-20 bg-[#050816]">
      <div className="container-max">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
              Directory
            </p>
            <h2 className="text-3xl font-bold text-[#f8fafc]">
              Explore AI Tools
            </h2>
            <p className="text-[#a7b2cc] mt-2">
              Handpicked tools to boost your productivity
            </p>
          </div>
          <Link
            href="/tools"
            className="hidden sm:flex items-center gap-2 text-sm text-[#a7b2cc] hover:text-[#f8fafc] transition-colors group"
          >
            View All Tools
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`tools-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "border-[#24314f] text-[#a7b2cc] hover:border-purple-500/50 hover:text-[#f8fafc] bg-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#6b7fa3]">
            <p className="text-lg">No tools found in this category yet.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/tools" className="btn btn-secondary btn-sm">
            View All Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ToolCard({ tool }: { tool: typeof tools[0] }) {
  const gradient = categoryGradient[tool.category] ?? "from-purple-600 to-blue-800";

  return (
    <div className="card card-glow p-5 flex flex-col gap-4 group">
      {/* Logo + Featured */}
      <div className="flex items-start justify-between">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-lg shrink-0`}
        >
          {tool.logoText.slice(0, 2).toUpperCase()}
        </div>
        {tool.featured && (
          <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
            <Star className="w-3 h-3 fill-yellow-400" />
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-semibold text-[#f8fafc] group-hover:text-purple-300 transition-colors">
            {tool.name}
          </h3>
          <span className={`badge ${pricingColor[tool.pricing]}`}>
            {tool.pricing}
          </span>
        </div>
        <p className="text-xs text-[#a7b2cc] leading-relaxed line-clamp-3">
          {tool.description}
        </p>
        <p className="text-xs text-[#6b7fa3]">{tool.category}</p>
      </div>

      {/* Action */}
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary btn-sm w-full text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        Visit Tool
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
