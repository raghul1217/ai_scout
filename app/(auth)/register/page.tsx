"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Zap, ArrowRight, Check } from "lucide-react";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(password) },
    { label: "Contains a letter", ok: /[a-zA-Z]/.test(password) },
  ];
  const strength = checks.filter((c) => c.ok).length;
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-green-500"][strength];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-1">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-[#24314f]"}`} />
        ))}
      </div>
      <div className="space-y-1">
        {checks.map(({ label, ok }) => (
          <p key={label} className={`text-xs flex items-center gap-1.5 ${ok ? "text-green-400" : "text-[#6b7fa3]"}`}>
            <Check className={`w-3 h-3 ${ok ? "opacity-100" : "opacity-30"}`} />
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setStatus("error");
      setErrorMsg("Password must be at least 8 characters");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Registration failed");
      }

      router.push("/account");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#050816] dot-grid">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-[#f8fafc]">AI</span>
              <span className="gradient-text"> Scout</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#f8fafc] mt-6 mb-1">Create your account</h1>
          <p className="text-sm text-[#a7b2cc]">Join AI Scout for free</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-xs font-medium text-[#a7b2cc]">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="register-name"
                type="text"
                required
                autoComplete="name"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input"
                disabled={status === "loading"}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-xs font-medium text-[#a7b2cc]">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                id="register-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input"
                disabled={status === "loading"}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-xs font-medium text-[#a7b2cc]">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="input pr-10"
                  disabled={status === "loading"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7fa3] hover:text-[#a7b2cc] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
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
              id="register-submit-btn"
            >
              {status === "loading" ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-xs text-center text-[#6b7fa3] mt-4">
            By registering, you agree to our{" "}
            <Link href="/terms" className="text-purple-400 hover:text-purple-300">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>.
          </p>

          <p className="text-sm text-center text-[#a7b2cc] mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
