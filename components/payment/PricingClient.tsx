"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Crown, Zap, Loader2, ArrowRight } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  billingType: string;
  features: string[];
}

interface PricingClientProps {
  plans: Plan[];
}

export function PricingClient({ plans }: PricingClientProps) {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
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

  async function handleCheckout(plan: Plan) {
    if (plan.price === 0) {
      router.push("/register");
      return;
    }

    setLoadingPlanId(plan.id);
    setErrorMsg(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your connection.");
      }

      // 1. Create order on server
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });

      if (res.status === 401) {
        router.push(`/login?returnUrl=/pricing`);
        return;
      }

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || "Failed to initialize payment.");
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AI Scout",
        description: `Upgrade to ${plan.name}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setLoadingPlanId(plan.id);
            // 3. Verify payment signature on server
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

            router.push(`/payment/success?plan=${encodeURIComponent(plan.name)}`);
          } catch (err: any) {
            setErrorMsg(err.message || "Payment verification failed.");
            setLoadingPlanId(null);
          }
        },
        theme: {
          color: "#7C3AED",
        },
        modal: {
          ondismiss: function () {
            setLoadingPlanId(null);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setErrorMsg(err.message || "Checkout error occurred.");
      setLoadingPlanId(null);
    }
  }

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 rounded-xl text-xs bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-center max-w-md mx-auto">
          {errorMsg}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isPro = plan.price > 0 && plan.billingType !== "LIFETIME";
          const isLifetime = plan.billingType === "LIFETIME";
          const isPopular = isPro || isLifetime;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition relative ${
                isPopular
                  ? "bg-[#0D1730] border-2 border-[#7C3AED] shadow-2xl shadow-[#7C3AED]/15"
                  : "bg-[#0D1730] border border-[#24314F]"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                  {isLifetime ? "Best Value" : "Most Popular"}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-[#A7B2CC] min-h-[32px] leading-relaxed mb-6">
                  {plan.description}
                </p>

                <div className="mb-6 pb-6 border-b border-[#24314F]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">
                      ₹{(plan.price / 100).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-[#6B7FA3]">
                      {plan.price === 0
                        ? "forever"
                        : plan.billingType === "LIFETIME"
                        ? "one-time"
                        : "/month"}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 text-xs text-[#A7B2CC]">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#16C784] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleCheckout(plan)}
                disabled={loadingPlanId !== null}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  isPopular
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 shadow-lg shadow-[#7C3AED]/25"
                    : "bg-[#112040] hover:bg-[#24314F] text-white border border-[#24314F]"
                }`}
              >
                {loadingPlanId === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Opening Checkout…
                  </>
                ) : plan.price === 0 ? (
                  <>
                    Join for Free
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-yellow-300" />
                    Upgrade Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
