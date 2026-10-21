import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Cancelled | AI Scout",
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen py-20 bg-[#050816] text-[#F8FAFC] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0D1730] border border-[#24314F] rounded-3xl p-8 md:p-10 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center mx-auto text-[#F59E0B]">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Payment Incomplete</h1>
          <p className="text-xs md:text-sm text-[#A7B2CC] leading-relaxed">
            The transaction was cancelled or did not complete. No charges were made to your account.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/pricing"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold bg-[#3B82F6] hover:bg-[#2563EB] text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </Link>

          <Link
            href="/contact"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-[#112040] hover:bg-[#24314F] text-[#A7B2CC] hover:text-white border border-[#24314F] transition"
          >
            <Mail className="w-3.5 h-3.5" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
