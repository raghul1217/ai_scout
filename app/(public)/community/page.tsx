import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Users, Bell, BookOpen, ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the AI Scout community on WhatsApp for daily AI updates, curated tools, and practical learning resources.",
  alternates: { canonical: "/community" },
};

const communityBenefits = [
  { icon: Bell, title: "Daily AI News", description: "Curated AI updates delivered every day, so you never miss what matters." },
  { icon: BookOpen, title: "Learning Resources", description: "Tutorials, guides, and practical projects shared directly in the group." },
  { icon: Users, title: "Peer Community", description: "Connect with AI enthusiasts, learners, and practitioners." },
  { icon: MessageCircle, title: "Real-time Discussions", description: "Ask questions, share projects, and get feedback from the community." },
];

export default function CommunityPage() {
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ?? "#";

  return (
    <div className="min-h-screen py-12">
      <div className="container-max">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3">Community</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#f8fafc] mb-4">
            Join the AI Scout{" "}
            <span className="gradient-text">Community</span>
          </h1>
          <p className="text-[#a7b2cc] text-lg leading-relaxed mb-8">
            A growing community of AI enthusiasts, learners, and practitioners. 
            Stay connected through our WhatsApp community for daily updates and discussions.
          </p>
          {whatsappUrl !== "#" ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="community-join-whatsapp-btn"
              className="btn btn-success btn-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Join WhatsApp Community
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="btn btn-success btn-lg opacity-60 cursor-not-allowed">
              <MessageCircle className="w-5 h-5" />
              WhatsApp Community Link Coming Soon
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {communityBenefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto">
                <Icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-base font-semibold text-[#f8fafc]">{title}</h3>
              <p className="text-sm text-[#a7b2cc] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* About section */}
        <div className="card p-8 sm:p-12 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#f8fafc] mb-4">What to Expect</h2>
          <p className="text-[#a7b2cc] leading-relaxed mb-6">
            Our community is built around the idea that learning AI should be practical, 
            accessible, and social. We share real tools, honest reviews, and useful tutorials — 
            no hype, no spam.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/learn" className="btn btn-secondary btn-sm">
              <BookOpen className="w-4 h-4" /> Browse Tutorials
            </Link>
            <Link href="/tools" className="btn btn-secondary btn-sm">
              Explore Tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
