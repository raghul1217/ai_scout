"use client";

import { Zap } from "lucide-react";

// AI Tool Icon SVGs (Custom optimized brand SVGs)
function ChatGPTLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#10A37F" />
      <path
        d="M17.2 10.7a3.4 3.4 0 0 0-.3-2.3 3.5 3.5 0 0 0-3.3-1.8 3.5 3.5 0 0 0-1.2-1.3 3.5 3.5 0 0 0-3.8.4 3.5 3.5 0 0 0-2.3.8 3.5 3.5 0 0 0-1.2 3.6 3.5 3.5 0 0 0-1 2.4c0 1 .5 2 1.3 2.7a3.5 3.5 0 0 0 .3 2.3 3.5 3.5 0 0 0 3.3 1.8c.4 0 .7 0 1.1-.2a3.5 3.5 0 0 0 3.9-.4 3.5 3.5 0 0 0 2.3-.8 3.5 3.5 0 0 0 1.2-3.6 3.5 3.5 0 0 0 1-2.4c0-1.1-.4-2.1-1.3-2.7z"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CursorLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#18181B" />
      <path
        d="M6 6L17.5 12L12 13.5L10 18.5L6 6Z"
        fill="#FFFFFF"
        stroke="#60A5FA"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#0A0A0A" />
      <path
        d="M13.5 3L6 13.5H12L10.5 21L18 10.5H12L13.5 3Z"
        fill="#FBBF24"
        stroke="#F59E0B"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClaudeLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#CC5A36" />
      <path
        d="M12 4.5V19.5M4.5 12H19.5M6.7 6.7L17.3 17.3M6.7 17.3L17.3 6.7"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PerplexityLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#132F38" />
      <circle cx="12" cy="12" r="5" stroke="#22B8CD" strokeWidth="2" />
      <path d="M12 3V7M12 17V21M3 12H7M17 12H21" stroke="#22B8CD" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DeepSeekLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#0D2149" />
      <path
        d="M6 14C8 10 13 8 18 10C16 14 12 16 6 14Z"
        fill="#38BDF8"
        stroke="#60A5FA"
        strokeWidth="1.2"
      />
      <circle cx="15" cy="11" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] aspect-square flex items-center justify-center select-none shrink-0">
      {/* Background radial ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-blue-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ─── SVG Orbital Tracks ─── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
        <defs>
          <linearGradient id="orbit-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="orbit-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer Orbit Ring (Radius 200) */}
        <circle
          cx="250"
          cy="250"
          r="200"
          fill="none"
          stroke="url(#orbit-grad-2)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          className="opacity-70"
        />

        {/* Inner Orbit Ring (Radius 130) */}
        <circle
          cx="250"
          cy="250"
          r="130"
          fill="none"
          stroke="url(#orbit-grad-1)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-80"
        />

        {/* Decorative ambient ring */}
        <circle
          cx="250"
          cy="250"
          r="72"
          fill="none"
          stroke="rgba(147, 51, 234, 0.2)"
          strokeWidth="1"
        />
      </svg>

      {/* ─── Center Savzyen Core ─── */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        {/* Pulsing ring aura */}
        <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-purple-600/35 via-blue-500/25 to-purple-400/35 blur-xl animate-pulse" />

        {/* Core emblem */}
        <div className="relative w-24 h-24 rounded-2xl bg-gradient-brand p-[2px] shadow-2xl shadow-purple-500/40 group cursor-default">
          <div className="w-full h-full rounded-[14px] bg-[#0A0E23] flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md">
            {/* Shimmer flare inside core */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-500/10 to-transparent -translate-y-full hover:translate-y-full transition-transform duration-1000" />

            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-purple-500/50 mb-1">
              <Zap className="w-6 h-6 text-white fill-white animate-pulse" />
            </div>

            <span className="text-[11px] font-black tracking-wider text-white uppercase">
              Sav<span className="gradient-text">zyen</span>
            </span>
          </div>
        </div>

        {/* Core Tag */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0D1730]/90 border border-purple-500/30 text-[10px] font-semibold text-purple-300 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
          <span>AI Engine</span>
        </div>
      </div>

      {/* ─── Inner Orbit (Clockwise 24s) ─── */}
      {/* Diameter 260px (radius 130px) */}
      <div className="absolute w-[260px] h-[260px] rounded-full pointer-events-none animate-[spin_24s_linear_infinite]">
        {/* ChatGPT — Top (0 deg) */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="animate-[spin_24s_linear_infinite_reverse]">
            <ToolOrbitBadge
              logo={<ChatGPTLogo className="w-5 h-5" />}
              name="ChatGPT"
              category="LLM"
              glowColor="hover:border-emerald-500/50 hover:shadow-emerald-500/20"
            />
          </div>
        </div>

        {/* Cursor — Right (90 deg) */}
        <div className="absolute top-1/2 -right-5 -translate-y-1/2 pointer-events-auto">
          <div className="animate-[spin_24s_linear_infinite_reverse]">
            <ToolOrbitBadge
              logo={<CursorLogo className="w-5 h-5" />}
              name="Cursor"
              category="Coding"
              glowColor="hover:border-blue-500/50 hover:shadow-blue-500/20"
            />
          </div>
        </div>

        {/* Bolt.new — Bottom (180 deg) */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="animate-[spin_24s_linear_infinite_reverse]">
            <ToolOrbitBadge
              logo={<BoltLogo className="w-5 h-5" />}
              name="Bolt.new"
              category="Dev"
              glowColor="hover:border-amber-500/50 hover:shadow-amber-500/20"
            />
          </div>
        </div>

        {/* Claude — Left (270 deg) */}
        <div className="absolute top-1/2 -left-5 -translate-y-1/2 pointer-events-auto">
          <div className="animate-[spin_24s_linear_infinite_reverse]">
            <ToolOrbitBadge
              logo={<ClaudeLogo className="w-5 h-5" />}
              name="Claude 3.7"
              category="Reasoning"
              glowColor="hover:border-orange-500/50 hover:shadow-orange-500/20"
            />
          </div>
        </div>
      </div>

      {/* ─── Outer Orbit (Counter-Clockwise 36s) ─── */}
      {/* Diameter 400px (radius 200px) */}
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none animate-[spin_36s_linear_infinite_reverse]">
        {/* Perplexity — Top-Right */}
        <div className="absolute top-[44px] right-[44px] pointer-events-auto">
          <div className="animate-[spin_36s_linear_infinite]">
            <ToolOrbitBadge
              logo={<PerplexityLogo className="w-5 h-5" />}
              name="Perplexity"
              category="Search"
              glowColor="hover:border-cyan-500/50 hover:shadow-cyan-500/20"
            />
          </div>
        </div>

        {/* DeepSeek — Bottom-Left */}
        <div className="absolute bottom-[44px] left-[44px] pointer-events-auto">
          <div className="animate-[spin_36s_linear_infinite]">
            <ToolOrbitBadge
              logo={<DeepSeekLogo className="w-5 h-5" />}
              name="DeepSeek"
              category="Open Weights"
              glowColor="hover:border-sky-500/50 hover:shadow-sky-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponent for orbiting tool badge
function ToolOrbitBadge({
  logo,
  name,
  category,
  glowColor,
}: {
  logo: React.ReactNode;
  name: string;
  category: string;
  glowColor: string;
}) {
  return (
    <div
      className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#0D1730]/95 border border-[#24314F] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer ${glowColor}`}
    >
      <div className="shrink-0">{logo}</div>
      <div className="hidden sm:flex flex-col text-left">
        <span className="text-[11px] font-bold text-white group-hover:text-purple-300 transition-colors leading-tight whitespace-nowrap">
          {name}
        </span>
        <span className="text-[9px] text-[#6B7FA3] font-medium leading-none whitespace-nowrap">
          {category}
        </span>
      </div>
    </div>
  );
}
