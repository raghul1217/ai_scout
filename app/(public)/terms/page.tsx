import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AI Scout Terms of Service — the rules and agreements for using our platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container-max">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-[#f8fafc] mb-3">Terms of Service</h1>
          <p className="text-sm text-[#6b7fa3] mb-10">Last updated: October 2026</p>
          <div className="prose-dark space-y-8">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing or using AI Scout, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
            </section>
            <section>
              <h2>2. Use of the Platform</h2>
              <p>AI Scout grants you a limited, non-exclusive, non-transferable license to access and use the platform for personal, non-commercial purposes. You must not misuse the platform, circumvent security measures, or use it for unlawful purposes.</p>
            </section>
            <section>
              <h2>3. Premium Membership</h2>
              <p>Premium membership provides access to exclusive content and features. The billing period and price are as specified at the time of purchase. Refunds are handled on a case-by-case basis — contact support within 7 days of purchase.</p>
            </section>
            <section>
              <h2>4. Content</h2>
              <p>All content on AI Scout is for informational purposes. We make reasonable efforts to ensure accuracy but do not guarantee it. External tool links are provided for convenience — we are not responsible for third-party content or services.</p>
            </section>
            <section>
              <h2>5. Accounts</h2>
              <p>You are responsible for maintaining the security of your account and for all activities under your account. Notify us immediately of any unauthorized access.</p>
            </section>
            <section>
              <h2>6. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, AI Scout is not liable for indirect, incidental, or consequential damages arising from use of the platform.</p>
            </section>
            <section>
              <h2>7. Changes to Terms</h2>
              <p>We may update these terms and will notify registered users of material changes. Continued use of the platform after changes constitutes acceptance.</p>
            </section>
            <section>
              <h2>8. Contact</h2>
              <p>For questions about these terms, contact <a href="mailto:legal@aiscout.in">legal@aiscout.in</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
