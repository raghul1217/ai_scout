"use client";

import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (e) {
      console.error(e);
    }
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleSignOut}
      className={
        className ||
        "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition text-center whitespace-nowrap"
      }
    >
      <LogOut className="w-3.5 h-3.5 shrink-0" />
      Sign Out
    </button>
  );
}
