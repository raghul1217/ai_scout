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
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

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
            aria-label="AI Scout Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-[#f8fafc]">AI</span>
              <span className="gradient-text"> Scout</span>
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
              className="btn btn-ghost btn-sm p-2"
              aria-label="Search"
              id="nav-search-btn"
            >
              <Search className="w-4 h-4" />
            </button>

            {user ? (
              /* User Menu */
              <div className="relative">
                <button
                  id="nav-user-menu-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 btn btn-ghost btn-sm"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-[#f8fafc] max-w-[100px] truncate">
                    {user.name}
                  </span>
                  {user.isPremium && (
                    <Crown className="w-3.5 h-3.5 text-yellow-400" />
                  )}
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-[#6b7fa3] transition-transform",
                      userMenuOpen && "rotate-180"
                    )}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-xl border border-[#24314f] shadow-xl py-1 animate-fade-in">
                    <div className="px-3 py-2 border-b border-[#24314f]/60">
                      <p className="text-xs text-[#6b7fa3]">Signed in as</p>
                      <p className="text-sm font-medium text-[#f8fafc] truncate">{user.email}</p>
                      {user.isPremium && (
                        <span className="badge badge-yellow mt-1">
                          <Crown className="w-2.5 h-2.5" />
                          Premium
                        </span>
                      )}
                    </div>
                    <Link href="/account" className="flex items-center gap-2 px-3 py-2 text-sm text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors">
                      <User className="w-4 h-4" /> My Account
                    </Link>
                    {user.isPremium && (
                      <Link href="/premium" className="flex items-center gap-2 px-3 py-2 text-sm text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors">
                        <Crown className="w-4 h-4" /> Premium Resources
                      </Link>
                    )}
                    {user.role === "ADMIN" && (
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-[#24314f]/60 mt-1 pt-1">
                      <form action="/api/auth/sign-out" method="POST">
                        <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#ef4444] hover:bg-red-500/10 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Login
                </Link>
                <Link
                  href="/community"
                  id="nav-join-community-btn"
                  className="btn btn-primary btn-sm"
                >
                  Join Community
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden btn btn-ghost p-2"
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
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-72 glass-dark border-l border-[#24314f] md:hidden transition-transform duration-300 flex flex-col",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#24314f]">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-bold">
              <span className="text-[#f8fafc]">AI</span>
              <span className="gradient-text"> Scout</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="btn btn-ghost p-2"
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
          </ul>

          {user && (
            <div className="mt-4 pt-4 border-t border-[#24314f] space-y-1">
              <Link href="/account" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors">
                <User className="w-4 h-4" /> My Account
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#a7b2cc] hover:text-[#f8fafc] hover:bg-white/5 transition-colors">
                  <Settings className="w-4 h-4" /> Admin Dashboard
                </Link>
              )}
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-[#24314f] space-y-2">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#f8fafc] truncate">{user.name}</p>
                  <p className="text-xs text-[#6b7fa3] truncate">{user.email}</p>
                </div>
              </div>
              <form action="/api/auth/sign-out" method="POST">
                <button type="submit" className="btn btn-secondary w-full">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary w-full" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link href="/community" className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>
                Join Community
              </Link>
            </>
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
          <button onClick={onClose} className="btn btn-ghost p-1">
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
