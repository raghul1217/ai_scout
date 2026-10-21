"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Mail, MessageCircle, MapPin, Send, CheckCircle, Loader2 } from "lucide-react";

// Metadata not usable in client components — moved to separate layout/head
// Contact page is a client component for form state

const contactMethods = [
  { icon: Mail, label: "Email", value: "hello@aiscout.in", href: "mailto:hello@aiscout.in" },
  { icon: MessageCircle, label: "WhatsApp Community", value: "Join our community", href: "#community" },
];

const enquiryTypes = [
  { value: "GENERAL", label: "General Question" },
  { value: "PARTNERSHIP", label: "Partnership / Collaboration" },
  { value: "TEAM_ENQUIRY", label: "Team Training / Upskilling" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", type: "GENERAL", message: "" });
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
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to send");
      }
      setStatus("success");
      setForm({ name: "", email: "", type: "GENERAL", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left */}
          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">Contact</p>
              <h1 className="text-4xl font-bold text-[#f8fafc] mb-4">Get in Touch</h1>
              <p className="text-[#a7b2cc] leading-relaxed">
                Have a question, partnership idea, or want to explore team training? 
                We&apos;d love to hear from you.
              </p>
            </div>

            {contactMethods.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-[#6b7fa3] uppercase tracking-wider">{label}</p>
                  <a href={href} className="text-[#f8fafc] hover:text-purple-300 transition-colors font-medium">{value}</a>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Form */}
          <div className="card p-6 sm:p-8">
            {status === "success" ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                <p className="text-lg font-semibold text-[#f8fafc]">Message Sent!</p>
                <p className="text-sm text-[#a7b2cc]">We&apos;ll get back to you within 1–2 business days.</p>
                <button onClick={() => setStatus("idle")} className="btn btn-secondary btn-sm mt-4">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" id="contact-form">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-medium text-[#a7b2cc]">Name <span className="text-red-400">*</span></label>
                    <input id="contact-name" type="text" required placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" disabled={status === "loading"} />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-medium text-[#a7b2cc]">Email <span className="text-red-400">*</span></label>
                    <input id="contact-email" type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input" disabled={status === "loading"} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-type" className="text-xs font-medium text-[#a7b2cc]">Enquiry Type</label>
                  <select id="contact-type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="input" disabled={status === "loading"}>
                    {enquiryTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-medium text-[#a7b2cc]">Message <span className="text-red-400">*</span></label>
                  <textarea id="contact-message" required rows={5} placeholder="Tell us how we can help…" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="input resize-none" disabled={status === "loading"} />
                </div>
                {status === "error" && (
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{errorMsg}</p>
                )}
                <button type="submit" disabled={status === "loading"} className="btn btn-primary w-full" id="contact-submit-btn">
                  {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : <><Send className="w-4 h-4" />Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
