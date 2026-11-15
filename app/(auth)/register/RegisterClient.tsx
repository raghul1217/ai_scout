"use client";

import { useState } from "react";
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
  ArrowLeft,
  Zap,
  CreditCard,
  QrCode,
  Copy,
  Upload,
  CheckCircle2,
  Smartphone,
  ExternalLink,
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
      name: "SAVZYEN Premium",
      slug: "pro",
      description: "Stay Ahead. Learn Faster. Build Smarter.",
      price: 49900,
      currency: "INR",
      billingType: "YEARLY",
      features: [
        "Daily AI News & Industry Updates",
        "Latest AI Tools & Feature Discoveries",
        "Practical AI Daily Challenges with Tutorials & Learning Resources",
        "Industry Insights & Weekly Reports",
        "Weekly AI Challenges",
        "Tech Events, Meetups & Conferences",
        "Exclusive Live Sessions with Founders & Experts",
        "Exclusive Learning & Career Opportunities",
        "GitHub News, Projects & Trending Repositories",
        "Build Real-Time AI Agents & Practical Modules",
      ],
    };

  const freePlanRaw = plans.find((p) => p.slug === "free" || p.price === 0);
  const freePlan = freePlanRaw
    ? { ...freePlanRaw, name: freePlanRaw.name === "Free" ? "Savzyen Free" : freePlanRaw.name }
    : {
        id: "plan_free",
        name: "Savzyen Free",
        slug: "free",
        description: "Essential AI tool directory and curated daily updates.",
        price: 0,
        currency: "INR",
        billingType: "ONE_TIME",
        features: ["AI Updates Daily 1", "Weekly 1 news"],
      };

  const [selectedSlug, setSelectedSlug] = useState<string>(
    requestedPlan === "free" ? "free" : "pro"
  );

  const currentPlan = selectedSlug === "free" && freePlan ? freePlan : proPlan;
  const isPro = currentPlan.price > 0;

  // Flow Step: 1 = Details, 2 = Pay via UPI & Proof, 3 = Submitted
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // UPI Proof State
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState<string>("");
  const [screenshotName, setScreenshotName] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Submission Status
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedUtr, setSubmittedUtr] = useState("");

  const UPI_ID = "prabhasreddy093-1@oksbi";
  const PAYEE_NAME = "Prabhas Reddy";
  const UPI_DEEP_LINK = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=499&cu=INR&tn=Savzyen_Pro_Annual`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Screenshot size must be under 5MB.");
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Step 1: Proceed to Payment or Direct Free Account
  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const activeName = loggedInUser?.name || form.name.trim();
    const activeEmail = loggedInUser?.email || form.email.trim();

    if (!activeName) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!activeEmail) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!loggedInUser && form.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    // Free plan: register and go directly to account
    if (!isPro) {
      setStatus("loading");
      try {
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
            throw new Error(data.error ?? "Registration failed.");
          }
        }
        window.location.href = "/account";
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err.message || "Failed to create account.");
      }
      return;
    }

    // Pro plan: advance to Step 2 (UPI Payment screen)
    setStep(2);
  };

  // Step 2: Submit UPI Payment Proof (UTR + Screenshot)
  const handleSubmitUpiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      setErrorMsg("Please enter a valid 12-digit UTR or Transaction ID from your payment app.");
      return;
    }

    setStatus("loading");

    try {
      const activeName = loggedInUser?.name || form.name.trim();
      const activeEmail = loggedInUser?.email || form.email.trim();

      const res = await fetch("/api/payments/upi-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: activeName,
          email: activeEmail,
          password: loggedInUser ? undefined : form.password,
          utrNumber: cleanUtr,
          screenshotBase64: screenshotBase64 || undefined,
          planSlug: "pro",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit UPI payment verification.");
      }

      setSubmittedUtr(cleanUtr);
      setStatus("idle");
      setStep(3);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong submitting your payment proof.");
    }
  };

  // Helper to load Razorpay checkout script (Preserved for future switch)
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

  // Preserved Razorpay Flow Handler
  const handleRazorpayFallback = async () => {
    setStatus("loading");
    setErrorMsg("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay gateway. Please check your internet connection.");
      }

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: currentPlan.id || currentPlan.slug }),
      });

      if (!orderRes.ok) {
        const orderErr = await orderRes.json().catch(() => ({}));
        throw new Error(orderErr.error || "Failed to initialize Razorpay order.");
      }

      const orderData = await orderRes.json();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Savzyen",
        description: `Unlock ${currentPlan.name}`,
        order_id: orderData.orderId,
        prefill: {
          name: loggedInUser?.name || form.name,
          email: loggedInUser?.email || form.email,
        },
        theme: { color: "#7C3AED" },
        handler: async function (response: any) {
          try {
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
            window.location.href = `/payment/success?plan=${encodeURIComponent(currentPlan.name)}`;
          } catch (err: any) {
            setErrorMsg(err?.message || "Failed to verify Razorpay payment.");
            setStatus("idle");
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
      setErrorMsg(err instanceof Error ? err.message : "Razorpay payment error.");
    }
  };

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
              <span className="gradient-text">zyen</span>
            </span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {step === 3
              ? "Payment Submitted!"
              : step === 2
              ? "Scan & Pay via UPI"
              : isPro
              ? "Join Savzyen Pro"
              : "Join Savzyen Community"}
          </h1>
          <p className="text-sm text-[#A7B2CC] max-w-md mx-auto">
            {step === 3
              ? "Your payment proof is received. Our team will verify and activate your Pro membership shortly."
              : step === 2
              ? "Scan with GPay, PhonePe, Paytm, or BHIM. Pay ₹499 and submit your UTR."
              : isPro
              ? "Enter your details to unlock SAVZYEN Premium, daily challenges, and AI blueprints."
              : "Create your free account to browse verified AI tools and read newsletters."}
          </p>
        </div>

        {/* Step Indicator (Only on Pro Flow) */}
        {isPro && step !== 3 && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                step === 1
                  ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              <span>1. Account Details</span>
              {step > 1 && <Check className="w-3.5 h-3.5" />}
            </div>
            <div className="w-6 h-[1px] bg-[#24314F]" />
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                step === 2
                  ? "bg-[#3B82F6] text-white shadow-sm shadow-blue-500/30"
                  : "bg-[#0D1730] text-[#6B7FA3] border border-[#24314F]"
              }`}
            >
              <span>2. UPI Payment & Proof</span>
            </div>
          </div>
        )}

        {/* Plan Switcher Pills (Only on Step 1) */}
        {step === 1 && (
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
                SAVZYEN Premium • ₹499/year
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
                Savzyen Free (₹0)
              </button>
            </div>
          </div>
        )}

        {/* Main Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Plan Benefits & Guarantees */}
          <div className="md:col-span-5 rounded-2xl bg-[#0D1730] border border-[#7C3AED]/40 p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl shadow-[#7C3AED]/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C3AED]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[11px] font-bold text-[#9F67FF] mb-3">
                <Crown className="w-3.5 h-3.5 text-yellow-300" />
                {isPro ? "SAVZYEN Premium" : "Free Tier"}
              </div>
              <h2 className="text-2xl font-black text-white">{currentPlan.name}</h2>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-extrabold text-white">
                  {currentPlan.price === 0 ? "Free" : `₹${currentPlan.price / 100}/year`}
                </span>
                <span className="text-xs text-[#A7B2CC]">
                  {currentPlan.price === 0 ? "forever" : "annual access"}
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

            <div className="pt-4 border-t border-[#24314F] flex items-center gap-2 text-xs text-[#16C784]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Direct UPI verification & Pro activation</span>
            </div>
          </div>

          {/* Right Column: Multi-Step Interactive Form */}
          <div className="md:col-span-7 rounded-2xl bg-[#0D1730] border border-[#24314F] p-6 md:p-8 space-y-6 shadow-xl">
            {/* ─────────────────────────────────────────────────────────────
                STEP 1: Enter User Account Details
            ───────────────────────────────────────────────────────────── */}
            {step === 1 && (
              <div>
                {loggedInUser ? (
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
                        <span>Billing Cycle</span>
                        <span className="font-semibold text-white">
                          {isPro ? "Annual (1 Year)" : "Free"}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-[#24314F] flex justify-between text-sm font-bold text-white">
                        <span>Total Due</span>
                        <span className="text-gradient">
                          {currentPlan.price === 0 ? "₹0" : `₹${currentPlan.price / 100}/year`}
                        </span>
                      </div>
                    </div>

                    {errorMsg && (
                      <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                        {errorMsg}
                      </p>
                    )}

                    <button
                      onClick={handleNextStep}
                      disabled={status === "loading"}
                      className="btn btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#7C3AED]/25"
                    >
                      {isPro ? (
                        <>
                          <span>Next: Proceed to UPI Payment (₹499)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          <span>Go to My Account</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleNextStep} className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Create Your Account</h3>
                      <p className="text-xs text-[#A7B2CC] mt-0.5">
                        Enter your credentials to register on Savzyen.
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
                        placeholder="e.g. Alex Mercer"
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
                        placeholder="alex@example.com"
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

                    <div className="p-3.5 rounded-xl bg-[#050816] border border-[#24314F] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[#A7B2CC]">
                        <CreditCard className="w-4 h-4 text-[#7C3AED]" />
                        <span>Order Total:</span>
                      </div>
                      <span className="font-extrabold text-white text-sm">
                        {currentPlan.price === 0 ? "₹0 (Free)" : `₹${currentPlan.price / 100}/year`}
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
                          <span>Creating account…</span>
                        </>
                      ) : isPro ? (
                        <>
                          <span>Next: Proceed to UPI Payment (₹499)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          <span>Create Free Account</span>
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
            )}

            {/* ─────────────────────────────────────────────────────────────
                STEP 2: UPI Payment (QR Code & UTR Verification)
            ───────────────────────────────────────────────────────────── */}
            {step === 2 && (
              <form onSubmit={handleSubmitUpiPayment} className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-emerald-400" />
                      Scan & Pay via UPI
                    </h3>
                    <p className="text-xs text-[#A7B2CC] mt-0.5">
                      Open GPay, PhonePe, Paytm, or BHIM to pay ₹499.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#A7B2CC] hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                {/* QR Code & UPI Card */}
                <div className="p-5 rounded-2xl bg-[#050816] border border-[#24314F] flex flex-col sm:flex-row items-center gap-5">
                  {/* Official QR Image */}
                  <div className="bg-white p-2.5 rounded-2xl shadow-lg shrink-0 flex items-center justify-center">
                    <img
                      src="/images/upi-qr.png"
                      alt="GPay UPI QR Code - Savzyen ₹499"
                      className="w-36 h-auto sm:w-40 rounded-xl object-contain"
                    />
                  </div>

                  {/* Payment Details & Quick Copy */}
                  <div className="space-y-3 w-full text-center sm:text-left">
                    <div>
                      <p className="text-[11px] text-[#6B7FA3] uppercase tracking-wider font-semibold">
                        Payee Name
                      </p>
                      <p className="text-sm font-bold text-white">{PAYEE_NAME}</p>
                    </div>

                    <div>
                      <p className="text-[11px] text-[#6B7FA3] uppercase tracking-wider font-semibold">
                        UPI ID
                      </p>
                      <div className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg bg-[#0D1730] border border-[#24314F]">
                        <span className="text-xs font-mono font-bold text-[#60A5FA]">
                          {UPI_ID}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="text-[#6B7FA3] hover:text-white transition"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {copiedUpi && (
                        <p className="text-[10px] text-emerald-400 mt-1">UPI ID copied to clipboard!</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#24314F]/60 flex items-center justify-between sm:justify-start gap-4">
                      <div>
                        <p className="text-[10px] text-[#6B7FA3] uppercase">Amount to Pay</p>
                        <p className="text-base font-extrabold text-white">₹499.00</p>
                      </div>

                      {/* Mobile Deep Link */}
                      <a
                        href={UPI_DEEP_LINK}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#112040] hover:bg-[#3B82F6] text-[#A7B2CC] hover:text-white border border-[#24314F] transition"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Pay in UPI App</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Proof Input 1: 12-Digit UTR */}
                <div className="space-y-1.5">
                  <label htmlFor="utr" className="text-xs font-semibold text-[#A7B2CC]">
                    12-Digit UPI Transaction ID / UTR Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="utr"
                    type="text"
                    required
                    placeholder="e.g. 412384910293 (Check payment success receipt)"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="input text-sm font-mono tracking-wider"
                    disabled={status === "loading"}
                  />
                  <p className="text-[11px] text-[#6B7FA3]">
                    Found in Google Pay, PhonePe, or Paytm receipt as &quot;UTR&quot; or &quot;UPI Ref No.&quot;.
                  </p>
                </div>

                {/* Proof Input 2: Optional Screenshot Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A7B2CC] flex items-center justify-between">
                    <span>Upload Payment Screenshot (Optional)</span>
                    <span className="text-[10px] text-[#6B7FA3]">PNG, JPG up to 5MB</span>
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#24314F] hover:border-[#3B82F6] bg-[#050816] cursor-pointer transition">
                    <Upload className="w-4 h-4 text-[#60A5FA]" />
                    <span className="text-xs text-[#A7B2CC] truncate">
                      {screenshotName || "Click to browse screenshot image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={status === "loading"}
                    />
                  </label>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    {errorMsg}
                  </p>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#7C3AED]/25"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting proof for verification…</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Payment Proof (₹499)</span>
                    </>
                  )}
                </button>

                {/* Preserved Razorpay Alternative (Future Gateway) */}
                <div className="pt-3 border-t border-[#24314F]/60 text-center">
                  <p className="text-xs text-[#6B7FA3]">
                    Prefer instant Card / Netbanking checkout?{" "}
                    <button
                      type="button"
                      onClick={handleRazorpayFallback}
                      className="text-[#60A5FA] hover:text-[#93C5FD] underline font-semibold transition"
                    >
                      Pay via Razorpay
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ─────────────────────────────────────────────────────────────
                STEP 3: Submission Success State
            ───────────────────────────────────────────────────────────── */}
            {step === 3 && (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/15">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Payment Proof Submitted!</h3>
                  <p className="text-xs text-[#A7B2CC] mt-1 max-w-md mx-auto">
                    We have received your payment proof for <strong>SAVZYEN Premium (₹499/year)</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#050816] border border-[#24314F] text-xs space-y-2 text-left max-w-md mx-auto">
                  <div className="flex justify-between text-[#A7B2CC]">
                    <span>Reference / UTR</span>
                    <span className="font-mono font-bold text-white">{submittedUtr}</span>
                  </div>
                  <div className="flex justify-between text-[#A7B2CC]">
                    <span>Amount Paid</span>
                    <span className="font-semibold text-white">₹499.00</span>
                  </div>
                  <div className="flex justify-between text-[#A7B2CC]">
                    <span>Verification Status</span>
                    <span className="font-bold text-amber-400">Under Review</span>
                  </div>
                </div>

                <p className="text-xs text-[#6B7FA3] max-w-sm mx-auto leading-relaxed">
                  Our operations team verifies payments within a few hours. Once verified, your Pro membership will activate automatically and you will receive a confirmation email.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/tools"
                    className="btn btn-primary w-full sm:w-auto text-xs px-5 py-2.5"
                  >
                    Explore AI Tools
                  </Link>
                  <Link
                    href="/account"
                    className="btn btn-secondary w-full sm:w-auto text-xs px-5 py-2.5"
                  >
                    Go to My Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
