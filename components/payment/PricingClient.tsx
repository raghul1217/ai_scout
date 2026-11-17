"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Crown, ArrowRight } from "lucide-react";

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
  const router = useRouter();

  useEffect(() => {
    // If someone reaches the pricing client directly, immediately route them to the join page
    router.replace("/register?plan=pro");
  }, [router]);

  function handleCheckout(plan: Plan) {
    if (plan.price === 0) {
      router.push("/register?plan=free");
    } else {
      router.push("/register?plan=pro");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {plans.map((plan) => {
          const isPopular = plan.price > 0;

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
                  Most Popular
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
                      ₹{(plan.price / 100).toLocaleString("en-IN")}{plan.price > 0 ? "/year" : ""}
                    </span>
                    <span className="text-xs text-[#6B7FA3]">
                      {plan.price === 0
                        ? "forever"
                        : "annual access"}
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
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  isPopular
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white hover:opacity-95 shadow-lg shadow-[#7C3AED]/25"
                    : "bg-[#112040] hover:bg-[#24314F] text-white border border-[#24314F]"
                }`}
              >
                {plan.price === 0 ? (
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
