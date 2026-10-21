"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2, Building2, Users, Lightbulb, Award } from "lucide-react";

const offerings = [
  {
    icon: Lightbulb,
    title: "AI Workshops",
    description: "Hands-on workshops tailored to your team's skill level and goals.",
  },
  {
    icon: Users,
    title: "Team Training",
    description: "Custom AI training programs to upskill your entire organization.",
  },
  {
    icon: Building2,
    title: "Corporate Programs",
    description: "End-to-end AI adoption programs for enterprises and startups.",
  },
  {
    icon: Award,
    title: "Partnership",
    description: "Co-create content, sponsor events, or build integrated learning paths.",
  },
];

export function UpskillSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "TEAM_ENQUIRY" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to send enquiry");
      }

      setStatus("success");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-24 bg-[#0a1024]">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Content */}
          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">
                For Teams & Organizations
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] leading-tight">
                Upskill Your Team{" "}
                <span className="gradient-text">with AI</span>
              </h2>
              <p className="text-[#a7b2cc] mt-4 leading-relaxed">
                AI Scout offers structured AI training, workshops, and partnership programs 
                to help organizations stay competitive in the age of artificial intelligence.
              </p>
            </div>

            {/* Offerings */}
            <div className="grid sm:grid-cols-2 gap-4">
              {offerings.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="card p-4 space-y-2"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-purple-400" />
                  </div>
                  <p className="text-sm font-semibold text-[#f8fafc]">{title}</p>
                  <p className="text-xs text-[#a7b2cc] leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="card p-6 sm:p-8">
            <h3 className="text-xl font-bold text-[#f8fafc] mb-6">
              Send us an enquiry
            </h3>

            {status === "success" ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                <p className="text-lg font-semibold text-[#f8fafc]">Enquiry Sent!</p>
                <p className="text-sm text-[#a7b2cc]">
                  Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn btn-secondary btn-sm mt-4"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" id="upskill-contact-form">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="upskill-name" className="text-xs font-medium text-[#a7b2cc]">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="upskill-name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="input"
                      disabled={status === "loading"}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="upskill-email" className="text-xs font-medium text-[#a7b2cc]">
                      Work Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="upskill-email"
                      type="email"
                      required
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="input"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="upskill-company" className="text-xs font-medium text-[#a7b2cc]">
                    Company / Organization
                  </label>
                  <input
                    id="upskill-company"
                    type="text"
                    placeholder="Acme Corp"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    className="input"
                    disabled={status === "loading"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="upskill-message" className="text-xs font-medium text-[#a7b2cc]">
                    How can we help? <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="upskill-message"
                    required
                    rows={4}
                    placeholder="Tell us about your team's AI learning goals, team size, or partnership ideas…"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="input resize-none"
                    disabled={status === "loading"}
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn btn-primary w-full"
                  id="upskill-submit-btn"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Enquiry
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-xs text-[#6b7fa3] text-center">
                  We typically respond within 1–2 business days.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
