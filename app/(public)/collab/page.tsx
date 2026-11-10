import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, ArrowDown, Sparkles } from "lucide-react";
import { CollabClient } from "./CollabClient";

export const metadata: Metadata = {
  title: "Collaborate with Savzen | Colleges, Schools & Industry Partnerships",
  description:
    "Partner with Savzen. Empowering 18,500+ students across top engineering colleges, forward-thinking schools, and leading tech companies to build with artificial intelligence.",
  alternates: { canonical: "/collab" },
};

export default function CollabPage() {
  return (
    <div className="min-h-screen py-14 bg-[#050816] text-[#F8FAFC]">
      <div className="container-max">
        {/* Hero Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-400">
            <Handshake className="w-4 h-4" />
            <span>Academic & Industry Collaboration Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Empowering Campuses, Schools & Builders with{" "}
            <span className="text-[#f8fafc]">Sav</span>
            <span className="gradient-text">zen</span>
          </h1>

          <p className="text-sm sm:text-base text-[#A7B2CC] leading-relaxed max-w-2xl mx-auto">
            From premier engineering universities training thousands of student engineers to forward-looking schools and tech enterprises — discover who collaborates with Savzen, and partner with us.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#collab-form-section"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:opacity-95 shadow-lg shadow-[#7C3AED]/25 transition"
            >
              <span>Partner With Us</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#A7B2CC] hover:text-white bg-[#0D1730] border border-[#24314F] hover:border-[#3B82F6] transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Explore Community</span>
            </Link>
          </div>
        </div>

        {/* Client Interactive Showcase & Form */}
        <CollabClient />
      </div>
    </div>
  );
}

