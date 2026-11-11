import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { HeroVisual } from "./HeroVisual";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] lg:h-[calc(100vh-4rem)] flex items-center overflow-hidden dot-grid">
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      <div className="container-max relative z-10 w-full py-4 sm:py-6 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-5 lg:space-y-6">
            {/* Pre-heading badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs sm:text-sm font-medium text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              AI Discovery & Learning Platform
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold leading-[1.15] tracking-tight">
              The AI world{" "}
              <span className="gradient-text">moves fast.</span>
              <br />
              Stay ahead.
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base lg:text-lg text-[#a7b2cc] max-w-lg leading-relaxed">
              Savzyen helps you discover useful AI tools, stay updated with the latest 
              AI news, and learn through practical tutorials — all in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3.5 pt-1">
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
          </div>

          {/* Right: Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* Subtle Scroll Cue at the bottom */}
      <div className="hidden lg:flex absolute bottom-3 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[#6B7FA3]/60 pointer-events-none">
        <span>Scroll</span>
        <div className="w-3.5 h-6 rounded-full border border-[#24314F] flex justify-center p-1">
          <div className="w-1 h-1.5 rounded-full bg-[#60A5FA] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
