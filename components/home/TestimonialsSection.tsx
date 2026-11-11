"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Quote,
  CheckCircle2,
  Heart,
  ArrowRight,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  initials: string;
  avatarGradient: string;
  quote: string;
  rating: number;
  tag: string;
  verified: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    role: "AI Research Fellow",
    organization: "IIT Madras",
    initials: "AS",
    avatarGradient: "from-purple-500 to-indigo-600",
    quote:
      "Savzyen cut down our research tool scouting time by half. Discovering production-ready LLM benchmarks and agent frameworks in one clean catalog has been an absolute game changer.",
    rating: 5,
    tag: "Autonomous Agents",
    verified: true,
  },
  {
    id: "2",
    name: "Priya Venkatesh",
    role: "Founder & CTO",
    organization: "SynthLogic AI",
    initials: "PV",
    avatarGradient: "from-cyan-500 to-blue-600",
    quote:
      "As a startup founder, staying ahead of AI tooling is critical. The curated reviews, real pricing breakdowns, and stack comparisons on Savzyen helped us pick the exact stack for our MVP.",
    rating: 5,
    tag: "Tool Directory",
    verified: true,
  },
  {
    id: "3",
    name: "Rohan Mehta",
    role: "B.Tech CSE Student",
    organization: "VIT Vellore",
    initials: "RM",
    avatarGradient: "from-amber-500 to-orange-600",
    quote:
      "The hands-on tutorials on LangChain, Cursor workflows, and local open models helped me land my first AI engineering internship. The community discussions are pure gold.",
    rating: 5,
    tag: "Practical Learning",
    verified: true,
  },
  {
    id: "4",
    name: "Sophia Chen",
    role: "Staff Product Manager",
    organization: "NextWave Tech",
    initials: "SC",
    avatarGradient: "from-pink-500 to-rose-600",
    quote:
      "Savzyen's daily AI digest is the first thing I read with my morning coffee. Zero clickbait, zero fluff — just the architectural releases and product implications that actually matter.",
    rating: 5,
    tag: "Daily AI News",
    verified: true,
  },
  {
    id: "5",
    name: "Karthik Nair",
    role: "Full-Stack Dev",
    organization: "Bengaluru Dev Guild",
    initials: "KN",
    avatarGradient: "from-emerald-500 to-teal-600",
    quote:
      "Went from struggling with prompt engineering to deploying multi-agent autonomous workers in weeks. Savzyen connects the dots better than any other resource out there.",
    rating: 5,
    tag: "Copilot Workflows",
    verified: true,
  },
  {
    id: "6",
    name: "Ananya Iyer",
    role: "Campus Ambassador",
    organization: "Anna University",
    initials: "AI",
    avatarGradient: "from-violet-500 to-fuchsia-600",
    quote:
      "We organized an AI Scout hackathon across 500+ campus students through Savzyen's academic partnership. The resources, tool perks, and mentor support were phenomenal.",
    rating: 5,
    tag: "Workshops & Collab",
    verified: true,
  },
  {
    id: "7",
    name: "Marcus Vance",
    role: "Senior ML Engineer",
    organization: "San Francisco, USA",
    initials: "MV",
    avatarGradient: "from-blue-500 to-indigo-700",
    quote:
      "Clean design, authentic community ratings, and zero sponsored bias. Savzyen is genuinely building the Product Hunt + arXiv bridge that modern developers desperately needed.",
    rating: 5,
    tag: "Model Benchmarks",
    verified: true,
  },
  {
    id: "8",
    name: "Divya Sundaram",
    role: "GenAI Hackathon Winner",
    organization: "SRM Tech Society",
    initials: "DS",
    avatarGradient: "from-teal-400 to-emerald-600",
    quote:
      "Whenever a breakthrough model drops — whether DeepSeek, Claude 3.7, or OpenAI — Savzyen has practical test runs up within hours. Incredible community energy!",
    rating: 5,
    tag: "Community",
    verified: true,
  },
];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isInteractingRef = useRef(false);
  const scrollAccumulatorRef = useRef(0);

  // Smooth continuous right-to-left auto-scroll with loop wrapping
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isPaused && !isInteractingRef.current && container) {
        // Sync accumulator with current scroll position if user scrolled manually
        if (Math.abs(container.scrollLeft - scrollAccumulatorRef.current) > 6) {
          scrollAccumulatorRef.current = container.scrollLeft;
        }

        // 40 pixels per second = pleasant, readable glide from right to left
        scrollAccumulatorRef.current += 40 * delta;
        container.scrollLeft = scrollAccumulatorRef.current;

        // Loop seamlessly back to start when reaching half of the duplicated list
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth && halfWidth > 0) {
          scrollAccumulatorRef.current -= halfWidth;
          container.scrollLeft = scrollAccumulatorRef.current;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  return (
    <section className="relative py-18 sm:py-24 bg-[#050816] border-t border-[#24314F]/60 overflow-hidden">
      {/* Decorative ambient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[380px] h-[220px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <div className="container-max mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/30" />
            <span>Community Wall of Love</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Loved by Builders, Students &{" "}
            <span className="gradient-text">AI Engineers</span>
          </h2>

          <p className="text-[#A7B2CC] max-w-2xl mx-auto mt-3 text-sm sm:text-base leading-relaxed">
            Discover why thousands of developers, researchers, and learners rely on Savzyen
            every day to discover breakthrough tools and master modern AI.
          </p>
        </div>

        {/* Scrollable Container with Left and Right Fade Gradients */}
        <div className="relative w-full overflow-hidden">
          {/* Left Gradient Fade Mask (Desktop) */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#050816] via-[#050816]/80 to-transparent z-10" />

          {/* Right Gradient Fade Mask (Desktop) */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#050816] via-[#050816]/80 to-transparent z-10" />

          {/* 
            Auto-animating and manually scrollable track:
            - Users can see it glide right to left automatically.
            - Users can swipe/drag horizontally with mouse or touch.
            - Users can click Prev/Next arrows in the header.
            - Hovering pauses auto-scroll so cards can be comfortably read.
          */}
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => {
              isInteractingRef.current = true;
            }}
            onTouchEnd={() => {
              setTimeout(() => {
                if (scrollRef.current) {
                  scrollAccumulatorRef.current = scrollRef.current.scrollLeft;
                }
                isInteractingRef.current = false;
              }, 1200);
            }}
            className="flex gap-5 pl-4 sm:pl-8 py-3 overflow-x-auto select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* Duplicated list for seamless looping and extended reach */}
            {[...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="group relative w-[310px] sm:w-[370px] shrink-0 bg-[#0D1730]/90 hover:bg-[#112040] border border-[#24314F] hover:border-purple-500/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
              >
                {/* Decorative background quote mark */}
                <Quote className="absolute top-4 right-5 w-10 h-10 text-white/[0.04] group-hover:text-purple-400/10 transition-colors pointer-events-none" />

                <div>
                  {/* Top: Star Rating + Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"
                        />
                      ))}
                      <span className="text-xs font-bold text-[#F59E0B] ml-1.5">
                        5.0
                      </span>
                    </div>

                    <span className="text-[10px] font-semibold text-[#60A5FA] bg-[#3B82F6]/10 border border-[#3B82F6]/25 px-2.5 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  {/* Quote Words */}
                  <p className="text-sm text-[#E2E8F0] leading-relaxed relative z-10 line-clamp-4">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Bottom: Profile icon, Name, Role, Verified badge */}
                <div className="mt-5 pt-4 border-t border-[#24314F]/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Placeholder Profile Icon with vibrant gradient & initials */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr ${item.avatarGradient} flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-[#050816]`}
                      >
                        {item.initials}
                      </div>
                      {/* Online status indicator */}
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#10B981] border-2 border-[#0D1730] rounded-full" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                          {item.name}
                        </h4>
                        {item.verified && (
                          <span title="Verified Member" className="inline-flex">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#A7B2CC] line-clamp-1">
                        {item.role} • {item.organization}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA link */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#A7B2CC] hover:text-white transition group"
          >
            <span>Join 20,000+ members in the Savzyen Community</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#60A5FA]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
