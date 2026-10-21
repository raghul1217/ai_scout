import Link from "next/link";
import { Zap, MessageCircle, Mail, ExternalLink } from "lucide-react";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const footerLinks = {
  Platform: [
    { label: "Home", href: "/" },
    { label: "AI News", href: "/news" },
    { label: "AI Tools", href: "/tools" },
    { label: "Learn AI", href: "/learn" },
    { label: "Community", href: "/community" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About AI Scout", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  Community: [
    { label: "WhatsApp Community", href: process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ?? "/community", external: true },
    { label: "Join as a Creator", href: "/contact" },
    { label: "Partner with Us", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: TwitterIcon, label: "Twitter", href: process.env.NEXT_PUBLIC_TWITTER_URL ?? "#" },
  { icon: LinkedinIcon, label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "#" },
  { icon: GithubIcon, label: "GitHub", href: process.env.NEXT_PUBLIC_GITHUB_URL ?? "#" },
  { icon: MessageCircle, label: "WhatsApp", href: process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ?? "#" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#24314f] bg-[#050816]">
      {/* Top Section */}
      <div className="container-max py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-[#f8fafc]">AI</span>
                <span className="gradient-text"> Scout</span>
              </span>
            </Link>

            <p className="text-[#a7b2cc] text-sm leading-relaxed max-w-xs">
              Your all-in-one AI discovery and learning platform. Stay ahead with curated tools, 
              latest AI news, and practical tutorials.
            </p>

            <div className="flex items-center gap-1 text-sm text-[#a7b2cc]">
              <Mail className="w-4 h-4 shrink-0" />
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@aiscout.in"}`}
                className="hover:text-[#f8fafc] transition-colors"
              >
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@aiscout.in"}
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-[#24314f] flex items-center justify-center text-[#6b7fa3] hover:text-[#f8fafc] hover:border-[#7c3aed] hover:bg-purple-500/10 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-[#6b7fa3] uppercase tracking-widest mb-4">
                {section}
              </h3>
              <ul className="space-y-2.5" role="list">
                {links.map((link) => (
                  <li key={`${section}-${link.label}`}>
                    <Link
                      href={link.href}
                      target={"external" in link && link.external ? "_blank" : undefined}
                      rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-[#a7b2cc] hover:text-[#f8fafc] transition-colors flex items-center gap-1.5 group"
                    >
                      {link.label}
                      {"external" in link && link.external && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#24314f]/50">
        <div className="container-max py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6b7fa3]">
          <p>© {year} AI Scout. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#a7b2cc] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#a7b2cc] transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-[#a7b2cc] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
