import Link from "next/link";
import {
  GraduationCap,
  Building2,
  School,
  Users,
  CheckCircle2,
  ArrowRight,
  Handshake,
  Sparkles,
} from "lucide-react";

interface MarqueePartner {
  name: string;
  category: "COLLEGE" | "SCHOOL" | "COMPANY" | "MENTOR";
  stat: string;
  focus: string;
  location: string;
}

const PARTNERS: MarqueePartner[] = [
  {
    name: "Anna University (CEG)",
    category: "COLLEGE",
    stat: "2,450+ Students",
    focus: "Autonomous Agents & LLM Labs",
    location: "Chennai, India",
  },
  {
    name: "Vellore Institute of Technology (VIT)",
    category: "COLLEGE",
    stat: "3,200+ Students",
    focus: "Full-Stack AI & Copilot Systems",
    location: "Vellore, India",
  },
  {
    name: "PSG College of Technology",
    category: "COLLEGE",
    stat: "1,650+ Students",
    focus: "Edge AI & Local Open Weights",
    location: "Coimbatore, India",
  },
  {
    name: "Synthetix Labs AI",
    category: "COMPANY",
    stat: "Hiring Partner",
    focus: "Direct Student Talent Pipeline",
    location: "Bengaluru, India",
  },
  {
    name: "SRM Institute of Science & Tech",
    category: "COLLEGE",
    stat: "2,800+ Students",
    focus: "Hackathons & Production RAG",
    location: "Kattankulathur, India",
  },
  {
    name: "Delhi Public School Tech Society",
    category: "SCHOOL",
    stat: "K-12 AI Chapter",
    focus: "High School AI Innovation Labs",
    location: "New Delhi, India",
  },
  {
    name: "NIT Trichy Developer Guild",
    category: "COLLEGE",
    stat: "1,400+ Students",
    focus: "Multi-Agent Protocols & MCP",
    location: "Trichy, India",
  },
  {
    name: "DevForge Technologies",
    category: "COMPANY",
    stat: "Incubator Partner",
    focus: "12 Student Teams Seed Funded",
    location: "Hyderabad, India",
  },
  {
    name: "Chinmaya Vidyalaya AI Club",
    category: "SCHOOL",
    stat: "600+ Students",
    focus: "Prompt Engineering & Creative Coding",
    location: "Chennai, India",
  },
  {
    name: "Dr. Arvind Menon • Ex-Google AI",
    category: "MENTOR",
    stat: "Research Lead",
    focus: "Distributed Model Architecture",
    location: "San Francisco, USA",
  },
  {
    name: "NeuralVentures AI",
    category: "COMPANY",
    stat: "Venture Partner",
    focus: "Seed Grants for Campus AI Startups",
    location: "Mumbai, India",
  },
];

const categoryConfig = {
  COLLEGE: {
    icon: GraduationCap,
    label: "College",
    badge: "bg-[#3B82F6]/15 text-[#60A5FA] border-[#3B82F6]/30",
  },
  SCHOOL: {
    icon: School,
    label: "School",
    badge: "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30",
  },
  COMPANY: {
    icon: Building2,
    label: "Enterprise",
    badge: "bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30",
  },
  MENTOR: {
    icon: Users,
    label: "Mentor",
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  },
};

export function CollaboratorMarquee() {
  return (
    <section className="relative py-14 sm:py-18 lg:py-20 bg-[#070B1E]/80 border-y border-[#24314F]/60 overflow-hidden">
      {/* Top Header Row */}
      <div className="container-max mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-brand flex items-center justify-center shadow-md">
            <Handshake className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            Academic & Industry Network
            <span className="hidden sm:inline text-[#6B7FA3] font-normal">•</span>
            <span className="text-[#10B981] font-semibold hidden sm:inline flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              18,500+ Students Engaged
            </span>
          </span>
        </div>

        <Link
          href="/collab"
          className="text-xs font-bold text-[#60A5FA] hover:text-white transition flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>Explore All Collaborators</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Marquee Outer Container with Gradient Masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left Edge Gradient Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#070B1E] via-[#070B1E]/80 to-transparent z-10" />

        {/* Right Edge Gradient Mask */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#070B1E] via-[#070B1E]/80 to-transparent z-10" />

        {/* Continuous Animated Track (Moving Right to Left) */}
        <div className="animate-marquee flex gap-4 pl-4 py-2">
          {/* Render 2 identical loops so translation by -50% is 100% seamless */}
          {[...PARTNERS, ...PARTNERS].map((partner, index) => {
            const config = categoryConfig[partner.category];
            const Icon = config.icon;

            return (
              <Link
                key={`${partner.name}-${index}`}
                href="/collab"
                className="group w-[280px] sm:w-[320px] shrink-0 bg-[#0D1730]/90 hover:bg-[#112040] border border-[#24314F] hover:border-[#60A5FA]/60 rounded-2xl p-4 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Category pill + Stat badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.badge}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{config.label}</span>
                    </span>

                    <span className="text-[10px] font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2 py-0.5 rounded-full">
                      {partner.stat}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-sm font-bold text-white group-hover:text-[#60A5FA] transition-colors line-clamp-1 mb-1">
                    {partner.name}
                  </h3>

                  {/* Focus */}
                  <p className="text-xs text-[#A7B2CC] line-clamp-1">
                    {partner.focus}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="mt-3 pt-2.5 border-t border-[#24314F]/60 flex items-center justify-between text-[11px] text-[#6B7FA3]">
                  <span>{partner.location}</span>
                  <span className="flex items-center gap-1 text-[#60A5FA] font-medium">
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                    <span>Verified</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

