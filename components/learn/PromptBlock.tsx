"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface PromptBlockProps {
  name: string;
  description?: string;
  prompt: string;
}

export function PromptBlock({ name, description, prompt }: PromptBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[#24314F] bg-[#050816] overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-5 py-3.5 bg-[#0D1730] border-b border-[#24314F] flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>{name}</span>
          </h4>
          {description && (
            <p className="text-xs text-[#A7B2CC] mt-0.5">{description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
            copied
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-[#112040] hover:bg-[#1A2E5A] text-[#60A5FA] hover:text-white border border-[#24314F]"
          }`}
          aria-label="Copy prompt text to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre className="p-5 text-xs sm:text-sm font-mono text-[#E2E8F0] whitespace-pre-wrap leading-relaxed select-all overflow-x-auto">
        {prompt}
      </pre>
    </div>
  );
}

