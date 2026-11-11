"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ExternalLink, CheckCircle } from "lucide-react";

export interface ToolCardProps {
  tool: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    description: string;
    websiteUrl: string;
    logoUrl?: string | null;
    pricingType: "FREE" | "FREEMIUM" | "PAID";
    priceStart?: string | null;
    isVerified?: boolean;
    rating: number;
    reviewCount: number;
    category?: {
      name: string;
      slug: string;
    } | null;
  };
}

export function ToolCard({ tool }: ToolCardProps) {
  const [imgError, setImgError] = useState(false);

  // Derive domain for fallback favicon
  let fallbackDomain = "";
  try {
    fallbackDomain = new URL(tool.websiteUrl).hostname.replace(/^www\./, "");
  } catch {
    fallbackDomain = "";
  }

  const initialLogo =
    tool.logoUrl ||
    (fallbackDomain
      ? `https://www.google.com/s2/favicons?domain=${fallbackDomain}&sz=128`
      : null);

  const initials = tool.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="group relative bg-[#0D1730] hover:bg-[#112040] border border-[#24314F] hover:border-[#3B82F6]/60 rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3B82F6]/5 flex flex-col justify-between">
      <div>
        {/* Top Header: Logo + Name + Pricing Badge */}
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo */}
            <div className="w-9 h-9 rounded-lg bg-[#070D1F] border border-[#24314F] flex items-center justify-center shrink-0 overflow-hidden">
              {initialLogo && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={initialLogo}
                  alt={`${tool.name} logo`}
                  className="w-5 h-5 object-contain"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  {initials}
                </span>
              )}
            </div>

            {/* Name + Category */}
            <div className="min-w-0">
              <Link
                href={`/tools/${tool.slug}`}
                className="font-bold text-sm text-white group-hover:text-[#60A5FA] transition flex items-center gap-1 truncate"
              >
                <span className="truncate">{tool.name}</span>
                {tool.isVerified && (
                  <span title="Verified by Savzyen" className="shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                  </span>
                )}
              </Link>
              <p className="text-[11px] font-medium text-[#6B7FA3] truncate">
                {tool.category?.name ?? "AI Utility"}
              </p>
            </div>
          </div>

          {/* Pricing Pill */}
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
              tool.pricingType === "FREE"
                ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                : tool.pricingType === "FREEMIUM"
                ? "bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30"
                : "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
            }`}
          >
            {tool.pricingType}
          </span>
        </div>

        {/* Short 2-line Description */}
        <p className="text-xs text-[#A7B2CC] line-clamp-2 leading-relaxed min-h-[34px] mb-3">
          {tool.description || tool.tagline}
        </p>
      </div>

      {/* Footer: Rating + Visit Button */}
      <div className="pt-2.5 border-t border-[#24314F]/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-[#F59E0B] font-semibold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{tool.rating.toFixed(1)}</span>
          <span className="text-[#6B7FA3] font-normal text-[11px]">
            ({tool.reviewCount})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/tools/${tool.slug}`}
            className="text-[11px] font-medium text-[#6B7FA3] hover:text-[#F8FAFC] transition"
          >
            Overview
          </Link>
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#112040] hover:bg-[#3B82F6] text-white border border-[#24314F] hover:border-[#3B82F6] transition"
            onClick={(e) => e.stopPropagation()}
          >
            Visit <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
