import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Lock, Crown, ArrowRight, Terminal, BookOpen, ShieldCheck, Check } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await prisma.learningResource.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!res) {
    return { title: "Tutorial Not Found | AI Scout" };
  }

  return {
    title: `${res.title} | AI Scout Learn`,
    description: res.description,
    alternates: { canonical: `/learn/${slug}` },
  };
}

export default async function LearnDetailPage({ params }: PageProps) {
  const { slug } = await params;

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
          /* Server-Side Premium Gate */
          <div className="space-y-8 border-t border-[#24314F]/50 pt-8">
            {/* Locked Teaser Preview */}
            <div className="relative p-8 rounded-2xl bg-[#0D1730] border border-[#24314F] overflow-hidden select-none filter blur-[2px] opacity-40">
              <p className="text-sm text-gray-400">
                In this advanced architecture, we implement hybrid vector retrieval using reciprocal rank fusion. First, initialize the database client connection pool and configure pgvector distance metrics…
              </p>
              <div className="my-4 p-4 rounded-xl bg-black/60 font-mono text-xs text-green-400">
                export async function hybridSearch(query: string, options: SearchOptions) &#123; ... &#125;
              </div>
              <p className="text-sm text-gray-400">
                Next, apply cross-encoder re-ranking to filter the top 20 candidate nodes down to 5 highest-precision contexts…
              </p>
            </div>

            {/* Gate CTA */}
            <div className="relative rounded-2xl p-8 border border-[#7C3AED]/50 bg-gradient-to-b from-[#0D1730] to-[#112040] shadow-2xl shadow-[#7C3AED]/10 text-center space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center mx-auto text-[#9F67FF]">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Unlock This Production Blueprint
                </h2>
                <p className="text-xs md:text-sm text-[#A7B2CC] max-w-md mx-auto mt-2 leading-relaxed">
                  Join AI Scout Pro to access full source repositories, step-by-step code walkthroughs, and direct author support.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 transition shadow-lg shadow-[#7C3AED]/25 flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 text-yellow-300" />
                  Upgrade to Pro
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {!user && (
                  <Link
                    href={`/login?returnUrl=/learn/${slug}`}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-[#0D1730] border border-[#24314F] text-[#A7B2CC] hover:text-white transition"
                  >
                    Log In to Access
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
