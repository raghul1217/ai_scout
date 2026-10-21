import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Target, Users, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About AI Scout",
  description: "AI Scout is your trusted AI discovery and learning platform — built to help everyone navigate and benefit from the AI revolution.",
  alternates: { canonical: "/about" },
};

const values = [
  { icon: Target, title: "Curated, Not Cluttered", description: "We hand-pick every tool, article, and tutorial for quality and relevance. No fluff." },
  { icon: Heart, title: "Community First", description: "Built for learners and builders. We grow with our community, not ahead of it." },
  { icon: Zap, title: "Practical Over Theoretical", description: "We focus on what you can actually use and learn today, not just ideas." },
  { icon: Users, title: "Accessible to Everyone", description: "From students to professionals, AI Scout is built for people at every skill level." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container-max">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-14">
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30">
              <Zap className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#f8fafc] mb-4">
              About <span className="gradient-text">AI Scout</span>
            </h1>
            <p className="text-[#a7b2cc] text-lg leading-relaxed">
              AI Scout is your all-in-one destination for discovering AI tools, 
              staying updated with AI news, and learning practical AI skills — 
              designed for curious minds in the age of artificial intelligence.
            </p>
          </div>

          {/* Mission */}
          <div className="card p-8 mb-10">
            <h2 className="text-xl font-bold text-[#f8fafc] mb-3">Our Mission</h2>
            <p className="text-[#a7b2cc] leading-relaxed">
              The AI world moves incredibly fast. New tools emerge daily, research 
              breaks barriers weekly, and the landscape shifts constantly. AI Scout 
              exists to cut through the noise — delivering curated, practical, and 
              honest information to help you stay ahead without feeling overwhelmed.
            </p>
          </div>

          {/* Values */}
          <h2 className="text-2xl font-bold text-[#f8fafc] mb-6">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-base font-semibold text-[#f8fafc]">{title}</h3>
                <p className="text-sm text-[#a7b2cc] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-[#a7b2cc] mb-4">Want to collaborate or learn more?</p>
            <Link href="/contact" className="btn btn-primary">Get in Touch</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
