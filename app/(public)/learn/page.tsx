import type { Metadata } from "next";
import Link from "next/link";
import { Search, BookOpen, Clock, Lock, ArrowRight, Sparkles, Terminal } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Learn AI by Doing | Practical AI Tutorials | AI Scout",
  description: "Hands-on AI tutorials, architectural blueprints, and prompt engineering masterclasses designed for developers and practitioners.",
  alternates: { canonical: "/learn" },
};

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; difficulty?: string; category?: string }>;
}) {
  const { q, difficulty, category } = await searchParams;

  let resources: any[] = [];
  let categories: any[] = [];

  try {
    const whereClause: any = {};

    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (difficulty && difficulty !== "All") {
      whereClause.difficulty = difficulty;
    }

    if (category && category !== "All") {
      whereClause.category = {
        slug: category,
      };
    }

    [resources, categories] = await Promise.all([
      prisma.learningResource.findMany({
        where: whereClause,
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
  } catch (error) {
    console.warn("Error fetching learning resources:", error);
  }

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen py-14 bg-[#050816] text-[#F8FAFC]">
      <div className="container-max">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-xs font-semibold text-[#8B5CF6] mb-3">
            <Terminal className="w-3.5 h-3.5" />
            Applied Engineering
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            Learn AI by Doing
          </h1>
          <p className="text-sm md:text-base text-[#A7B2CC] leading-relaxed">
            Move beyond surface demos. Build autonomous agents, retrieval pipelines, and fine-tuned systems with working code.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search */}
            <form method="GET" action="/learn" className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7FA3]" />
              <input
                type="search"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search tutorials, RAG, agents, models…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1730] border border-[#24314F] text-sm text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#7C3AED] transition"
              />
            </form>

            {/* Difficulty Tabs */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B7FA3] mr-1 hidden sm:inline">Level:</span>
              {difficulties.map((diff) => (
                <Link
                  key={diff}
                  href={`/learn?difficulty=${diff}${category ? `&category=${category}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    (!difficulty && diff === "All") || difficulty === diff
                      ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                      : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:border-[#7C3AED]"
                  }`}
                >
                  {diff}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {resources.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#24314F] rounded-2xl bg-[#0D1730]/40">
            <p className="text-base font-semibold text-white mb-2">No tutorials found</p>
            <p className="text-xs text-[#6B7FA3] mb-6">
              Try adjusting your difficulty level or search term.
            </p>
            <Link
              href="/learn"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#24314F] text-white hover:bg-[#7C3AED] transition"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <Link
                key={res.id}
                href={`/learn/${res.slug}`}
                className="bg-[#0D1730] border border-[#24314F] hover:border-[#7C3AED] rounded-2xl p-6 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        res.difficulty === "Beginner"
                          ? "bg-[#10B981]/20 text-[#10B981]"
                          : res.difficulty === "Intermediate"
                          ? "bg-[#3B82F6]/20 text-[#60A5FA]"
                          : "bg-[#F59E0B]/20 text-[#F59E0B]"
                      }`}
                    >
                      {res.difficulty}
                    </span>

                    {res.accessLevel === "PREMIUM" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#7C3AED]/20 text-[#9F67FF] border border-[#7C3AED]/40">
                        <Lock className="w-2.5 h-2.5" />
                        PREMIUM
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-white group-hover:text-[#9F67FF] transition leading-snug mb-3">
                    {res.title}
                  </h2>

                  <p className="text-xs text-[#A7B2CC] line-clamp-3 leading-relaxed mb-6">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#24314F]/50 flex items-center justify-between text-xs text-[#6B7FA3]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    ~{res.estimatedHours}h build
                  </span>
                  <span className="font-semibold text-[#7C3AED] group-hover:text-white flex items-center gap-1 transition">
                    Start Tutorial <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
