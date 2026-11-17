import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requirePremium } from "@/lib/auth/session";
import {
  Crown,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Flame,
  GitFork,
  Cpu,
  Terminal,
  Bot,
  Server,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  Globe,
  MessageSquare,
  BookOpen,
  Layers,
  Video,
  Play,
  ArrowRight,
  Code2,
  DollarSign,
  Eye,
  Clock,
  Wrench,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Member Vault | Savzyen",
  description:
    "Weekly intelligence briefings, vetted agent repositories, curated developer tools, and hands-on engineering challenges for Savzyen Premium members.",
};

export default async function PremiumVaultPage() {
  const user = await requirePremium();

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] pb-24 pt-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* ─── VAULT HERO HEADER ───────────────────────────────────────────── */}
        <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-[#7C3AED]/40 bg-gradient-to-r from-[#0D1730] via-[#112040] to-[#0A1024] overflow-hidden shadow-2xl shadow-[#7C3AED]/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#7C3AED]/20 to-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-xs font-bold text-[#C4B5FD] uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-yellow-300" />
                SAVZYEN PREMIUM VAULT
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Access
              </span>
              <span className="text-xs text-[#6B7FA3]">
                • Weekly Edition
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
              Weekly Intelligence &amp;{" "}
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">
                Engineering Brief
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#A7B2CC] leading-relaxed mb-6">
              Welcome, <strong className="text-white font-semibold">{user.name}</strong>. Here is your private weekly dossier: Qwen 4 Max benchmark intelligence, building your own autonomous Grok Bot for free with OpenMausBot, executive security deep dives, and production agent deployment walkthroughs.
            </p>

            {/* Quick In-Page Navigation */}
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href="#qwen-4-max"
                className="px-3 py-1.5 rounded-lg bg-[#112040] hover:bg-[#3B82F6] text-[#CBD5E1] hover:text-white border border-[#24314F] transition"
              >
                Qwen 4 Max Deep Dive ↓
              </a>
              <a
                href="#grok-bot"
                className="px-3 py-1.5 rounded-lg bg-[#112040] hover:bg-[#3B82F6] text-[#CBD5E1] hover:text-white border border-[#24314F] transition"
              >
                Build Grok Bot for Free ↓
              </a>
              <a
                href="#breaking-intelligence"
                className="px-3 py-1.5 rounded-lg bg-[#112040] hover:bg-[#3B82F6] text-[#CBD5E1] hover:text-white border border-[#24314F] transition"
              >
                Top Stories &amp; Audits ↓
              </a>
              <a
                href="#tools-of-the-week"
                className="px-3 py-1.5 rounded-lg bg-[#112040] hover:bg-[#3B82F6] text-[#CBD5E1] hover:text-white border border-[#24314F] transition"
              >
                Tools of the Week ↓
              </a>
              <a
                href="#problem-of-the-week"
                className="px-3 py-1.5 rounded-lg bg-[#112040] hover:bg-[#3B82F6] text-[#CBD5E1] hover:text-white border border-[#24314F] transition"
              >
                Weekly Challenge Walkthrough ↓
              </a>
            </div>
          </div>
        </div>

        {/* ─── NEW STORY 1: ALIBABA QWEN 4 MAX ───────────────────────────── */}
        <section id="qwen-4-max" className="space-y-6 scroll-mt-20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
              <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest">
                Frontier Model Release • Benchmarks &amp; Efficiency
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              What If You Could Build Software with AI at a Fraction of the Cost of Claude?
            </h2>
            <p className="text-xs sm:text-sm text-[#A7B2CC] mt-1">
              Alibaba has unveiled Qwen 4 Max — a new flagship model making waves across autonomous coding and enterprise AI development.
            </p>
          </div>

          <article className="bg-[#0D1730] border border-[#24314F] rounded-2xl overflow-hidden hover:border-[#8B5CF6]/60 transition shadow-xl">
            <div className="p-5 sm:p-8 space-y-6">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#24314F]/60 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD] uppercase tracking-wide">
                    Flagship Benchmark
                  </span>
                  <span className="text-xs text-[#6B7FA3]">Alibaba Cloud • Qwen Team</span>
                </div>
                <span className="text-xs font-medium text-emerald-400">
                  DeepSui Score: 75.7
                </span>
              </div>

              {/* Main Lead Paragraphs */}
              <div className="text-sm text-[#CBD5E1] space-y-3 leading-relaxed">
                <p>
                  Building production-grade software with frontier AI agents has traditionally demanded premium API pricing from Claude and OpenAI. Alibaba&apos;s new flagship <strong className="text-white">Qwen 4 Max</strong> introduces frontier-tier coding performance, massive 1M token context windows, and dramatic cost reductions that shift the unit economics of AI engineering.
                </p>
                <p>
                  Here is why developers, software architects, and tech businesses should pay close attention.
                </p>
              </div>

              {/* Hero Image */}
              <div className="pt-2">
                <div className="rounded-xl overflow-hidden border border-[#24314F] bg-[#050816]">
                  <Image
                    src="/assets/premium_page/day2/qwen.jpeg"
                    alt="Alibaba Qwen 4 Max Model Breakdown and Benchmarks"
                    width={1200}
                    height={675}
                    priority
                    className="w-full h-auto object-cover max-h-[550px]"
                  />
                </div>
                <p className="text-[11px] text-[#6B7FA3] mt-2 text-center">
                  Qwen 4 Max architecture evaluation: frontier coding throughput and cost optimization
                </p>
              </div>

              {/* 4 Main Highlights Grid */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#8B5CF6]" />
                  Main Architectural Highlights
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Highlight 1 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#050816] border border-[#24314F] hover:border-[#8B5CF6]/50 transition space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#8B5CF6]/20 text-[#C4B5FD] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        01
                      </span>
                      <h4 className="font-bold text-sm text-white">
                        Impressive Coding Performance
                      </h4>
                    </div>
                    <ul className="text-xs text-[#A7B2CC] space-y-1.5 pl-8 list-disc">
                      <li>
                        Scored <strong className="text-white">75.7</strong> on the reported DeepSui benchmark.
                      </li>
                      <li>
                        Reportedly outperformed Claude Opus 5.5 on this standardized evaluation.
                      </li>
                      <li>
                        Engineered specifically for multi-file codebases and autonomous software development.
                      </li>
                    </ul>
                  </div>

                  {/* Highlight 2 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#050816] border border-[#24314F] hover:border-[#3B82F6]/50 transition space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#3B82F6]/20 text-[#60A5FA] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        02
                      </span>
                      <h4 className="font-bold text-sm text-white">
                        1 Million Token Context Window
                      </h4>
                    </div>
                    <ul className="text-xs text-[#A7B2CC] space-y-1.5 pl-8 list-disc">
                      <li>
                        Process entire multi-repository codebases without manual chunking.
                      </li>
                      <li>
                        Ingest massive architectural blueprints, PDFs, and documentation sets.
                      </li>
                      <li>
                        Maintain persistent memory across complex, multi-step agent workflows.
                      </li>
                    </ul>
                  </div>

                  {/* Highlight 3 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#050816] border border-[#24314F] hover:border-[#10B981]/50 transition space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#10B981]/20 text-[#34D399] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        03
                      </span>
                      <h4 className="font-bold text-sm text-white">
                        Multimodal Capabilities
                      </h4>
                    </div>
                    <ul className="text-xs text-[#A7B2CC] space-y-1.5 pl-8 list-disc">
                      <li>
                        Native cross-attention comprehension across text, high-res images, and video.
                      </li>
                      <li>
                        Unlocks automated video analysis, UI test automation, and screen auditing.
                      </li>
                      <li>
                        Transcribes and reasons over diagrams, architectural wireframes, and charts.
                      </li>
                    </ul>
                  </div>

                  {/* Highlight 4 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#050816] border border-[#24314F] hover:border-amber-500/50 transition space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        04
                      </span>
                      <h4 className="font-bold text-sm text-white">
                        Significantly Lower Costs
                      </h4>
                    </div>
                    <ul className="text-xs text-[#A7B2CC] space-y-1.5 pl-8 list-disc">
                      <li>
                        Uses up to <strong className="text-emerald-400">50% fewer tokens</strong> than previous flagship releases according to Alibaba.
                      </li>
                      <li>
                        Reduces average task execution costs by <strong className="text-emerald-400">over 60%</strong>.
                      </li>
                      <li>
                        Makes enterprise-scale autonomous AI adoption commercially viable.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Where Can You Use It */}
              <div className="p-5 rounded-xl bg-[#050816] border border-[#24314F] space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#8B5CF6]" />
                  Where Can You Use It in Production?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0D1730] border border-[#24314F] text-[#CBD5E1] flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
                    <span>AI Coding Agents</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D1730] border border-[#24314F] text-[#CBD5E1] flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                    <span>Website &amp; Frontend Development</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D1730] border border-[#24314F] text-[#CBD5E1] flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>Business Process Automation</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D1730] border border-[#24314F] text-[#CBD5E1] flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-[#C4B5FD] shrink-0" />
                    <span>Autonomous AI Applications</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D1730] border border-[#24314F] text-[#CBD5E1] flex items-center gap-2 sm:col-span-2 md:col-span-2">
                    <Video className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Video Intelligence &amp; Multi-Modal Auditing</span>
                  </div>
                </div>
              </div>

              {/* Mission Callout */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#7C3AED]/20 to-[#3B82F6]/10 border border-[#7C3AED]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <span className="font-bold text-white tracking-wide">
                  Become the Top 1% in the AI Era.
                </span>
                <span className="text-[#A7B2CC] font-mono text-xs uppercase tracking-wider">
                  SAVZYEN | AI Intelligence for the Future
                </span>
              </div>
            </div>
          </article>
        </section>

        {/* ─── NEW STORY 2: BUILD YOUR OWN GROK BOT FOR FREE (OPENMAUSBOT) ── */}
        <section id="grok-bot" className="space-y-6 scroll-mt-20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Hands-On Engineering • Open Source Alternative
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Here Is How You Can Build Your Own Grok Bot for Free
            </h2>
            <p className="text-xs sm:text-sm text-[#A7B2CC] mt-1">
              OpenMausBot is an open-source alternative to Grok Bot, Meta Muse, and OpenAI Operator with 22,000+ stars on GitHub.
            </p>
          </div>

          <article className="bg-[#0D1730] border border-[#24314F] rounded-2xl overflow-hidden hover:border-emerald-500/60 transition shadow-xl">
            <div className="p-5 sm:p-8 space-y-6">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#24314F]/60 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 uppercase tracking-wide">
                    22,000+ Stars on GitHub
                  </span>
                  <span className="text-xs text-[#6B7FA3]">License: Apache 2.0</span>
                </div>
                <a
                  href="https://github.com/milind-soni/OpenMausBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/40 transition shrink-0"
                >
                  View GitHub Repository <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Lead Paragraph */}
              <div className="text-sm text-[#CBD5E1] space-y-3 leading-relaxed">
                <p>
                  You do not need an expensive enterprise subscription to deploy an autonomous assistant. <strong className="text-white">OpenMausBot</strong> runs on the Claude or ChatGPT plan you already pay for, providing an isolated computing sandbox, multi-app connectors, and persistent stateful memory.
                </p>
                <p>
                  Follow this complete step-by-step setup to launch your bot fleet:
                </p>
              </div>

              {/* Hero Image */}
              <div className="pt-2">
                <div className="rounded-xl overflow-hidden border border-[#24314F] bg-[#050816]">
                  <Image
                    src="/assets/premium_page/day2/grok.jpeg"
                    alt="Build Your Own Grok Bot with OpenMausBot"
                    width={1200}
                    height={675}
                    className="w-full h-auto object-cover max-h-[550px]"
                  />
                </div>
                <p className="text-[11px] text-[#6B7FA3] mt-2 text-center">
                  OpenMausBot interface: multi-agent task execution and app connectivity
                </p>
              </div>

              {/* Step-by-Step Implementation */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-400" />
                  Step-by-Step Configuration Guide
                </h3>

                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#050816] border border-[#24314F] space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                        1
                      </span>
                      <h4 className="font-bold text-sm text-white">
                        Create a Dedicated Bot for Every Job You Want to Automate
                      </h4>
                    </div>
                    <p className="text-xs text-[#A7B2CC] leading-relaxed pl-10">
                      Segment your workflows cleanly: Inbox Manager, Research Assistant, Script Researcher, and Video Editor. Each bot gets its own isolated virtual computer environment so workloads never collide or corrupt states.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#050816] border border-[#24314F] space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                        2
                      </span>
                      <h4 className="font-bold text-sm text-white">
                        Assign High-Level Autonomous Tasks
                      </h4>
                    </div>
                    <p className="text-xs text-[#A7B2CC] leading-relaxed pl-10">
                      Give it a clear prompt: <span className="text-emerald-400 font-mono text-[11px]">&ldquo;Find me this week&apos;s trending AI tools.&rdquo;</span> The bot boots its own isolated browser, searches the live internet, reads every webpage, and returns clean, cited summaries independently.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#050816] border border-[#24314F] space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                        3
                      </span>
                      <h4 className="font-bold text-sm text-white">
                        Connect Your Everyday Tools (500+ Integrations)
                      </h4>
                    </div>
                    <p className="text-xs text-[#A7B2CC] leading-relaxed pl-10">
                      Plugs directly into the software stack you already use: Gmail, Slack, Notion, and Google Calendar. Actions and outputs dispatch across these channels without manual copy-pasting.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#050816] border border-[#24314F] space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                        4
                      </span>
                      <h4 className="font-bold text-sm text-white">
                        Set Autonomous Execution Schedules
                      </h4>
                    </div>
                    <p className="text-xs text-[#A7B2CC] leading-relaxed pl-10">
                      Define automated recurrence: every morning, hourly, or on specific event triggers. Your bot operates autonomously in the background while you are offline or away from your workstation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Memory & Privacy Guarantees */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-4 rounded-xl bg-[#050816] border border-emerald-500/30 space-y-1.5">
                  <strong className="text-white block font-bold text-sm">
                    Persistent Stateful Memory
                  </strong>
                  <p className="text-[#A7B2CC] leading-relaxed">
                    Each bot remembers previous instructions, project requirements, and what you were working on last time. No repetitive prompt engineering or re-explaining context.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#050816] border border-emerald-500/30 space-y-1.5">
                  <strong className="text-white block font-bold text-sm">
                    100% Privacy &amp; Local Ownership
                  </strong>
                  <p className="text-[#A7B2CC] leading-relaxed">
                    Licensed under Apache 2.0. Your credentials, telemetry, and business data stay strictly on your private machine or self-hosted server without third-party snooping.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href="https://github.com/milind-soni/OpenMausBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-500/20"
                >
                  Try Out OpenMausBot on GitHub <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>
        </section>

        {/* ─── SECTION 1: TOP STORIES & STRATEGIC DEEP DIVES (EXISTING STORIES) ─ */}
        <section id="breaking-intelligence" className="space-y-8 scroll-mt-20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-[#60A5FA]" />
              <span className="text-xs font-bold text-[#60A5FA] uppercase tracking-widest">
                Curated Executive Intelligence
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Top Stories &amp; Strategic Deep Dives
            </h2>
            <p className="text-xs sm:text-sm text-[#A7B2CC] mt-1">
              Field reports, security audits, and insider boardroom intelligence from the frontlines of AI.
            </p>
          </div>

          <div className="space-y-8">
            {/* Story 1: Claude & Crypto Miner */}
            <article className="bg-[#0D1730] border border-[#24314F] rounded-2xl overflow-hidden hover:border-[#3B82F6]/60 transition shadow-xl">
              <div className="p-5 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#24314F]/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 uppercase tracking-wide">
                      Security Audit
                    </span>
                    <span className="text-xs text-[#6B7FA3]">r/claude Spotlight</span>
                  </div>
                  <span className="text-xs text-[#6B7FA3]">Case Study: Agent Self-Restraint</span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    Claude Caught a Cryptominer on a Mac While Building a Temperature Monitor App
                  </h3>

                  <div className="text-sm text-[#CBD5E1] space-y-3 leading-relaxed">
                    <p>
                      This developer on Reddit asked Claude Code to build a small utility app to show his Mac&apos;s internal CPU temperature. When the raw sensor readings looked suspiciously high—peaking at <strong className="text-rose-400">112°C</strong>—Claude didn&apos;t just display the number; it investigated what was driving the workload.
                    </p>
                    <p>
                      It discovered that the Mac was secretly running an <code className="px-1.5 py-0.5 rounded bg-[#050816] text-[#60A5FA] font-mono text-xs">xmrig</code> cryptocurrency miner, consuming 12 cores and pushing the CPU to 1175% capacity.
                    </p>
                    <p>
                      The miner had been quietly running since August, anchored by a persistent startup item at <code className="px-1.5 py-0.5 rounded bg-[#050816] text-[#A7B2CC] font-mono text-xs">~/Library/LaunchAgents/com.rymbotqcjoiqlqbp.plist</code> configured with <code className="px-1.5 py-0.5 rounded bg-[#050816] text-[#A7B2CC] font-mono text-xs">KeepAlive</code> to restart every time the Mac booted. Because the malicious process had root access, the developer&apos;s GitHub login credentials on that machine were exposed the entire time.
                    </p>
                    <p>
                      Crucially, Claude demonstrated textbook agent safety: it did not touch, delete, or alter any system files on its own. It detailed the exact persistence path, isolated the threat, and asked for explicit user permission to quarantine the payload.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#050816] border-l-4 border-rose-500 text-sm font-semibold text-white">
                    &ldquo;He asked for a thermometer. Claude found what was burning his machine.&rdquo;
                  </div>
                </div>

                {/* Screenshot */}
                <div className="pt-2">
                  <div className="rounded-xl overflow-hidden border border-[#24314F] bg-[#050816]">
                    <Image
                      src="/assets/premium_page/image1.png"
                      alt="Claude cryptominer discovery screenshot on Reddit"
                      width={1120}
                      height={798}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7FA3] mt-2 text-center">
                    Original verification log: Claude inspecting system processes and reporting xmrig miner to u/UntilHEX
                  </p>
                </div>
              </div>
            </article>

            {/* Story 2: 5 Free Repos for Building Agents */}
            <article className="bg-[#0D1730] border border-[#24314F] rounded-2xl overflow-hidden hover:border-[#7C3AED]/60 transition shadow-xl">
              <div className="p-5 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#24314F]/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C4B5FD] uppercase tracking-wide">
                      Architecture Blueprint
                    </span>
                    <span className="text-xs text-[#6B7FA3]">Curated by Vaibhav Sisinty</span>
                  </div>
                  <span className="text-xs text-[#6B7FA3]">5 Production Repositories</span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    Stop Reinventing the Wheel: 5 Free GitHub Repositories for Production AI Agents
                  </h3>

                  <p className="text-sm text-[#CBD5E1] leading-relaxed">
                    Stop starting from zero every time you build an agent. Between these 5 battle-tested repositories, they cover specialized department roles, multi-step workflows, business plugins, working full-stack code, and deterministic verification skills.
                  </p>

                  {/* 5 Repos List */}
                  <div className="grid gap-3 pt-2">
                    {/* Repo 1 */}
                    <div className="p-4 rounded-xl bg-[#050816] border border-[#24314F] hover:border-[#7C3AED]/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">01. agency-agents</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">ROLES</span>
                        </div>
                        <p className="text-xs text-[#A7B2CC] mt-1">
                          Specialist agents by department: engineering, design, marketing, sales, and security with defined workflows and deliverables. Not one generic agent doing everything.
                        </p>
                      </div>
                      <a
                        href="https://lnkd.in/g6QFrxKV"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#112040] hover:bg-[#7C3AED] text-white border border-[#24314F] transition shrink-0"
                      >
                        GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Repo 2 */}
                    <div className="p-4 rounded-xl bg-[#050816] border border-[#24314F] hover:border-[#7C3AED]/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">02. wshobson/agents</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">WORKFLOWS</span>
                        </div>
                        <p className="text-xs text-[#A7B2CC] mt-1">
                          202 agents, 184 skills, 105 commands. Install only the coding workflows you need. Works seamlessly with Claude Code, Codex, and others.
                        </p>
                      </div>
                      <a
                        href="https://lnkd.in/gxGNMw92"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#112040] hover:bg-[#7C3AED] text-white border border-[#24314F] transition shrink-0"
                      >
                        GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Repo 3 */}
                    <div className="p-4 rounded-xl bg-[#050816] border border-[#24314F] hover:border-[#7C3AED]/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">03. knowledge-work-plugins</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">PLUGINS • OFFICIAL ANTHROPIC</span>
                        </div>
                        <p className="text-xs text-[#A7B2CC] mt-1">
                          Official enterprise plugins for sales, customer support, product management, marketing, legal, and finance. Built for real work beyond coding.
                        </p>
                      </div>
                      <a
                        href="https://lnkd.in/g_aw6e7F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#112040] hover:bg-[#7C3AED] text-white border border-[#24314F] transition shrink-0"
                      >
                        GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Repo 4 */}
                    <div className="p-4 rounded-xl bg-[#050816] border border-[#24314F] hover:border-[#7C3AED]/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">04. claude-quickstarts</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">WORKING CODE • OFFICIAL ANTHROPIC</span>
                        </div>
                        <p className="text-xs text-[#A7B2CC] mt-1">
                          Complete working applications you can deploy and dissect: Slack bots, automated Sentry triage, support agents, and browser automation.
                        </p>
                      </div>
                      <a
                        href="https://lnkd.in/gi2ey-dA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#112040] hover:bg-[#7C3AED] text-white border border-[#24314F] transition shrink-0"
                      >
                        GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Repo 5 */}
                    <div className="p-4 rounded-xl bg-[#050816] border border-[#24314F] hover:border-[#7C3AED]/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">05. agent-skills</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">SKILLS • ADDY OSMANI</span>
                        </div>
                        <p className="text-xs text-[#A7B2CC] mt-1">
                          25 engineering skills. Steps, checkpoints, and rigorous verification built in. Instructs the agent on what to prove before declaring done.
                        </p>
                      </div>
                      <span className="text-[11px] text-[#6B7FA3] shrink-0 font-mono">github.com/addyosmani/agent-skills</span>
                    </div>
                  </div>
                </div>

                {/* Screenshot */}
                <div className="pt-2">
                  <div className="rounded-xl overflow-hidden border border-[#24314F] bg-[#050816]">
                    <Image
                      src="/assets/premium_page/image2.png"
                      alt="5 repos I use every time I build an agent"
                      width={800}
                      height={1000}
                      className="w-full h-auto object-cover max-h-[500px]"
                    />
                  </div>
                </div>
              </div>
            </article>

            {/* Story 3: Nvidia Succession Crisis */}
            <article className="bg-[#0D1730] border border-[#24314F] rounded-2xl overflow-hidden hover:border-[#10B981]/60 transition shadow-xl">
              <div className="p-5 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#24314F]/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-wide">
                      Boardroom Dossier
                    </span>
                    <span className="text-xs text-[#6B7FA3]">Semiconductor Geopolitics</span>
                  </div>
                  <a
                    href="https://drive.google.com/file/d/1jA3Yp6o0yG0Dlb9-d0mqr3l43OdKHcNP/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-white transition"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Watch Video Analysis <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    Nvidia is the Most Valuable Company in the World. It Has No Plan for the Day Jensen Huang Leaves.
                  </h3>

                  <div className="text-sm text-[#CBD5E1] space-y-3 leading-relaxed">
                    <p>
                      That is the part I keep coming back to.
                    </p>
                    <p>
                      Huang admitted an affair on November 8, with Alice Huang, an executive at Singapore customer Megaspeed (no relation). US intelligence officials suspect she was recruited by Beijing. The board opened an investigation. Huang apologised and stayed on.
                    </p>
                    <p>
                      On November 11, the New York Times reported a second affair, with Kimberly Powell, Nvidia&apos;s VP of health care, who reports directly to him. The Wall Street Journal reported the board is preparing to oust him. No decision yet.
                    </p>
                    <p>
                      I know the affair is what everyone is talking about. But the board is not judging an affair. It is judging whether the CEO of the company at the centre of the global AI boom was compromised.
                    </p>
                    <p>
                      Huang has led Nvidia for 33 years. About 60 executives report to him directly. Nobody has ever been named as the next CEO.
                    </p>
                    <p>
                      Two names are already circulating inside the board:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-white">
                      <li>
                        <strong>Colette Kress</strong> (CFO for 13 years): The name some board members favour as interim CEO to steady the company and reassure Wall Street.
                      </li>
                      <li>
                        <strong>Ian Buck</strong> (The legendary engineer who led CUDA): The favourite for the permanent job to command the core silicon and compiler roadmap.
                      </li>
                    </ul>
                    <p className="text-xs text-[#6B7FA3]">
                      One to steady the company. One to run the technology. The board has picked neither yet.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#050816] border-l-4 border-emerald-500 text-sm font-semibold text-white space-y-2">
                    <p>
                      &ldquo;If your company cannot survive a week without you, you did not build a company. You built a job with a very large office.&rdquo;
                    </p>
                    <p className="text-xs text-[#A7B2CC] font-normal">
                      The affair is personal. The missing plan is structural. The first made the headlines. The second is why the board is meeting. What would you do if your founder had to step down tomorrow?
                    </p>
                  </div>
                </div>

                {/* Generated Editorial Graphic */}
                <div className="pt-2">
                  <div className="rounded-xl overflow-hidden border border-[#24314F] bg-[#050816] relative group">
                    <Image
                      src="/assets/premium_page/image_nvidia.png"
                      alt="Nvidia Boardroom Succession Crisis and Silicon Roadmap"
                      width={1280}
                      height={720}
                      className="w-full h-auto object-cover max-h-[520px]"
                    />
                    <a
                      href="https://drive.google.com/file/d/1jA3Yp6o0yG0Dlb9-d0mqr3l43OdKHcNP/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white font-bold text-sm"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/50">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                      <span>Click to Watch Video Breakdown</span>
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6B7FA3] mt-2 px-1">
                    <span>Executive Deliberation &amp; Roadmap</span>
                    <a
                      href="https://drive.google.com/file/d/1jA3Yp6o0yG0Dlb9-d0mqr3l43OdKHcNP/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      Access Raw Video Source ↗
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ─── SECTION 2: TOOLS OF THE WEEK ─────────────────────────────────── */}
        <section id="tools-of-the-week" className="space-y-8 scroll-mt-20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-[#9F67FF]" />
              <span className="text-xs font-bold text-[#9F67FF] uppercase tracking-widest">
                Weekly Report
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Tools of the Week
            </h2>
            <p className="text-xs sm:text-sm text-[#A7B2CC] mt-1">
              Curated developer utilities, frameworks, and agent harnesses tested by the Savzyen engineering lab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool 1 */}
            <div className="bg-[#0D1730] border border-[#24314F] hover:border-[#60A5FA] rounded-2xl p-6 transition flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-[#3B82F6]/20 text-[#60A5FA] font-black text-xs flex items-center justify-center">
                    01
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/30 uppercase">
                    Multi-Channel Agent
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#60A5FA] transition">
                  OpenClaw
                </h3>
                <p className="text-xs text-[#A7B2CC] leading-relaxed">
                  Self-hosted AI assistant that connects to WhatsApp, Telegram, Slack, and Discord. Your agent, your private data, your infrastructure.
                </p>
              </div>

              <div className="pt-6 border-t border-[#24314F]/60 mt-6">
                <a
                  href="https://link.mail.beehiiv.com/ss/c/u001.4ueL_YUEsdrSVHDVguSs1-S0UDFfvhvV6UoxqJUDqj8v6hTGDk0RHywY0QDfrc0XZw1HzDQk6rhKsbaJWwzU20jDXy_j5qYb15wuXyatScsnIzk9a7-rAh6x3-7MvUwhxCv3gblJvFY3dVip19q4Cg/4pk/FYgdOqlERGeyEu8pW9Q0yw/h9/h001.6zuqsdv-LyUfzAhHlIwvyFeY_CVI_iMjAptrm4TdflU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#112040] hover:bg-[#3B82F6] border border-[#24314F] hover:border-[#3B82F6] transition flex items-center justify-center gap-1.5"
                >
                  Explore OpenClaw <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="bg-[#0D1730] border border-[#24314F] hover:border-[#F59E0B] rounded-2xl p-6 transition flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] font-black text-xs flex items-center justify-center">
                    02
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 uppercase">
                    Developer Telemetry
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#F59E0B] transition">
                  Straude
                </h3>
                <p className="text-xs text-[#A7B2CC] leading-relaxed">
                  Strava for Claude Code. One command to log your Claude Code usage. Track spending, benchmark prompt velocity, compare pace, and keep the streak alive.
                </p>
              </div>

              <div className="pt-6 border-t border-[#24314F]/60 mt-6">
                <a
                  href="https://link.mail.beehiiv.com/ss/c/u001.t0TdburwWVFotEt9soWZegK3z9-g6BoLmr99KqoG9NRC-RnLUzGF6hPZ3j3pdLoX9ZQsOgzw-UKsJUXay89p-zP6GURH_UuiLBJmhfBn2l0/4pk/FYgdOqlERGeyEu8pW9Q0yw/h10/h001.xVr5qIHkJttPybv6J_t5t4e957pxZCkfpO9GU_E6dz8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#112040] hover:bg-[#F59E0B] hover:text-black border border-[#24314F] hover:border-[#F59E0B] transition flex items-center justify-center gap-1.5"
                >
                  Explore Straude <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Tool 3 */}
            <div className="bg-[#0D1730] border border-[#24314F] hover:border-[#10B981] rounded-2xl p-6 transition flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-[#10B981]/20 text-[#10B981] font-black text-xs flex items-center justify-center">
                    03
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 uppercase">
                    Self-Optimizing LLM
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#10B981] transition">
                  Auto Agents
                </h3>
                <p className="text-xs text-[#A7B2CC] leading-relaxed">
                  First open-source library for self-optimizing agents. Give an AI agent a high-level task, let it build, benchmark, and iterate on an agent harness autonomously overnight.
                </p>
              </div>

              <div className="pt-6 border-t border-[#24314F]/60 mt-6">
                <a
                  href="https://link.mail.beehiiv.com/ss/c/u001.DKkMGJMHMdwwc0aO8gqkAmujfz5PpskY1ox0Zk9TC_M_7nKzR4q7SkAUKLOC-vUGhCSUPbIUvLEideKSGXKsXbiNzNmbz6sinkaFu1zhzpHTmAgSMWdWFV9HrQi-iX87/4pk/FYgdOqlERGeyEu8pW9Q0yw/h12/h001.jdXcMUyfC_s2WJZwVp4bMA9XOzHsBAAFNJKNsHGZjCY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#112040] hover:bg-[#10B981] border border-[#24314F] hover:border-[#10B981] transition flex items-center justify-center gap-1.5"
                >
                  Explore Auto Agents <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: WEEKLY CHALLENGE (PROBLEM OF THE WEEK) ──────────── */}
        <section id="problem-of-the-week" className="space-y-8 scroll-mt-20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Weekly Hands-On Challenge
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Problem of the Week: Deploying 24/7 Production AI Agents
            </h2>
            <p className="text-xs sm:text-sm text-[#A7B2CC] mt-1">
              Zero-friction, 1-click cloud agent deployment with live web scraping and persistent Telegram bots.
            </p>
          </div>

          <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl sm:rounded-3xl p-5 sm:p-10 space-y-10 shadow-2xl">
            {/* The Core Bottleneck */}
            <div className="space-y-3 pb-8 border-b border-[#24314F]">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                The Core Bottleneck
              </h3>
              <div className="text-sm text-[#CBD5E1] space-y-3 leading-relaxed">
                <p>
                  Running OpenClaw locally is fine for testing. But for anything in production, it falls apart fast.
                </p>
                <p>
                  Your agent needs to be reachable when a Telegram message comes in at 3am. It needs consistent uptime for scheduled workflows to fire, and it cannot disappear when you close your laptop to catch a flight. None of that is possible if the agent lives on your dev machine.
                </p>
                <p>
                  The traditional fix is a VPS, and it works, but the setup is tedious: you are provisioning a server, installing Node, managing environment variables, configuring SSL certificates, handling daemon process managers so the agent restarts on crash, and doing all of this before writing a single line of automation logic.
                </p>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold">
                  Hostinger has eliminated this overhead with a native 1-click OpenClaw containerized deployment. The whole setup takes under 10 minutes.
                </div>
              </div>
            </div>

            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#3B82F6] text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Step 1: Select 1-Click OpenClaw Plan on Hostinger
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#A7B2CC] leading-relaxed pl-11">
                Go to{" "}
                <a
                  href="https://link.mail.beehiiv.com/ss/c/u001.4ueL_YUEsdrSVHDVguSs1-S0UDFfvhvV6UoxqJUDqj-qHXn3_3AQCRjYn9G07BJ8kSxcV6T2uzq3k04PQHz3M8cY1wZedHkZtZ10d0Lgn3-uxKv1laaWtUEpzKcLid7D/4pk/FYgdOqlERGeyEu8pW9Q0yw/h14/h001.iMlT4g6Pw600NQ6AwlKm8KDcwDB68YmhDqqjom_aGto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#60A5FA] font-medium underline"
                >
                  hostinger.com/in/openclaw
                </a>
                . Select the 1-Click OpenClaw plan, add it to your cart, and apply your coupon code at checkout for 10% off. The OpenClaw application comes pre-selected so you don&apos;t have to hunt for it.
              </p>
              <div className="pl-11 pt-2">
                <div className="rounded-xl overflow-hidden border border-[#24314F] bg-[#050816] max-w-2xl">
                  <Image
                    src="/assets/premium_page/image3.png"
                    alt="Hostinger Cart with OpenClaw pre-selected"
                    width={1400}
                    height={1666}
                    className="w-full h-auto object-cover max-h-[500px]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#3B82F6] text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Step 2: Configure Your Environment (Provider, Messaging &amp; Scraping)
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#A7B2CC] leading-relaxed pl-11">
                After checkout, Hostinger drops you into a unified configuration screen with three core toggles:
              </p>

              <div className="pl-11 grid sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#050816] border border-[#24314F]">
                  <strong className="text-white block mb-1">1. AI Provider</strong>
                  Paste your OpenAI or Anthropic API key, or use built-in ready-to-use AI credits (synced automatically without 3rd party billing).
                </div>
                <div className="p-3.5 rounded-xl bg-[#050816] border border-[#24314F]">
                  <strong className="text-white block mb-1">2. Communication Channel</strong>
                  Telegram is the cleanest starting point using official Bot APIs without account flagging. WhatsApp is also supported with a dedicated number.
                </div>
                <div className="p-3.5 rounded-xl bg-[#050816] border border-[#24314F]">
                  <strong className="text-white block mb-1">3. Live Web Scraping</strong>
                  Pre-integrated out-of-the-box: no external Brave Search API keys needed. Your agent hits live web results immediately.
                </div>
              </div>

              {/* Side by side screenshots */}
              <div className="pl-11 grid sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl overflow-hidden border border-[#24314F] bg-[#050816]">
                  <Image
                    src="/assets/premium_page/image4.png"
                    alt="Choose AI Provider for OpenClaw"
                    width={1400}
                    height={1190}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-2.5 text-[11px] text-[#A7B2CC] bg-[#050816]/90 border-t border-[#24314F]">
                    Select AI Provider (OpenAI / Anthropic / xAI)
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden border border-[#24314F] bg-[#050816]">
                  <Image
                    src="/assets/premium_page/image5.png"
                    alt="Connect OpenClaw to Messaging App"
                    width={1400}
                    height={1068}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-2.5 text-[11px] text-[#A7B2CC] bg-[#050816]/90 border-t border-[#24314F]">
                    Select Communication Channel (Telegram / WhatsApp)
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#3B82F6] text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Step 3: Launch in Isolated Docker Container
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#A7B2CC] leading-relaxed pl-11">
                Click through and Hostinger spins up an isolated Docker container running your dedicated OpenClaw instance. You receive a direct dashboard URL and an Access Key to manage authentication securely.
              </p>
              <div className="pl-11 pt-2">
                <div className="rounded-xl overflow-hidden border border-[#24314F] bg-[#050816] max-w-2xl">
                  <Image
                    src="/assets/premium_page/image6.png"
                    alt="OpenClaw Deployment Confirmed"
                    width={1400}
                    height={1202}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#3B82F6] text-white font-black text-xs flex items-center justify-center shrink-0">
                  4
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Step 4: Connect Your Telegram Bot Token
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#A7B2CC] leading-relaxed pl-11">
                Open Telegram, message <code className="px-1.5 py-0.5 rounded bg-[#050816] text-[#60A5FA] font-mono text-xs">@BotFather</code>, send <code className="px-1.5 py-0.5 rounded bg-[#050816] text-[#60A5FA] font-mono text-xs">/newbot</code>, name your bot, and copy the generated HTTP API token. Paste it into the OpenClaw configuration modal and click &ldquo;Finish setup&rdquo;.
              </p>
              <div className="pl-11 pt-2">
                <div className="rounded-xl overflow-hidden border border-[#24314F] bg-[#050816] max-w-2xl">
                  <Image
                    src="/assets/premium_page/image7.png"
                    alt="Connect Telegram with BotFather"
                    width={1400}
                    height={810}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                  5
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Step 5: Run Your First Production Workflow
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#A7B2CC] leading-relaxed pl-11">
                Open your bot in Telegram and send a live prompt:
              </p>
              <div className="pl-11">
                <div className="p-3.5 rounded-xl bg-[#050816] border border-[#24314F] font-mono text-xs text-emerald-400">
                  &ldquo;Pull the top 5 AI news stories from today and send me a concise executive summary.&rdquo;
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#A7B2CC] leading-relaxed pl-11">
                If it returns with live, cited articles from today, your agent is working end-to-end. The web scraping integration hits the live internet rather than relying solely on training cutoff data.
              </p>
              <div className="pl-11 pt-2">
                <div className="rounded-xl overflow-hidden border border-[#24314F] bg-[#050816] max-w-2xl">
                  <Image
                    src="/assets/premium_page/image8.png"
                    alt="OpenClaw Chat Session Ready"
                    width={1400}
                    height={620}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Conclusion Callout */}
              <div className="pl-11 pt-4">
                <div className="p-4 rounded-xl bg-[#050816] border border-emerald-500/30 text-xs sm:text-sm text-[#CBD5E1] space-y-2">
                  <strong className="text-white block font-bold">
                    ✓ 24/7 Autonomy Established
                  </strong>
                  <p>
                    Your agent now runs on Hostinger&apos;s cloud infrastructure 24/7. It stays active when your laptop is closed, while you sleep, and when you travel. It shares zero state with your local development machine and continues firing recurring automations autonomously.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
