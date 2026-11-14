import type { Metadata } from "next";
import Link from "next/link";
import { Search, Terminal, ArrowRight, Clock, Lock } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { LEARN_CHALLENGES } from "@/lib/learn/challenges";
import { ChallengeCard } from "@/components/learn/ChallengeCard";

export const metadata: Metadata = {
  title: "Learn AI by Doing | Practical AI Tutorials & Challenges | Savzyen",
  description:
    "Hands-on AI challenges, architectural blueprints, and prompt engineering masterclasses designed for developers, founders, and practitioners.",
  alternates: { canonical: "/learn" },
};

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; difficulty?: string; category?: string }>;
}) {
  const { q, difficulty, category } = await searchParams;

  // ─── 1. Filter the Core AI-Only Challenges ───
  let filteredChallenges = LEARN_CHALLENGES;

  if (difficulty && difficulty !== "All") {
    filteredChallenges = filteredChallenges.filter(
      (c) => c.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }

  if (q) {
    const query = q.toLowerCase();
    filteredChallenges = filteredChallenges.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.challenge.toLowerCase().includes(query) ||
        c.industry.toLowerCase().includes(query) ||
        c.toolsRequired.some((t) => t.toLowerCase().includes(query))
    );
  }

  // ─── 2. Query any additional database learning resources ───
  let dbResources: any[] = [];
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
      whereClause.category = { slug: category };
    }

    dbResources = await prisma.learningResource.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.warn("Error fetching db learning resources:", error);
  }

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
  const totalItems = filteredChallenges.length + dbResources.length;

  return (
    <div className="min-h-screen py-14 sm:py-20 bg-[#050816] text-[#F8FAFC]">
      <div className="container-max">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-400 mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Applied AI Curriculum</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            Learn AI by Doing
          </h1>
          <p className="text-sm md:text-base text-[#A7B2CC] leading-relaxed">
            Move beyond passive demos. Tackle hands-on, end-to-end AI challenges with real prompts,
            multimodal tool stacks, and concrete deliverables.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <form method="GET" action="/learn" className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7FA3]" />
              <input
                type="search"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search challenges, tools, prompts, or topics…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1730] border border-[#24314F] text-sm text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#7C3AED] transition"
              />
              {difficulty && difficulty !== "All" && (
                <input type="hidden" name="difficulty" value={difficulty} />
              )}
            </form>

            {/* Difficulty Level Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-[#6B7FA3] mr-1 hidden sm:inline">Level:</span>
              {difficulties.map((diff) => (
                <Link
                  key={diff}
                  href={`/learn?difficulty=${diff}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition whitespace-nowrap ${
                    (!difficulty && diff === "All") || difficulty === diff
                      ? "bg-[#7C3AED] text-white border-[#7C3AED] shadow-md shadow-purple-500/20"
                      : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:border-[#7C3AED] hover:text-white"
                  }`}
                >
                  {diff}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ─── AI-Only Challenges Grid ─── */}
        {filteredChallenges.length > 0 && (
          <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>AI-Only Challenges</span>
                <span className="text-xs font-normal text-[#A7B2CC] bg-[#112040] border border-[#24314F] px-2 py-0.5 rounded-full">
                  {filteredChallenges.length} Challenges
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </div>
        )}

        {/* ─── Additional Database Resources (if any) ─── */}
        {dbResources.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-[#24314F]">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Additional Tutorials & Blueprints</span>
              <span className="text-xs font-normal text-[#A7B2CC] bg-[#112040] border border-[#24314F] px-2 py-0.5 rounded-full">
                {dbResources.length}
              </span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbResources.map((res) => (
                <Link
                  key={res.id}
                  href={`/learn/${res.slug}`}
                  className="bg-[#0D1730] border border-[#24314F] hover:border-[#7C3AED] rounded-2xl p-6 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#3B82F6]/20 text-[#60A5FA]">
                        {res.difficulty}
                      </span>
                      {res.accessLevel === "PREMIUM" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#7C3AED]/20 text-[#9F67FF] border border-[#7C3AED]/40">
                          <Lock className="w-2.5 h-2.5" />
                          PREMIUM
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#9F67FF] transition leading-snug mb-3">
                      {res.title}
                    </h3>

                    <p className="text-xs text-[#A7B2CC] line-clamp-3 leading-relaxed mb-6">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#24314F]/50 flex items-center justify-between text-xs text-[#6B7FA3]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      ~{res.estimatedHours}h
                    </span>
                    <span className="font-semibold text-[#7C3AED] group-hover:text-white flex items-center gap-1 transition">
                      Start Tutorial <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalItems === 0 && (
          <div className="text-center py-20 border border-dashed border-[#24314F] rounded-2xl bg-[#0D1730]/40">
            <p className="text-base font-semibold text-white mb-2">No challenges found</p>
            <p className="text-xs text-[#6B7FA3] mb-6">
              Try adjusting your difficulty level or search keywords.
            </p>
            <Link
              href="/learn"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#24314F] text-white hover:bg-[#7C3AED] transition"
            >
              Reset Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
