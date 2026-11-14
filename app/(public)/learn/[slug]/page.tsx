import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Crown,
  ArrowRight,
  Terminal,
  BookOpen,
  CheckCircle2,
  Check,
  Wrench,
  Layers,
  Sparkles,
  Share2,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { LEARN_CHALLENGES } from "@/lib/learn/challenges";
import { PromptBlock } from "@/components/learn/PromptBlock";
import { ChallengeCard } from "@/components/learn/ChallengeCard";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // 1. Check in AI-Only Challenges
  const challenge = LEARN_CHALLENGES.find((c) => c.slug === slug);
  if (challenge) {
    return {
      title: `${challenge.title} | Learn AI by Doing | Savzyen`,
      description: challenge.challenge,
      alternates: { canonical: `/learn/${slug}` },
    };
  }

  // 2. Check in database learning resources
  const res = await prisma.learningResource.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!res) {
    return { title: "Tutorial Not Found | Savzyen" };
  }

  return {
    title: `${res.title} | Savzyen Learn`,
    description: res.description,
    alternates: { canonical: `/learn/${slug}` },
  };
}

const difficultyBadge = {
  Beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Advanced: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

export default async function LearnDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // ─── 1. Check if it matches an AI-Only Challenge ───
  const challenge = LEARN_CHALLENGES.find((c) => c.slug === slug);

  if (challenge) {
    const otherChallenges = LEARN_CHALLENGES.filter((c) => c.slug !== slug);

    return (
      <article className="min-h-screen py-14 sm:py-20 bg-[#050816] text-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#9F67FF] hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Challenges
            </Link>

            <span className="text-xs font-mono text-[#6B7FA3]">
              {challenge.badge}
            </span>
          </div>

          {/* Header */}
          <header className="mb-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {challenge.badge}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  difficultyBadge[challenge.difficulty]
                }`}
              >
                {challenge.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#112040] text-[#60A5FA] border border-[#24314F]">
                {challenge.industry}
              </span>
              <span className="px-3 py-1 rounded-full text-xs text-[#A7B2CC] flex items-center gap-1.5 bg-[#0D1730] border border-[#24314F]">
                <Clock className="w-3.5 h-3.5 text-[#6B7FA3]" />
                {challenge.estimatedTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {challenge.title}
            </h1>

            {/* Challenge Scenario Quote Box */}
            <div className="p-5 rounded-2xl bg-[#0D1730] border border-[#24314F] relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Challenge Scenario</span>
              </div>
              <p className="text-sm sm:text-base text-[#F8FAFC] leading-relaxed">
                {challenge.challenge}
              </p>
            </div>
          </header>

          {/* Cover Image Banner */}
          {challenge.coverImage && (
            <div className="mb-12 rounded-2xl overflow-hidden border border-[#24314F] shadow-2xl relative h-64 sm:h-80 md:h-96">
              <img
                src={challenge.coverImage}
                alt={challenge.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent opacity-80" />
            </div>
          )}

          {/* Main Challenge Content */}
          <div className="space-y-12">
            {/* Section 1: Tools Required */}
            <section className="bg-[#0D1730]/80 border border-[#24314F] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-[#60A5FA]" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Tools Required
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#A7B2CC]">
                You will need access to these AI tools to complete the research, analysis, and assets for this challenge:
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {challenge.toolsRequired.map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#112040] text-white border border-[#24314F] shadow-sm flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span>{tool}</span>
                  </span>
                ))}
              </div>
            </section>

            {/* Section 2: How to Complete It */}
            <section className="bg-[#0D1730]/80 border border-[#24314F] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  How to Complete It (Step-by-Step)
                </h2>
              </div>

              <ol className="space-y-3 pt-2">
                {challenge.howToComplete.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-[#050816]/70 border border-[#24314F]/70 text-xs sm:text-sm text-[#E2E8F0] transition hover:border-purple-500/40"
                  >
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Section 3: Prompts to Use */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-purple-400" />
                    <span>Prompts to Use</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#A7B2CC] mt-1">
                    Copy and paste these pre-engineered production prompts directly into your AI tools.
                  </p>
                </div>
              </div>

              <div className="space-y-5 pt-2">
                {challenge.prompts.map((p, pIdx) => (
                  <PromptBlock
                    key={pIdx}
                    name={p.name}
                    description={p.description}
                    prompt={p.prompt}
                  />
                ))}
              </div>
            </section>

            {/* Section 4: Final Submission / Deliverables */}
            <section className="bg-[#0D1730]/80 border border-[#24314F] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Final Submission & Deliverables
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#A7B2CC]">
                Verify your final outputs against this checklist before publishing or sharing:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {challenge.finalSubmission.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-[#050816]/70 border border-[#24314F] text-xs sm:text-sm text-[#E2E8F0]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium">{sub}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5: Other Challenges */}
            {otherChallenges.length > 0 && (
              <section className="pt-8 border-t border-[#24314F] space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Explore Other Challenges
                  </h3>
                  <Link
                    href="/learn"
                    className="text-xs font-semibold text-[#60A5FA] hover:text-white transition flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {otherChallenges.map((other) => (
                    <ChallengeCard key={other.id} challenge={other} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </article>
    );
  }

  // ─── 2. Fallback to Database Learning Resource (if not in static challenges) ───
  const resource = await prisma.learningResource.findUnique({
    where: { slug },
    include: { category: true, tags: true },
  });

  if (!resource) {
    notFound();
  }

  const user = await getCurrentUser();
  const isPremiumRequired = resource.accessLevel === "PREMIUM";
  const hasAccess = !isPremiumRequired || (user && user.isPremium);

  return (
    <article className="min-h-screen py-16 bg-[#050816] text-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9F67FF] hover:text-white transition mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Learn AI
        </Link>

        {/* Header */}
        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                resource.difficulty === "Beginner"
                  ? "bg-[#10B981]/20 text-[#10B981]"
                  : resource.difficulty === "Intermediate"
                  ? "bg-[#3B82F6]/20 text-[#60A5FA]"
                  : "bg-[#F59E0B]/20 text-[#F59E0B]"
              }`}
            >
              {resource.difficulty}
            </span>

            {resource.category && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#112040] text-white border border-[#24314F]">
                {resource.category.name}
              </span>
            )}

            {isPremiumRequired && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#7C3AED]/20 text-[#9F67FF] border border-[#7C3AED]/40">
                <Crown className="w-3 h-3 text-yellow-300" />
                PREMIUM BLUEPRINT
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {resource.title}
          </h1>

          <p className="text-base md:text-lg text-[#A7B2CC] leading-relaxed">
            {resource.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-[#6B7FA3] pt-4 border-t border-[#24314F]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Estimated Time: ~{resource.estimatedHours} Hours
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              Format: {resource.format}
            </span>
          </div>
        </header>

        {/* Tutorial Body or Premium Gate */}
        {hasAccess ? (
          <div className="space-y-8 border-t border-[#24314F]/50 pt-8">
            <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#7C3AED]" />
                Tutorial Architecture & Code Walkthrough
              </h2>

              <div className="whitespace-pre-line text-sm md:text-base text-[#E2E8F0] leading-relaxed font-normal">
                {resource.content}
              </div>

              {resource.externalUrl && (
                <div className="pt-4 border-t border-[#24314F]">
                  <a
                    href={resource.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#3B82F6] hover:bg-[#2563EB] text-white transition"
                  >
                    View Project Repository & Assets <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8 border-t border-[#24314F]/50 pt-8">
            <div className="relative p-8 rounded-2xl bg-[#0D1730] border border-[#24314F] overflow-hidden select-none filter blur-[2px] opacity-40">
              <p className="text-sm text-[#A7B2CC]">
                {resource.content.slice(0, 300)}...
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-[#0D1730] border border-[#7C3AED]/40 text-center space-y-4">
              <Crown className="w-10 h-10 text-yellow-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Premium Content</h3>
              <p className="text-sm text-[#A7B2CC] max-w-md mx-auto">
                Upgrade to Savzyen Pro to access full architectural code, repository files, and live execution notebooks.
              </p>
              <Link href="/pricing" className="btn btn-primary inline-flex items-center gap-2">
                Upgrade to Pro <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
