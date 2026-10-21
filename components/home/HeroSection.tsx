import Link from "next/link";
import { ArrowRight, Zap, Users, BookOpen, Newspaper } from "lucide-react";

const highlights = [
  { icon: Zap, label: "Curated AI Tools" },
  { icon: Newspaper, label: "Daily AI News" },
  { icon: BookOpen, label: "Practical Learning" },
  { icon: Users, label: "Active Community" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden dot-grid">
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      <div className="container-max relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Pre-heading badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-sm font-medium text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              AI Discovery & Learning Platform
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              The AI world{" "}
              <span className="gradient-text">moves fast.</span>
              <br />
              Stay ahead.
            </h1>

            {/* Subheading */}
            <p className="text-lg text-[#a7b2cc] max-w-xl leading-relaxed">
              AI Scout helps you discover useful AI tools, stay updated with the latest 
              AI news, and learn through practical tutorials — all in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/community"
                id="hero-join-community-btn"
                className="btn btn-primary btn-lg"
              >
                <Users className="w-5 h-5" />
                Join the Community
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/tools"
                id="hero-explore-tools-btn"
                className="btn btn-secondary btn-lg"
              >
                Explore AI Tools
              </Link>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-4 pt-2">
              {highlights.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm text-[#a7b2cc]"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative w-full max-w-md aspect-square">
      {/* Central glowing orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 flex items-center justify-center animate-pulse-glow">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/20 border border-purple-500/30 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-brand opacity-80 flex items-center justify-center shadow-2xl">
              <Zap className="w-14 h-14 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Orbit rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-72 h-72 rounded-full border border-purple-500/10 absolute" />
        <div className="w-80 h-80 rounded-full border border-blue-500/10 absolute rotate-45" />
      </div>

      {/* Floating cards */}
      <FloatingCard
        className="absolute top-4 left-0"
        label="AI Tools"
        value="500+"
        color="purple"
      />
      <FloatingCard
        className="absolute bottom-4 right-0"
        label="AI News"
        value="Daily"
        color="blue"
      />
      <FloatingCard
        className="absolute bottom-16 left-0"
        label="Tutorials"
        value="100+"
        color="green"
      />
    </div>
  );
}

function FloatingCard({
  className,
  label,
  value,
  color,
}: {
  className?: string;
  label: string;
  value: string;
  color: "purple" | "blue" | "green";
}) {
  const colorMap = {
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-300",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    green: "border-green-500/30 bg-green-500/10 text-green-300",
  };

  return (
    <div
      className={`glass rounded-xl px-4 py-3 border ${colorMap[color]} ${className}`}
    >
      <p className="text-xs text-[#6b7fa3]">{label}</p>
      <p className="text-lg font-bold text-[#f8fafc]">{value}</p>
    </div>
  );
}
