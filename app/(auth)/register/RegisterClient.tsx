"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Crown,
  ShieldCheck,
  Check,
  Lock,
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  CreditCard,
} from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";

export interface PlanItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  billingType: string;
  features: string[];
}

interface RegisterClientProps {
  plans: PlanItem[];
}

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
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i <= strength ? strengthColor : "bg-[#24314f]"
            }`}
          />
        ))}
      </div>
      <div className="space-y-1">
        {checks.map(({ label, ok }) => (
          <p
            key={label}
            className={`text-xs flex items-center gap-1.5 ${
              ok ? "text-green-400" : "text-[#6b7fa3]"
            }`}
          >
            <Check className={`w-3 h-3 ${ok ? "opacity-100" : "opacity-30"}`} />
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}

export function RegisterClient({ plans }: RegisterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan");

  const { data: session } = useSession();
  const loggedInUser = session?.user;

  // Selected plan: default strictly to ₹499 pro plan
  const proPlan =
    plans.find((p) => p.slug === "pro") ||
    plans.find((p) => p.price === 49900) || {
      id: "plan_pro",
      name: "Savzen Pro",
      slug: "pro",
      description: "Full lifetime access to premium blueprints, advanced prompt packs, and member lounge.",
      price: 49900,
      currency: "INR",
      billingType: "LIFETIME",
      features: [
        "Everything in Free Community",
        "Access to all Premium Blueprints & Guides",
        "Production-tested agent prompt libraries",
        "Monthly commercial AI benchmark reports",
        "Priority VIP community lounge",
        "Lifetime access with zero recurring fees",
      ],
    };

  const freePlan =
    plans.find((p) => p.slug === "free" || p.price === 0) || {
      id: "plan_free",
      name: "Free Community",
      slug: "free",
      description: "Essential AI tool directory and weekly curated updates.",
      price: 0,
      currency: "INR",
      billingType: "ONE_TIME",
      features: [
        "Curated directory of 150+ verified AI tools",
        "Weekly AI newsletter & curated headlines",
        "Public community access on WhatsApp",
        "Basic search and filtering",
      ],
    };

  const [selectedSlug, setSelectedSlug] = useState<string>(
    requestedPlan === "free" ? "free" : "pro"
  );

  const currentPlan = selectedSlug === "free" && freePlan ? freePlan : proPlan;

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Helper to load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRegisterAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // If user is not logged in, validate inputs
    if (!loggedInUser) {
      if (!form.name.trim()) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (!form.email.trim()) {
        setErrorMsg("Please enter your email address.");
        return;
      }
      if (form.password.length < 8) {
        setErrorMsg("Password must be at least 8 characters.");
        return;
      }
    }

    setStatus("loading");

    try {
      let activeUserId = loggedInUser?.id;

      // 1. If not logged in, register account
      if (!loggedInUser) {
        const res = await fetch("/api/auth/sign-up/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Registration failed. Please check your details.");
        }

        const data = await res.json().catch(() => ({}));
        activeUserId = data?.user?.id;
      }

      // 2. If user chose Free plan (₹0), redirect to account immediately
      if (currentPlan.price === 0) {
        window.location.href = "/account";
        return;
      }

      // 3. Pro plan: initiate Razorpay Order
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection.");
      }

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: currentPlan.id || currentPlan.slug }),
      });

      if (!orderRes.ok) {
        const orderErr = await orderRes.json().catch(() => ({}));
        throw new Error(orderErr.error || "Failed to initialize payment order.");
      }

      const orderData = await orderRes.json();

      // 4. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Savzen",
        description: `Unlock ${currentPlan.name}`,
        order_id: orderData.orderId,
        prefill: {
          name: loggedInUser?.name || form.name,
          email: loggedInUser?.email || form.email,
        },
        theme: {
          color: "#7C3AED",
        },
        handler: async function (response: any) {
          try {
            setStatus("loading");
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            // Redirect to success page
            window.location.href = `/payment/success?plan=${encodeURIComponent(currentPlan.name)}`;
          } catch (err: any) {
            setStatus("error");
            setErrorMsg(err?.message || "Failed to verify payment.");
          }
        },
        modal: {
          ondismiss: function () {
            setStatus("idle");
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const isPro = currentPlan.price > 0;

  return (
    <div className="min-h-screen py-12 px-4 bg-[#050816] flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#7C3AED]/15 via-[#3B82F6]/10 to-transparent rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Logo & Headline */}
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">
              <span className="text-[#f8fafc]">Sav</span>
              <span className="gradient-text">zen</span>
            </span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {isPro ? "Join Savzen Pro" : "Join Savzen Community"}
          </h1>
          <p className="text-sm text-[#A7B2CC] max-w-md mx-auto">
            {isPro
              ? "Complete your details below to get instant lifetime access to all production blueprints and vault intelligence."
              : "Create your free account to browse verified AI tools and read weekly newsletters."}
          </p>
        </div>

        {/* Plan Switcher Pills */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-[#0D1730] border border-[#24314F]">
            <button
              type="button"
              onClick={() => setSelectedSlug("pro")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedSlug === "pro"
                  ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white shadow-md shadow-[#7C3AED]/20"
                  : "text-[#A7B2CC] hover:text-white"
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-yellow-300" />
              Pro Access • ₹499
            </button>
            <button
              type="button"
              onClick={() => setSelectedSlug("free")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedSlug === "free"
                  ? "bg-[#112040] text-white border border-[#24314F]"
                  : "text-[#A7B2CC] hover:text-white"
              }`}
            >
              Free Community (₹0)
            </button>
          </div>
        </div>

        {/* Main Grid: Plan Details + Registration Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Plan Details & Guarantee */}
          <div className="md:col-span-5 rounded-2xl bg-[#0D1730] border border-[#7C3AED]/40 p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl shadow-[#7C3AED]/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C3AED]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[11px] font-bold text-[#9F67FF] mb-3">
                <Crown className="w-3.5 h-3.5 text-yellow-300" />
                {isPro ? "Full Access Membership" : "Community Tier"}
              </div>
              <h2 className="text-2xl font-black text-white">{currentPlan.name}</h2>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-extrabold text-white">
                  {currentPlan.price === 0 ? "Free" : `₹${currentPlan.price / 100}`}
                </span>
                <span className="text-xs text-[#A7B2CC]">
                  {currentPlan.price === 0 ? "forever" : "one-time payment"}
                </span>
              </div>
              <p className="text-xs text-[#A7B2CC] mt-2 leading-relaxed">
                {currentPlan.description}
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-4 border-t border-[#24314F]">
              <p className="text-xs font-semibold text-[#6B7FA3] uppercase tracking-wider">
                What&apos;s Included:
              </p>
              <ul className="space-y-2.5">
                {currentPlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#E2E8F0]">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security badge */}
            <div className="pt-4 border-t border-[#24314F] flex items-center gap-2 text-xs text-[#16C784]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Instant activation & 256-bit encrypted checkout</span>
            </div>
          </div>

          {/* Right Column: Account Details & Payment Action */}
          <div className="md:col-span-7 rounded-2xl bg-[#0D1730] border border-[#24314F] p-6 md:p-8 space-y-6 shadow-xl">
            {loggedInUser ? (
              /* Already Signed In View */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-[#24314F] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm">
                    {loggedInUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#6B7FA3]">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{loggedInUser.name}</p>
                    <p className="text-xs text-[#A7B2CC] truncate">{loggedInUser.email}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#050816] border border-[#24314F] space-y-2 text-xs">
                  <div className="flex justify-between text-[#A7B2CC]">
                    <span>Selected Plan</span>
                    <span className="font-semibold text-white">{currentPlan.name}</span>
                  </div>
                  <div className="flex justify-between text-[#A7B2CC]">
                    <span>Billing Type</span>
                    <span className="font-semibold text-white">
                      {isPro ? "Lifetime Access" : "Free"}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#24314F] flex justify-between text-sm font-bold text-white">
                    <span>Total Due</span>
                    <span className="text-gradient">
                      {currentPlan.price === 0 ? "₹0" : `₹${currentPlan.price / 100}`}
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    {errorMsg}
                  </p>
                )}

                <button
                  onClick={handleRegisterAndPay}
                  disabled={status === "loading"}
                  className="btn btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#7C3AED]/25"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Initializing checkout…
                    </>
                  ) : isPro ? (
                    <>
                      <Lock className="w-4 h-4" />
                      Proceed to Pay ₹{currentPlan.price / 100}
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Go to My Account
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* New User Registration Form */
              <form onSubmit={handleRegisterAndPay} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Enter Account Details</h3>
                  <p className="text-xs text-[#A7B2CC] mt-0.5">
                    Your login credentials for accessing the platform and Member Vault.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-[#A7B2CC]">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="input text-sm"
                    disabled={status === "loading"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-[#A7B2CC]">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="input text-sm"
                    disabled={status === "loading"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-medium text-[#A7B2CC]">
                    Create Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      className="input pr-10 text-sm"
                      disabled={status === "loading"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7FA3] hover:text-[#A7B2CC]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                </div>

                {/* Order Summary Line */}
                <div className="p-3.5 rounded-xl bg-[#050816] border border-[#24314F] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#A7B2CC]">
                    <CreditCard className="w-4 h-4 text-[#7C3AED]" />
                    <span>Order Total:</span>
                  </div>
                  <span className="font-extrabold text-white text-sm">
                    {currentPlan.price === 0 ? "₹0 (Free)" : `₹${currentPlan.price / 100}`}
                  </span>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#7C3AED]/25"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account & launching payment…
                    </>
                  ) : isPro ? (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay ₹{currentPlan.price / 100} & Join Pro
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Create Free Account
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-[#6B7FA3] pt-2">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                    Log in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

