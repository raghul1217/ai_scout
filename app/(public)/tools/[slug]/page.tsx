import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Star, CheckCircle, ShieldCheck, Tag, Zap, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await prisma.aITool.findUnique({
    where: { slug },
    select: { name: true, tagline: true, description: true },
  });

  if (!tool) {
    return { title: "Tool Not Found | AI Scout" };
  }

  return {
    title: `${tool.name} — AI Tool Review & Specs | AI Scout`,
    description: tool.tagline || tool.description,
    alternates: { canonical: `/tools/${slug}` },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const tool = await prisma.aITool.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!tool) {
    notFound();
  }

  const relatedTools = await prisma.aITool.findMany({
    where: {
      slug: { not: slug },
      ...(tool.categoryId ? { categoryId: tool.categoryId } : {}),
    },
    take: 3,
    orderBy: { rating: "desc" },
    include: { category: true },
  });

  return (
    <div className="min-h-screen py-16 bg-[#050816] text-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 space-y-10">
        {/* Navigation */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#60A5FA] hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Tools Directory
        </Link>

        {/* Hero Card */}
        <div className="bg-[#0D1730] border border-[#24314F] rounded-3xl p-8 md:p-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                {tool.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/30">
                    {tool.category.name}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#112040] text-white border border-[#24314F]">
                  {tool.pricingType}
                </span>
                {tool.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-[#16C784] bg-[#16C784]/10 border border-[#16C784]/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {tool.name}
              </h1>

              <p className="text-base font-medium text-[#9F67FF]">
                {tool.tagline}
              </p>

              <div className="flex items-center gap-2 text-sm text-[#F59E0B] pt-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-white">{tool.rating.toFixed(1)} / 5.0</span>
                <span className="text-[#6B7FA3]">({tool.reviewCount} community evaluations)</span>
              </div>
            </div>

            {/* CTA action box */}
            <div className="p-6 rounded-2xl bg-[#112040] border border-[#24314F] flex flex-col justify-between space-y-4 md:w-64">
              <div>
                <span className="text-xs text-[#6B7FA3] uppercase tracking-wider block">Pricing Starts At</span>
                <span className="text-xl font-bold text-white">{tool.priceStart ?? "Free"}</span>
              </div>
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 transition shadow-lg shadow-[#7C3AED]/20"
              >
                Visit Website <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Deep Dive & Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Overview & Benchmark Notes</h2>
              <p className="text-sm md:text-base text-[#A7B2CC] leading-relaxed whitespace-pre-line">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Evaluation Highlights</h3>
              <ul className="text-xs text-[#A7B2CC] space-y-3">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16C784] shrink-0 mt-0.5" />
                  <span>Manual inspection for telemetry & data security compliance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                  <span>Standardized latency and inference output speed tests.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="pt-8 border-t border-[#24314F] space-y-6">
            <h3 className="text-xl font-bold text-white">Alternative & Complementary Tools</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedTools.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/tools/${rel.slug}`}
                  className="bg-[#0D1730] border border-[#24314F] hover:border-[#3B82F6] rounded-2xl p-5 transition group flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-[#60A5FA] transition mb-1">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-[#A7B2CC] line-clamp-2">
                      {rel.tagline}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#F59E0B] pt-4 mt-2 border-t border-[#24314F]/50">
                    <span className="flex items-center gap-1 font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      {rel.rating.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-[#60A5FA] group-hover:translate-x-0.5 transition flex items-center gap-1">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
