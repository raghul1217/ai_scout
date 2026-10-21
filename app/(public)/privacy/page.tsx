import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AI Scout Privacy Policy — how we collect, use, and protect your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container-max">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-[#f8fafc] mb-3">Privacy Policy</h1>
          <p className="text-sm text-[#6b7fa3] mb-10">Last updated: October 2026</p>
          <div className="prose-dark space-y-8">
            <section>
              <h2>1. Information We Collect</h2>
              <p>We collect information you provide directly, such as your name, email address, and payment information when you register or purchase a premium subscription. We also collect usage data to improve the platform.</p>
            </section>
            <section>
              <h2>2. How We Use Your Information</h2>
              <p>We use your information to provide and improve our services, process payments, send transactional notifications, and communicate with you. We do not sell your personal data to third parties.</p>
            </section>
            <section>
              <h2>3. Data Security</h2>
              <p>We implement industry-standard security measures including encrypted storage, secure HTTPS transmission, and access controls. Passwords are stored as secure hashes and are never accessible to us.</p>
            </section>
            <section>
              <h2>4. Payment Information</h2>
              <p>Payment processing is handled by Razorpay. We do not store card numbers or sensitive payment credentials on our servers. Please review Razorpay&apos;s privacy policy for details on payment data handling.</p>
            </section>
            <section>
              <h2>5. Cookies</h2>
              <p>We use secure, HTTP-only session cookies for authentication. We do not use tracking cookies or third-party advertising cookies.</p>
            </section>
            <section>
              <h2>6. Your Rights</h2>
              <p>You may request access to, correction of, or deletion of your personal data by contacting us at the address below. We will respond within 30 days.</p>
            </section>
            <section>
              <h2>7. Contact</h2>
              <p>For privacy-related enquiries, contact us at <a href="mailto:privacy@aiscout.in">privacy@aiscout.in</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
