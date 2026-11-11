"use client";

import { useState } from "react";
import {
  GraduationCap,
  Building2,
  Users,
  School,
  Sparkles,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Award,
  ChevronRight,
  Handshake,
  BookOpen,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  location: string;
  type: "COLLEGE" | "SCHOOL" | "COMPANY" | "MENTOR";
  badge: string;
  studentCount?: string;
  focus: string;
  description: string;
  collaborationTrack: string;
  stats?: string;
  accentColor: string;
}

const COLLABORATORS: Collaborator[] = [
  // ─── COLLEGES & UNIVERSITIES ───────────────────────────────────────────────
  {
    id: "anna-univ",
    name: "College of Engineering, Guindy (Anna University)",
    location: "Chennai, India",
    type: "COLLEGE",
    badge: "Premier Academic Partner",
    studentCount: "2,450+ Active Students",
    focus: "Autonomous Agents & LLM Application Engineering",
    description: "Official Campus AI Chapter conducting hands-on prompt engineering labs, weekend hackathons, and agent development sprints.",
    collaborationTrack: "AI Innovation Lab & Student Chapter",
    stats: "78 student projects shipped to production",
    accentColor: "from-blue-600 to-indigo-700",
  },
  {
    id: "vit-vellore",
    name: "Vellore Institute of Technology (VIT)",
    location: "Vellore, India",
    type: "COLLEGE",
    badge: "Scale Partner",
    studentCount: "3,200+ Active Students",
    focus: "Generative AI Systems & Full-Stack AI Toolkits",
    description: "Campus-wide upskilling partnership enabling engineering students to master modern developer copilots and vector database integrations.",
    collaborationTrack: "Curriculum Integration & Campus Upskilling",
    stats: "120+ hackathon submissions evaluated",
    accentColor: "from-purple-600 to-indigo-800",
  },
  {
    id: "psg-tech",
    name: "PSG College of Technology",
    location: "Coimbatore, India",
    type: "COLLEGE",
    badge: "Technical Partner",
    studentCount: "1,650+ Active Students",
    focus: "Edge AI, TinyML & Local Open-Source LLMs",
    description: "Collaborative research seminars focusing on running quantized models (Ollama, DeepSeek) locally on developer workstations.",
    collaborationTrack: "Embedded AI & Research Seminars",
    stats: "45 open-source pull requests merged",
    accentColor: "from-emerald-600 to-teal-800",
  },
  {
    id: "srm-ist",
    name: "SRM Institute of Science and Technology",
    location: "Kattankulathur, India",
    type: "COLLEGE",
    badge: "Hackathon Sponsor",
    studentCount: "2,800+ Active Students",
    focus: "Cloud AI Architecture & Production RAG Pipelines",
    description: "Co-hosting annual 36-hour hackathons with dedicated industry mentors, blueprint walkthroughs, and hiring bounties.",
    collaborationTrack: "Annual AI Hackathons & Mentorship",
    stats: "24 student teams incubated into startups",
    accentColor: "from-amber-600 to-orange-800",
  },
  {
    id: "nit-trichy",
    name: "National Institute of Technology (NIT Trichy)",
    location: "Tiruchirappalli, India",
    type: "COLLEGE",
    badge: "Institute of Eminence",
    studentCount: "1,400+ Active Students",
    focus: "Multi-Agent Protocols & Mathematical Foundations",
    description: "Student developer club conducting advanced study groups on Model Context Protocol (MCP) and multi-agent coordination.",
    collaborationTrack: "Research Fellowship & Study Circles",
    stats: "32 research pre-prints referenced",
    accentColor: "from-cyan-600 to-blue-800",
  },
  {
    id: "ssn-chennai",
    name: "SSN College of Engineering",
    location: "Kalavakkam, India",
    type: "COLLEGE",
    badge: "Innovation Chapter",
    studentCount: "1,200+ Active Students",
    focus: "AI in Software Engineering & Automated Testing",
    description: "Integrated capstone project mentor network where industry leads review and benchmark final-year AI software implementations.",
    collaborationTrack: "Capstone Mentorship & Code Reviews",
    stats: "92% capstone placement rating",
    accentColor: "from-rose-600 to-pink-800",
  },

  // ─── SCHOOLS & STEM ACADEMIES ──────────────────────────────────────────────
  {
    id: "dps-tech",
    name: "Delhi Public School (DPS) AI Society",
    location: "New Delhi, India",
    type: "SCHOOL",
    badge: "K-12 STEM Partner",
    studentCount: "850+ High Schoolers",
    focus: "Foundational AI Literacy & Ethical Machine Learning",
    description: "Interactive workshops introducing grades 9-12 students to creative AI, prompt mechanics, and responsible AI safety guidelines.",
    collaborationTrack: "Junior AI Creators Workshop Series",
    stats: "15 high school science fair accolades",
    accentColor: "from-teal-600 to-emerald-700",
  },
  {
    id: "nps-innovation",
    name: "National Public School Innovation Hub",
    location: "Bangalore, India",
    type: "SCHOOL",
    badge: "Youth Tech Fellow",
    studentCount: "620+ Students",
    focus: "Creative AI, Generative Art & Music Tools",
    description: "Hands-on creative labs showing students how to combine human storytelling with generative illustration and audio tools.",
    collaborationTrack: "Future Creators Laboratory",
    stats: "200+ original creative pieces published",
    accentColor: "from-pink-600 to-purple-700",
  },
  {
    id: "chrysalis-stem",
    name: "Chrysalis Future STEM Academy",
    location: "Hyderabad, India",
    type: "SCHOOL",
    badge: "Curriculum Partner",
    studentCount: "940+ Students",
    focus: "Python Coding Foundations & Visual AI",
    description: "Weekly interactive coding curriculum integrating visual AI tools to teach algorithms, logic trees, and basic machine learning concepts.",
    collaborationTrack: "Early Stage Tech Discovery",
    stats: "100% student certification rate",
    accentColor: "from-violet-600 to-purple-800",
  },

  // ─── TECH COMPANIES & LABS ────────────────────────────────────────────────
  {
    id: "huggingface-comm",
    name: "Open Source AI Guild",
    location: "Bengaluru & Remote",
    type: "COMPANY",
    badge: "Industry Cloud Partner",
    focus: "Model Benchmarking & Fine-Tuning Compute",
    description: "Provides compute sponsorships, GPU sandbox credits, and model validation resources for standout collegiate projects.",
    collaborationTrack: "Cloud Credits & Model Benchmarking",
    stats: "Over ₹15L compute credits distributed",
    accentColor: "from-yellow-600 to-amber-800",
  },
  {
    id: "cogni-labs",
    name: "Cognitive Vector Labs",
    location: "San Francisco / Remote",
    type: "COMPANY",
    badge: "Hiring & Placement Partner",
    focus: "Enterprise Multi-Agent Systems & RAG",
    description: "Direct talent pipeline hiring pre-screened, portfolio-verified student developers directly from the Savzyen community.",
    collaborationTrack: "Direct Placement & Summer Internships",
    stats: "18 student developers hired in 2025",
    accentColor: "from-blue-600 to-cyan-800",
  },
  {
    id: "synth-media",
    name: "Synthetix Creative Studio",
    location: "Mumbai, India",
    type: "COMPANY",
    badge: "Creative Partner",
    focus: "Generative Video & Sound Synthesis",
    description: "Collaborates with students on real brand commercials, providing commercial production briefs and design asset mentoring.",
    collaborationTrack: "Client Project Apprenticeships",
    stats: "14 commercial video campaigns delivered",
    accentColor: "from-fuchsia-600 to-rose-700",
  },

  // ─── PEOPLE / MENTORS ─────────────────────────────────────────────────────
  {
    id: "dr-arvind",
    name: "Dr. Arvind Swaminathan",
    location: "Academic Advisor",
    type: "MENTOR",
    badge: "Visiting Research Lead",
    focus: "Transformer Architectures & Mathematical Foundations",
    description: "Former AI lab researcher guiding Savzyen's curriculum benchmarks and authoring technical blueprints on distributed training.",
    collaborationTrack: "Curriculum Advisor & Keynote Speaker",
    accentColor: "from-indigo-600 to-blue-700",
  },
  {
    id: "priya-sundaram",
    name: "Priya Sundaram",
    location: "Staff ML Engineer",
    type: "MENTOR",
    badge: "Industry Mentor",
    focus: "Production RAG, Vector Search & Latency Optimization",
    description: "Regular hackathon judge conducting monthly office hours with student teams building full-stack AI SaaS applications.",
    collaborationTrack: "Hackathon Judge & Office Hours Mentor",
    accentColor: "from-purple-600 to-pink-700",
  },
  {
    id: "karthik-narayan",
    name: "Karthik Narayanan",
    location: "Lead Campus Coordinator",
    type: "MENTOR",
    badge: "Community Lead",
    focus: "Student Community Building & Hackathons",
    description: "Organizes inter-college AI hackathons, orchestrating workshops across 15+ university engineering departments.",
    collaborationTrack: "Campus Ambassador Network Lead",
    accentColor: "from-emerald-600 to-teal-700",
  },
];

