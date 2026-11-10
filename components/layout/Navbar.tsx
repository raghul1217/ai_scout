"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  User,
  ChevronDown,
  Zap,
  LogOut,
  Settings,
  LayoutDashboard,
  Crown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient, useSession } from "@/lib/auth/auth-client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/tools", label: "Tools" },
  { href: "/learn", label: "Learn" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

interface NavbarProps {
  user?: {
    id?: string;
    name: string;
    email: string;
    role: string;
    isPremium: boolean;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync client-side session with server-provided user
  const { data: session } = useSession();
  const currentUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as any).role || user?.role || "USER",
        isPremium: user?.isPremium ?? false,
      }
    : user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile and user menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Click outside to close user menu dropdown
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#nav-user-menu-container")) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userMenuOpen]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    try {
      await authClient.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    window.location.href = "/";
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass-dark border-b border-[#24314f]/60 shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <nav className="container-max flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="Savzen Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-[#f8fafc]">Sav</span>
              <span className="gradient-text">zen</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-6" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "nav-link",
                    pathname === link.href && "active"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Search"
              id="nav-search-btn"
            >
              <Search className="w-4 h-4" />
            </button>

            {currentUser?.isPremium ? (
              /* User has Premium: Display User Icon in top right with /account page */
              <div className="flex items-center gap-2.5">
                <Link
                  href="/collab"
                  id="nav-collab-btn"
                  className={cn(
                    "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                    pathname === "/collab"
                      ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50 shadow-sm shadow-[#10B981]/20"
                      : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:text-white hover:border-[#10B981]/50 hover:bg-[#112040]"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Collab</span>
                </Link>

                <div className="relative" id="nav-user-menu-container">
                  <div className="flex items-center gap-1.5 bg-[#0d1730]/90 border border-[#24314f] hover:border-[#7c3aed] rounded-full p-1 pr-2 transition-all shadow-sm">
                    <Link
                      href="/account"
                      id="nav-user-account-btn"
                      className="flex items-center gap-2 text-xs font-semibold text-[#f8fafc] hover:text-white transition-colors group"
                      title="My Account"
                      aria-label="My Account"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="max-w-[120px] truncate">
                        {currentUser.name}
                      </span>
                      <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    </Link>

                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="p-1 text-[#6b7fa3] hover:text-[#f8fafc] rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Open user dropdown"
                      aria-expanded={userMenuOpen}
                    >
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          userMenuOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </div>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-dark rounded-xl border border-[#24314f] shadow-2xl py-1 animate-fade-in z-50">
                    <div className="px-3.5 py-2.5 border-b border-[#24314f]/60">
                      <p className="text-[11px] text-[#6b7fa3] font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-[#f8fafc] truncate">{currentUser.email}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        <Crown className="w-2.5 h-2.5" />
                        Pro Member
                      </span>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4 text-[#3b82f6]" /> My Account
                    </Link>
                    <Link
                      href="/premium"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors"
                    >
                      <Crown className="w-4 h-4 text-yellow-400" /> Member Vault
                    </Link>
                    {currentUser.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" /> Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-[#24314f]/60 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#ef4444] hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            ) : currentUser ? (
              /* Signed in Free user: Show Join • ₹499 + Collab + User Icon */
              <div className="flex items-center gap-2.5">
                <Link
                  href="/register?plan=pro"
                  id="nav-join-pro-btn"
                  className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:opacity-95 shadow-lg shadow-[#7C3AED]/25 hover:shadow-[#7C3AED]/40 transition-all group"
                >
                  <span>Join • ₹499</span>
                </Link>

                <Link
                  href="/collab"
                  id="nav-collab-btn"
                  className={cn(
                    "relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border",
                    pathname === "/collab"
                      ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50 shadow-sm shadow-[#10B981]/20"
                      : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:text-white hover:border-[#10B981]/50 hover:bg-[#112040]"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Collab</span>
                </Link>

                <div className="relative" id="nav-user-menu-container">
                  <div className="flex items-center gap-1.5 bg-[#0d1730]/90 border border-[#24314f] hover:border-[#7c3aed] rounded-full p-1 pr-2 transition-all shadow-sm">
                    <Link
                      href="/account"
                      id="nav-user-account-btn"
                      className="flex items-center gap-2 text-xs font-semibold text-[#f8fafc] hover:text-white transition-colors group"
                      title="My Account"
                      aria-label="My Account"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="max-w-[100px] truncate">
                        {currentUser.name}
                      </span>
                    </Link>

                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="p-1 text-[#6b7fa3] hover:text-[#f8fafc] rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Open user dropdown"
                      aria-expanded={userMenuOpen}
                    >
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          userMenuOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </div>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 glass-dark rounded-xl border border-[#24314f] shadow-2xl py-1 animate-fade-in z-50">
                      <div className="px-3.5 py-2.5 border-b border-[#24314f]/60">
                        <p className="text-[11px] text-[#6b7fa3] font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-[#f8fafc] truncate">{currentUser.email}</p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Free Community Tier
                        </span>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4 text-[#3b82f6]" /> My Account
                      </Link>
                      <Link
                        href="/register?plan=pro"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-yellow-400 hover:text-yellow-300 hover:bg-white/5 transition-colors"
                      >
                        <Crown className="w-4 h-4 text-yellow-400" /> Upgrade to Pro (₹499)
                      </Link>
                      {currentUser.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-purple-400" /> Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-[#24314f]/60 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#ef4444] hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* User NOT Signed In: Join • ₹499 button, Collab and subtle Log In */
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  id="nav-login-btn"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register?plan=pro"
                  id="nav-join-pro-btn"
                  className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:opacity-95 shadow-lg shadow-[#7C3AED]/25 hover:shadow-[#7C3AED]/40 transition-all group"
                >
                  <span>Join • ₹499</span>
                </Link>
                <Link
                  href="/collab"
                  id="nav-collab-btn"
                  className={cn(
                    "relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border",
                    pathname === "/collab"
                      ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50 shadow-sm shadow-[#10B981]/20"
                      : "bg-[#0D1730] border-[#24314F] text-[#A7B2CC] hover:text-white hover:border-[#10B981]/50 hover:bg-[#112040]"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Collab</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: User Icon or Join Button + Hamburger Toggle (STRICTLY md:hidden, no .btn) */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser?.isPremium ? (
              <Link
                href="/account"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-brand text-white shadow-sm"
                title="My Account"
                aria-label="My Account"
              >
                <User className="w-4 h-4 text-white" />
              </Link>
            ) : (
              <Link
                href="/register?plan=pro"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] shadow-sm"
              >
                <span>Join ₹499</span>
              </Link>
            )}

            {/* Mobile Menu Toggle - NEVER shows on desktop because no .btn overrides md:hidden */}
            <button
              className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors border border-[#24314f]/60"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              id="nav-mobile-toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-72 glass-dark border-l border-[#24314f] md:hidden transition-transform duration-300 flex flex-col shadow-2xl",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#24314f]">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-bold">
              <span className="text-[#f8fafc]">Sav</span>
              <span className="gradient-text">zen</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-[#a7b2cc] hover:text-[#f8fafc] rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-purple-500/10 text-[#f8fafc] border border-purple-500/20"
                      : "text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/collab"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors border",
                  pathname === "/collab"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "text-[#10B981] border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10"
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  Collaborate with Us
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 font-bold uppercase">
                  Partner
                </span>
              </Link>
            </li>
          </ul>

          {currentUser && (
            <div className="mt-4 pt-4 border-t border-[#24314f] space-y-1">
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors"
              >
                <User className="w-4 h-4 text-[#3b82f6]" /> My Account
              </Link>
              {currentUser.isPremium && (
                <Link
                  href="/premium"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors"
                >
                  <Crown className="w-4 h-4 text-yellow-400" /> Member Vault
                </Link>
              )}
              {currentUser.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-purple-400" /> Admin Dashboard
                </Link>
              )}
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-[#24314f] space-y-2">
          {currentUser ? (
            <div className="space-y-2">
              {!currentUser.isPremium && (
                <Link
                  href="/register?plan=pro"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-primary w-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  Upgrade to Pro • ₹499
                </Link>
              )}
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-[#24314f] hover:border-[#7c3aed] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#f8fafc] truncate">{currentUser.name}</p>
                  <p className="text-xs text-[#6b7fa3] truncate">{currentUser.email}</p>
                </div>
                {currentUser.isPremium && (
                  <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                )}
              </Link>
              <button
                onClick={handleSignOut}
                className="btn btn-secondary w-full"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/register?plan=pro"
                className="btn btn-primary w-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20"
                onClick={() => setMobileOpen(false)}
              >
                Join Savzen Pro • ₹499
              </Link>
              <Link
                href="/login"
                className="btn btn-secondary w-full"
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <SearchModal onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}

function SearchModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl glass-dark rounded-2xl border border-[#24314f] shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4">
          <Search className="w-5 h-5 text-[#6b7fa3] shrink-0" />
          <input
            autoFocus
            type="search"
            placeholder="Search AI tools, news, tutorials…"
            className="flex-1 bg-transparent outline-none text-[#f8fafc] placeholder:text-[#6b7fa3] text-base"
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter") {
                const q = (e.target as HTMLInputElement).value.trim();
                if (q) {
                  window.location.href = `/search?q=${encodeURIComponent(q)}`;
                }
              }
            }}
          />
          <button onClick={onClose} className="p-1.5 text-[#a7b2cc] hover:text-[#f8fafc] rounded-md hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 pb-4">
          <p className="text-xs text-[#6b7fa3]">
            Press <kbd className="px-1.5 py-0.5 rounded bg-[#24314f] text-[#a7b2cc] font-mono text-xs">Enter</kbd> to search • <kbd className="px-1.5 py-0.5 rounded bg-[#24314f] text-[#a7b2cc] font-mono text-xs">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
