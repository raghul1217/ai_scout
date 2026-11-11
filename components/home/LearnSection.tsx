import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Code, Lightbulb } from "lucide-react";

const difficultyConfig = {
  Beginner: { class: "badge-green", label: "Beginner" },
  Intermediate: { class: "badge-yellow", label: "Intermediate" },
  Advanced: { class: "badge-red", label: "Advanced" },
};

const resources = [
  {
    id: "1",
    title: "Getting Started with Prompt Engineering",
    summary: "Learn the fundamentals of writing effective prompts to get the best results from AI models like ChatGPT and Claude.",
    category: "Prompt Engineering",
    difficulty: "Beginner" as const,
    readTime: 8,
    gradient: "from-purple-600/20 to-violet-600/10",
    icon: Lightbulb,
    href: "/learn",
    tags: ["ChatGPT", "Prompts", "Basics"],
  },
  {
    id: "2",
    title: "Build a Chatbot with Python & OpenAI API",
    summary: "Step-by-step guide to building your own AI chatbot using Python, the OpenAI API, and a simple web interface.",
    category: "Development",
    difficulty: "Intermediate" as const,
    readTime: 15,
    gradient: "from-blue-600/20 to-cyan-600/10",
    icon: Code,
    href: "/learn",
    tags: ["Python", "OpenAI", "API"],
  },
  {
    id: "3",
    title: "Fine-Tuning LLMs for Custom Tasks",
    summary: "Explore techniques for fine-tuning large language models on custom datasets to optimize them for specific domains.",
    category: "Machine Learning",
    difficulty: "Advanced" as const,
    readTime: 20,
    gradient: "from-orange-600/20 to-amber-600/10",
    icon: BookOpen,
    href: "/learn",
    tags: ["Fine-tuning", "LLMs", "ML"],
  },
];

export function LearnSection() {
  return (
    <section className="py-20 bg-[#0a1024]">
      <div className="container-max">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2">
              Learning
            </p>
            <h2 className="text-3xl font-bold text-[#f8fafc]">
              Learn AI by Doing
            </h2>
            <p className="text-[#a7b2cc] mt-2">
              Practical tutorials and guides for all skill levels
            </p>
          </div>
          <Link
            href="/learn"
            className="hidden sm:flex items-center gap-2 text-sm text-[#a7b2cc] hover:text-[#f8fafc] transition-colors group"
          >
            All Resources
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Resources Grid - Vertical Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const diff = difficultyConfig[resource.difficulty];
            const Icon = resource.icon;

            return (
              <Link
                key={resource.id}
                href={resource.href}
                className="card card-glow flex flex-col group overflow-hidden h-full"
              >
                {/* Top Icon / Thumbnail Banner */}
                <div
                  className={`h-40 bg-gradient-to-br ${resource.gradient} flex items-center justify-center shrink-0 relative overflow-hidden`}
                >
                  {/* Subtle decorative geometry */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                    <div className="w-24 h-24 rounded-full border-2 border-white/30" />
                    <div className="absolute w-36 h-36 rounded-full border border-white/10" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`badge ${diff.class}`}>{diff.label}</span>
                      <span className="badge badge-gray">{resource.category}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#f8fafc] group-hover:text-purple-300 transition-colors mb-2 leading-snug">
                      {resource.title}
                    </h3>

                    <p className="text-sm text-[#a7b2cc] leading-relaxed line-clamp-3">
                      {resource.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {resource.tags.map((tag) => (
                        <span key={tag} className="text-xs text-[#6b7fa3]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#24314F]/60">
                    <span className="flex items-center gap-1.5 text-xs text-[#6b7fa3]">
                      <Clock className="w-3.5 h-3.5" />
                      {resource.readTime} min read
                    </span>
                    <span className="flex items-center gap-1 text-xs text-purple-400 font-semibold group-hover:gap-2 transition-all">
                      Start Learning
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/learn" className="btn btn-secondary btn-sm">
            All Learning Resources
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
