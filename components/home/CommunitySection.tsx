import Link from "next/link";
import { MessageCircle, Zap, BookOpen, Users, ArrowRight, Bell } from "lucide-react";

const benefits = [
  {
    icon: Bell,
    title: "Daily AI Updates",
    description: "Get curated AI news and tool discoveries delivered daily to your WhatsApp.",
  },
  {
    icon: BookOpen,
    title: "Learning Resources",
    description: "Access tutorials, guides, and practical projects shared directly in the community.",
  },
  {
    icon: Users,
    title: "Community Discussions",
    description: "Connect with fellow AI enthusiasts, ask questions, and share your projects.",
  },
  {
    icon: Zap,
    title: "Early Access",
    description: "Be the first to know about new AI tools, features, and exclusive content.",
  },
];

export function CommunitySection() {
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ?? "/community";

  return (
    <section className="py-24 bg-[#050816] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-max relative z-10">
        {/* Section wrapper */}
        <div className="rounded-2xl border border-[#24314f] bg-gradient-to-br from-[#0d1730] to-[#0a1024] overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: Content */}
            <div className="p-8 sm:p-12 space-y-6">
              <div>
                <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3">
                  Community
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] leading-tight">
                  Join the AI Scout{" "}
                  <span className="gradient-text">Community</span>
                </h2>
                <p className="text-[#a7b2cc] mt-4 leading-relaxed">
                  Stay connected with the latest in AI. Our WhatsApp community delivers curated 
                  updates, learning resources, and discussions right to your phone.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                {benefits.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#f8fafc]">{title}</p>
                      <p className="text-sm text-[#a7b2cc] mt-0.5">{description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="community-whatsapp-btn"
                  className="btn btn-success btn-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Join WhatsApp Community
                </a>
                <Link href="/community" className="btn btn-secondary btn-lg">
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative bg-gradient-to-br from-green-600/5 to-emerald-600/5 flex items-center justify-center p-12">
              <div className="relative">
                {/* WhatsApp-style visual */}
                <div className="w-56 h-56 rounded-full bg-[#16c784]/10 border border-[#16c784]/20 flex items-center justify-center animate-pulse-glow">
                  <div className="w-40 h-40 rounded-full bg-[#16c784]/15 border border-[#16c784]/30 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#16c784] flex items-center justify-center shadow-2xl shadow-green-500/30">
                      <MessageCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Floating stats — non-numeric highlights */}
                <div className="absolute -top-4 -right-8 glass rounded-xl px-4 py-2.5 border border-green-500/20">
                  <p className="text-xs text-[#6b7fa3]">Updates</p>
                  <p className="text-sm font-semibold text-[#f8fafc]">Daily</p>
                </div>
                <div className="absolute -bottom-4 -left-8 glass rounded-xl px-4 py-2.5 border border-purple-500/20">
                  <p className="text-xs text-[#6b7fa3]">Content</p>
                  <p className="text-sm font-semibold text-[#f8fafc]">Curated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
