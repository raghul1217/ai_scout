import Link from "next/link";
import { Clock, ArrowRight, Briefcase, Megaphone, Bot } from "lucide-react";
import type { LearnChallenge } from "@/lib/learn/challenges";

const challengeIcons = {
  "1": Briefcase,
  "2": Megaphone,
  "3": Bot,
};

const difficultyBadge = {
  Beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Advanced: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

export function ChallengeCard({ challenge }: { challenge: LearnChallenge }) {
  const Icon = challengeIcons[challenge.id as keyof typeof challengeIcons] || Briefcase;

  return (
    <Link
      href={`/learn/${challenge.slug}`}
      className="card card-glow flex flex-col group overflow-hidden h-full bg-[#0D1730]/90 border border-[#24314F] hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-500/10 cursor-pointer"
    >
      {/* Visual Header / Cover Image Banner */}
      <div className={`h-48 sm:h-52 relative overflow-hidden bg-gradient-to-br ${challenge.gradient}`}>
        {challenge.coverImage ? (
          <img
            src={challenge.coverImage}
            alt={challenge.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-28 h-28 rounded-full border border-white/20 opacity-20" />
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
        )}

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1730] via-[#0D1730]/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#050816]/85 backdrop-blur-md text-white border border-[#24314F] shadow-sm">
            {challenge.badge}
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${
              difficultyBadge[challenge.difficulty]
            }`}
          >
            {challenge.difficulty}
          </span>
        </div>

        {/* Bottom Industry & Time */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
          <span className="text-[11px] font-semibold text-[#60A5FA] bg-[#050816]/90 border border-[#3B82F6]/30 px-2.5 py-0.5 rounded-md backdrop-blur-md">
            {challenge.industry}
          </span>
          <span className="text-[11px] text-[#A7B2CC] flex items-center gap-1 bg-[#050816]/90 px-2 py-0.5 rounded-md border border-[#24314F] backdrop-blur-md">
            <Clock className="w-3 h-3 text-[#6B7FA3]" />
            {challenge.estimatedTime}
          </span>
        </div>
      </div>

      {/* Card Content - Clean, focused, no heavy bulleted lists */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug mb-2.5">
            {challenge.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#A7B2CC] leading-relaxed line-clamp-3">
            {challenge.challenge}
          </p>
        </div>

        {/* Card Footer / Action */}
        <div className="pt-4 border-t border-[#24314F]/60 flex items-center justify-between">
          <span className="text-xs text-[#6B7FA3]">Interactive AI Challenge</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
            <span>Start Challenge</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