const COLLAB_INTERESTS = [
  "Campus AI Workshop & Hands-on Lab",
  "Institutional Student Subscriptions",
  "Host an AI Hackathon with Us",
  "Internship & Placement Hiring",
  "Guest Lecture / Industry Mentorship",
  "Tool Partnership / Product Integration",
  "High School STEM Program",
  "Custom Enterprise AI Upskilling",
];

export function CollabClient() {
  const [activeTab, setActiveTab] = useState<"ALL" | "COLLEGE" | "SCHOOL" | "COMPANY" | "MENTOR">("ALL");

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    category: "COLLEGE",
    role: "",
    phone: "",
    studentCount: "500 - 1,500 students",
    interests: ["Campus AI Workshop & Hands-on Lab"],
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filteredCollaborators =
    activeTab === "ALL"
      ? COLLABORATORS
      : COLLABORATORS.filter((c) => c.type === activeTab);

  const toggleInterest = (interest: string) => {
    setForm((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        if (prev.interests.length === 1) return prev; // keep at least 1
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/collab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit collaboration proposal");
      }

      setStatus("success");
      setSuccessMsg(data.message || "Thank you! Our partnerships team will connect with you within 24 hours.");
      setForm({
        name: "",
        email: "",
        organization: "",
        category: "COLLEGE",
        role: "",
        phone: "",
        studentCount: "500 - 1,500 students",
        interests: ["Campus AI Workshop & Hands-on Lab"],
        message: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="space-y-20">
      {/* ─── METRICS CARDS ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-5 text-center hover:border-[#3B82F6]/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">25+</p>
          <p className="text-xs text-[#A7B2CC] mt-1 font-medium">Partner Colleges & Institutes</p>
        </div>

        <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-5 text-center hover:border-[#10B981]/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">18,500+</p>
          <p className="text-xs text-[#A7B2CC] mt-1 font-medium">Student Learners on Savzyen</p>
        </div>

        <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-5 text-center hover:border-purple-500/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">45+</p>
          <p className="text-xs text-[#A7B2CC] mt-1 font-medium">Companies & Industry Mentors</p>
        </div>

        <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-5 text-center hover:border-amber-500/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">120+</p>
          <p className="text-xs text-[#A7B2CC] mt-1 font-medium">Campus AI Hackathons & Labs</p>
        </div>
      </div>

      {/* ─── COLLABORATORS DIRECTORY ─────────────────────────────────────────── */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24314F]/60 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Our Active Collaborators
            </h2>
            <p className="text-xs sm:text-sm text-[#A7B2CC] mt-1">
              Universities, schools, innovators, and industry leaders building the future with Savzyen.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "ALL", label: "All" },
              { id: "COLLEGE", label: "Colleges & Students" },
              { id: "SCHOOL", label: "Schools" },
              { id: "COMPANY", label: "Tech Companies" },
              { id: "MENTOR", label: "Mentors" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeTab === tab.id
                    ? "bg-[#3B82F6] border-[#3B82F6] text-white shadow-md shadow-blue-500/20"
                    : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:text-white hover:border-[#3B82F6]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collaborators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCollaborators.map((collab) => (
            <div
              key={collab.id}
              className="group relative bg-[#0D1730] hover:bg-[#112040] border border-[#24314F] hover:border-[#3B82F6]/60 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
            >
              <div>
                {/* Header Row: Type Icon + Badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${collab.accentColor} flex items-center justify-center text-white font-bold shrink-0 shadow-md`}>
                    {collab.type === "COLLEGE" && <GraduationCap className="w-5 h-5" />}
                    {collab.type === "SCHOOL" && <School className="w-5 h-5" />}
                    {collab.type === "COMPANY" && <Building2 className="w-5 h-5" />}
                    {collab.type === "MENTOR" && <Users className="w-5 h-5" />}
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#112040] text-[#60A5FA] border border-[#24314F]">
                    {collab.badge}
                  </span>
                </div>

                {/* Name & Location */}
                <h3 className="text-base font-bold text-white group-hover:text-[#60A5FA] transition-colors leading-snug">
                  {collab.name}
                </h3>
                <p className="text-xs text-[#6B7FA3] mt-0.5">{collab.location}</p>

                {/* Student Count Pill (Prominently requested) */}
                {collab.studentCount && (
                  <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                    <Users className="w-3.5 h-3.5" />
                    <span>{collab.studentCount}</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-[#A7B2CC] leading-relaxed mt-3">
                  {collab.description}
                </p>
              </div>

              {/* Bottom Track / Metric */}
              <div className="pt-4 mt-4 border-t border-[#24314F]/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#9F67FF]">
                  <BadgeCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{collab.collaborationTrack}</span>
                </div>
                {collab.stats && (
                  <p className="text-[11px] text-[#6B7FA3] font-medium">
                    ⚡ {collab.stats}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── HOW WE COLLABORATE (TRACKS) ────────────────────────────────────── */}
      <div className="bg-[#0D1730]/60 border border-[#24314F] rounded-3xl p-8 md:p-10">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="text-xs font-bold text-[#60A5FA] uppercase tracking-widest">
            Partnership Tracks
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            How You Can Collaborate with Savzyen
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B2CC] mt-2">
            Tailored programs crafted for campuses, schools, startups, and community champions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#112040]/70 border border-[#24314F] rounded-2xl p-5 hover:border-[#3B82F6]/50 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Colleges & Universities</h4>
            <p className="text-xs text-[#A7B2CC] leading-relaxed">
              Launch official Savzyen student clubs, sponsor hackathon tracks, and give your students verified hands-on AI toolkits and placement credentials.
            </p>
          </div>

          <div className="bg-[#112040]/70 border border-[#24314F] rounded-2xl p-5 hover:border-emerald-500/50 transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <School className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Schools & K-12 STEM</h4>
            <p className="text-xs text-[#A7B2CC] leading-relaxed">
              Equip junior learners with safe, age-appropriate AI creation tools, creative design masterclasses, and certified educator training.
            </p>
          </div>

          <div className="bg-[#112040]/70 border border-[#24314F] rounded-2xl p-5 hover:border-purple-500/50 transition-all">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <Building2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Tech Companies & Labs</h4>
            <p className="text-xs text-[#A7B2CC] leading-relaxed">
              Hire top developer talent, benchmark your developer API or software, or provide GPU cloud credits for student hackathons.
            </p>
          </div>

          <div className="bg-[#112040]/70 border border-[#24314F] rounded-2xl p-5 hover:border-amber-500/50 transition-all">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Mentors & Influencers</h4>
            <p className="text-xs text-[#A7B2CC] leading-relaxed">
              Conduct guest webinars, judge premier hackathons, or author in-depth blueprint tutorials seen by tens of thousands of active builders.
            </p>
          </div>
        </div>
      </div>

      {/* ─── COLLABORATION APPLICATION FORM ─────────────────────────────────── */}
      <div id="collab-form-section" className="scroll-mt-20">
        <div className="max-w-3xl mx-auto bg-[#0D1730] border border-[#24314F] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Form Header */}
          <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-3">
              <Handshake className="w-3.5 h-3.5" />
              Join the Ecosystem
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Collaborate With Savzyen
            </h2>
            <p className="text-xs sm:text-sm text-[#A7B2CC] mt-2 leading-relaxed">
              Whether you are an engineering college dean, a school principal, a startup founder, or a technical mentor, fill in your details below to start collaborating.
            </p>
          </div>

          {status === "success" ? (
            <div className="text-center py-12 px-4 space-y-4 relative z-10 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Proposal Received!</h3>
              <p className="text-sm text-[#A7B2CC] max-w-md mx-auto leading-relaxed">
                {successMsg}
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#112040] hover:bg-[#3B82F6] text-white border border-[#24314F] hover:border-[#3B82F6] transition"
                >
                  Submit Another Proposal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {status === "error" && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Row 1: Name & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="collab-name" className="text-xs font-semibold text-[#A7B2CC]">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="collab-name"
                    type="text"
                    required
                    placeholder="e.g. Prof. R. Ramanathan"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#112040] border border-[#24314F] text-xs text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#3B82F6] transition"
                    disabled={status === "loading"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="collab-email" className="text-xs font-semibold text-[#A7B2CC]">
                    Institutional / Work Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="collab-email"
                    type="email"
                    required
                    placeholder="e.g. dean@university.edu or name@company.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#112040] border border-[#24314F] text-xs text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#3B82F6] transition"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              {/* Row 2: Organization Type & Organization Name */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="collab-type" className="text-xs font-semibold text-[#A7B2CC]">
                    Collaborator Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="collab-type"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#112040] border border-[#24314F] text-xs text-white focus:outline-none focus:border-[#3B82F6] transition"
                    disabled={status === "loading"}
                  >
                    <option value="COLLEGE">Engineering College / University</option>
                    <option value="SCHOOL">School / K-12 STEM Academy</option>
                    <option value="COMPANY">Tech Company / AI Startup</option>
                    <option value="INDIVIDUAL">Individual Mentor / Speaker</option>
                    <option value="COMMUNITY">Developer Club / Community</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="collab-org" className="text-xs font-semibold text-[#A7B2CC]">
                    Institution / Company Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="collab-org"
                    type="text"
                    required
                    placeholder="e.g. Madras Institute of Technology or Acme AI"
                    value={form.organization}
                    onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#112040] border border-[#24314F] text-xs text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#3B82F6] transition"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              {/* Row 3: Role & Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="collab-role" className="text-xs font-semibold text-[#A7B2CC]">
                    Your Designation / Role <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="collab-role"
                    type="text"
                    required
                    placeholder="e.g. HOD Computer Science / Placement Officer / Founder"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#112040] border border-[#24314F] text-xs text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#3B82F6] transition"
                    disabled={status === "loading"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="collab-phone" className="text-xs font-semibold text-[#A7B2CC]">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    id="collab-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#112040] border border-[#24314F] text-xs text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#3B82F6] transition"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              {/* Row 4: Student Count / Community Scale */}
              {(form.category === "COLLEGE" || form.category === "SCHOOL" || form.category === "COMMUNITY") && (
                <div className="space-y-1.5">
                  <label htmlFor="collab-students" className="text-xs font-semibold text-[#A7B2CC]">
                    Approximate Students / Community Size
                  </label>
                  <select
                    id="collab-students"
                    value={form.studentCount}
                    onChange={(e) => setForm((f) => ({ ...f, studentCount: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#112040] border border-[#24314F] text-xs text-white focus:outline-none focus:border-[#3B82F6] transition"
                    disabled={status === "loading"}
                  >
                    <option value="100 - 500 students">100 – 500 students</option>
                    <option value="500 - 1,500 students">500 – 1,500 students</option>
                    <option value="1,500 - 3,500 students">1,500 – 3,500 students</option>
                    <option value="3,500+ students">3,500+ students (Campus-Wide)</option>
                  </select>
                </div>
              )}

              {/* Collaboration Interests (Pill Checkboxes) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#A7B2CC]">
                  What are you interested in collaborating on? <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLLAB_INTERESTS.map((interest) => {
                    const isSelected = form.interests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm shadow-blue-500/20"
                            : "bg-[#112040] border-[#24314F] text-[#A7B2CC] hover:text-white hover:border-[#3B82F6]"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message / Proposal */}
              <div className="space-y-1.5">
                <label htmlFor="collab-msg" className="text-xs font-semibold text-[#A7B2CC]">
                  Proposal Details / Expected Outcomes <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="collab-msg"
                  required
                  rows={4}
                  placeholder="Share a brief overview of your college/company, timeline, what you'd like to achieve together, or any specific dates..."
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#112040] border border-[#24314F] text-xs text-white placeholder-[#6B7FA3] focus:outline-none focus:border-[#3B82F6] transition resize-none leading-relaxed"
                  disabled={status === "loading"}
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:opacity-95 shadow-lg shadow-[#7C3AED]/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Collaboration Proposal...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Collaboration Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

