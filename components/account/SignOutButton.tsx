"use client";

import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";

export function SignOutButton() {
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
      className="px-3.5 py-2 text-xs font-medium rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition flex items-center gap-1.5"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign Out
    </button>
  );
}

