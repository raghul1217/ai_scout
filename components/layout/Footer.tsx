import Link from "next/link";
import { Zap, Mail, ExternalLink, MapPin, Phone } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Home", href: "/" },
    { label: "AI News", href: "/news" },
    { label: "AI Tools", href: "/tools" },
    { label: "Learn AI", href: "/learn" },
    { label: "Community", href: "/community" },
    { label: "Collab", href: "/collab" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About Savzyen", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  Community: [
    { label: "Join Community", href: "/register" },
    { label: "Community Hub", href: "/community" },
    ...(process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL
      ? [{ label: "WhatsApp Community", href: process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL, external: true }]
      : []),
    { label: "Partner with Us", href: "/collab" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#24314f] bg-[#050816]">
      {/* Top Section */}
      <div className="container-max pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Address Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-[#f8fafc]">Sav</span>
                <span className="gradient-text">zyen</span>
              </span>
            </Link>

            <div className="space-y-3 pt-1">
              <h3 className="text-xs font-semibold text-[#6b7fa3] uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Get in Touch</span>
              </h3>

              <div className="text-xs text-[#a7b2cc] space-y-1 leading-relaxed">
                <p className="font-bold text-white text-sm">Savzyen</p>
                <p>[Ground Floor, WeWork], Vaishnavi Signature</p>
                <p>No. 78/9, Outer Ring Road, Bellandur</p>
                <p>Bengaluru, Karnataka – 560103, India</p>
                <p className="text-[#6b7fa3] text-[11px]">(Landmark: Beside Centro Mall)</p>
              </div>

              <div className="pt-2 text-xs text-[#a7b2cc] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <a href="tel:+918660768366" className="hover:text-white transition-colors">
                    +91 8660768366
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
                  <a
                    href="mailto:support@savzyen.si"
                    className="hover:text-white transition-colors"
                  >
                    support@savzyen.si
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Columns: Platform, Company, Community */}
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
                      className="text-xs sm:text-sm text-[#a7b2cc] hover:text-[#f8fafc] transition-colors flex items-center gap-1.5 group"
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
          <p>© {year} Savzyen. All rights reserved.</p>
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
