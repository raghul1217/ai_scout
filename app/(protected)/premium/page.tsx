import type { Metadata } from "next";
import Link from "next/link";
import { requirePremium } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Crown, Sparkles, BookOpen, Download, Terminal, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Member Vault | AI Scout",
  description: "Exclusive tutorials, architectural blueprints, and prompt libraries for AI Scout Premium members.",
};

export default async function PremiumVaultPage() {
  const user = await requirePremium();

  // Fetch premium articles and learning resources
  const [premiumArticles, premiumResources] = await Promise.all([
    prisma.article.findMany({
      where: {
        accessLevel: "PREMIUM",
        status: "PUBLISHED",
      },
      include: { category: true },
      take: 6,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.learningResource.findMany({
      where: {
        accessLevel: "PREMIUM",
      },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Banner */}
        <div className="relative rounded-3xl p-8 md:p-12 border border-[#7C3AED]/40 bg-gradient-to-r from-[#0D1730] via-[#112040] to-[#0A1024] overflow-hidden shadow-2xl shadow-[#7C3AED]/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#7C3AED]/20 to-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-xs font-semibold text-[#9F67FF] mb-4">
              <Crown className="w-3.5 h-3.5 text-yellow-300" />
              Verified Premium Member
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
              The AI Scout <span className="text-gradient">Member Vault</span>
            </h1>
            <p className="text-sm md:text-base text-[#A7B2CC] leading-relaxed mb-6">
              Welcome, {user.name}. You have unrestricted access to production AI blueprints, multi-agent frameworks, enterprise prompt templates, and direct author discussions.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#16C784]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Full Archive Unlocked
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Priority API Templates
              </span>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-6 h-6 text-[#7C3AED]" />
                Exclusive Blueprints & Tutorials
              </h2>
              <p className="text-sm text-[#A7B2CC]">In-depth hands-on guides reserved exclusively for members.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumResources.length === 0 ? (
              <div className="col-span-full py-12 text-center border border-dashed border-[#24314F] rounded-2xl bg-[#0D1730]/40">
                <p className="text-sm text-[#6B7FA3]">
                  Premium blueprints are syncing. Check back shortly!
                </p>
              </div>
            ) : (
              premiumResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-[#0D1730] border border-[#24314F] hover:border-[#7C3AED] rounded-2xl p-6 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-[#9F67FF] uppercase tracking-wider">
                        {res.category?.name ?? "Special"}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7C3AED]/20 text-[#9F67FF] border border-[#7C3AED]/30">
                        PREMIUM
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#60A5FA] transition mb-2">
                      {res.title}
                    </h3>
                    <p className="text-xs text-[#A7B2CC] line-clamp-3 leading-relaxed mb-4">
                      {res.description}
                    </p>
                  </div>
                  <Link
                    href={`/learn/${res.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B82F6] group-hover:text-white transition"
                  >
                    Open Blueprint <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Exclusive Articles Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#3B82F6]" />
                Premium Intelligence Reports
              </h2>
              <p className="text-sm text-[#A7B2CC]">Deep dives into commercial AI benchmarks and emerging model architectures.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {premiumArticles.length === 0 ? (
              <div className="col-span-full py-12 text-center border border-dashed border-[#24314F] rounded-2xl bg-[#0D1730]/40">
                <p className="text-sm text-[#6B7FA3]">
                  No reports published yet in this cycle.
                </p>
              </div>
            ) : (
              premiumArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-[#0D1730] border border-[#24314F] hover:border-[#3B82F6] rounded-2xl p-6 transition group"
                >
                  <div className="flex items-center gap-2 text-xs text-[#6B7FA3] mb-3">
                    <span>{article.category?.name ?? "Intelligence"}</span>
                    <span>•</span>
                    <span>{article.readTimeMinutes} min read</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#60A5FA] transition mb-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#A7B2CC] line-clamp-2 leading-relaxed mb-4">
                    {article.summary}
                  </p>
                  <Link
                    href={`/news/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B82F6] group-hover:text-white transition"
                  >
                    Read Member Report <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
