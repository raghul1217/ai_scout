import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { LEARN_CHALLENGES } from "@/lib/learn/challenges";
import { ChallengeCard } from "@/components/learn/ChallengeCard";

export function LearnSection() {
  return (
    <section className="py-20 sm:py-24 bg-[#0a1024] relative overflow-hidden" id="learn-section">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[250px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container-max relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>Applied AI Challenges</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Learn AI by Doing{" "}
              <span className="gradient-text">— 3 AI-Only Challenges</span>
            </h2>

            <p className="text-[#A7B2CC] max-w-2xl mt-3 text-sm sm:text-base leading-relaxed">
              Step into the role of a founder, marketer, or AI engineer. Complete practical workflows
              using actual prompts, modern tool stacks, and concrete deliverables.
            </p>
          </div>

          <Link
            href="/learn"
            className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#60A5FA] hover:text-white transition group self-start sm:self-auto shrink-0"
          >
            <span>Explore All Resources</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 AI-Only Challenges Grid - Clean vertical cards without modal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {LEARN_CHALLENGES.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {/* Mobile View All button */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/learn" className="btn btn-secondary btn-sm">
            <span>Explore All Resources</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
