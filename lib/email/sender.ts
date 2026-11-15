/**
 * Savzyen Unified Email Dispatcher (Resend REST API)
 *
 * Communicates directly with https://api.resend.com/emails via native fetch.
 * Zero npm dependency overhead, no serverless socket timeouts.
 */

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = process.env.EMAIL_FROM || "Savzyen <support@savzyen.si>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "support@savzyen.si";

/**
 * Core primitive to send an email via Resend REST API
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  // 1. Simulation / Dev Fallback if RESEND_API_KEY is not yet added to .env
  if (!apiKey) {
    console.log("--------------------------------------------------");
    console.log("[Resend Email Simulator - RESEND_API_KEY not set]");
    console.log(`To:      ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`Subject: ${subject}`);
    console.log(`From:    ${DEFAULT_FROM}`);
    if (replyTo) console.log(`Reply-To: ${replyTo}`);
    console.log("--------------------------------------------------");
    return { success: true, simulated: true };
  }

  // 2. Live dispatch via Resend REST API
  try {
    const recipients = Array.isArray(to) ? to : [to];

    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: DEFAULT_FROM,
        to: recipients,
        subject,
        html,
        reply_to: replyTo,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data?.message || `Resend API error status ${res.status}`;
      console.error("[Resend API Error]:", errorMsg, data);
      return { success: false, error: errorMsg };
    }

    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error("[Resend Network Exception]:", err);
    return { success: false, error: err?.message || "Failed to dispatch email" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SPECIFIC ENQUIRY & COLLAB WORKFLOWS
// ─────────────────────────────────────────────────────────────────────────────

export interface ContactEnquiryData {
  name: string;
  email: string;
  company?: string;
  message: string;
  type: string;
}

export interface CollabProposalData {
  name: string;
  email: string;
  organization: string;
  category: string;
  role: string;
  phone?: string;
  studentCount?: string;
  interests: string[];
  message: string;
}

/**
 * Dispatches both Admin Notification and User Confirmation for Contact Page Enquiries
 */
export async function sendContactEnquiryEmails(data: ContactEnquiryData) {
  const formattedDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const typeLabels: Record<string, string> = {
    GENERAL: "General Inquiry",
    PARTNERSHIP: "Partnership & Collaboration",
    TEAM_ENQUIRY: "Team Training / Upskilling",
  };
  const readableType = typeLabels[data.type] || data.type;

  // 1. Admin Alert Email HTML
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #050816; color: #f8fafc; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background: #0D1730; border: 1px solid #24314F; border-radius: 16px; padding: 32px; }
          .badge { display: inline-block; padding: 4px 12px; background: rgba(124, 58, 237, 0.2); border: 1px solid #7C3AED; color: #C4B5FD; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 16px; }
          h2 { margin: 0 0 16px 0; color: #ffffff; font-size: 22px; font-weight: 800; }
          .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .info-table td { padding: 10px 12px; border-bottom: 1px solid #1E293B; font-size: 13px; }
          .info-table td.label { color: #A7B2CC; width: 30%; font-weight: 600; }
          .info-table td.value { color: #FFFFFF; }
          .message-box { background: #050816; border: 1px solid #24314F; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; color: #E2E8F0; margin-top: 16px; white-space: pre-wrap; }
          .footer { margin-top: 24px; font-size: 11px; color: #6B7FA3; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">New Contact Enquiry</div>
          <h2>${readableType}</h2>
          <table class="info-table">
            <tr><td class="label">From</td><td class="value"><strong>${data.name}</strong> (${data.email})</td></tr>
            ${data.company ? `<tr><td class="label">Organization</td><td class="value">${data.company}</td></tr>` : ""}
            <tr><td class="label">Type</td><td class="value">${readableType}</td></tr>
            <tr><td class="label">Received</td><td class="value">${formattedDate} (IST)</td></tr>
          </table>
          <div style="font-size: 12px; color: #A7B2CC; font-weight: bold; margin-top: 20px;">Message:</div>
          <div class="message-box">${data.message}</div>
          <div class="footer">
            Sent via Savzyen Contact Portal • Reply directly to this email to respond to ${data.name}.
          </div>
        </div>
      </body>
    </html>
  `;

  // 2. User Auto-responder Email HTML
  const userHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #050816; color: #f8fafc; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background: #0D1730; border: 1px solid #24314F; border-radius: 16px; padding: 32px; }
          .logo { font-size: 20px; font-weight: 900; color: #ffffff; margin-bottom: 24px; }
          .logo span { background: linear-gradient(135deg, #7C3AED, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          h2 { margin: 0 0 16px 0; color: #ffffff; font-size: 20px; font-weight: 700; }
          p { font-size: 14px; line-height: 1.6; color: #A7B2CC; margin: 0 0 16px 0; }
          .highlight { background: #050816; border-left: 3px solid #7C3AED; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #E2E8F0; margin: 20px 0; }
          .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #1E293B; font-size: 12px; color: #6B7FA3; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">Sav<span>zyen</span></div>
          <h2>Thank you for reaching out, ${data.name}!</h2>
          <p>We have successfully received your enquiry regarding <strong>${readableType}</strong>.</p>
          <p>Our team reviews all submissions and will get back to you within 24 hours.</p>
          <div class="highlight">
            <strong>Your Message:</strong><br/>
            ${data.message.length > 200 ? data.message.slice(0, 200) + "…" : data.message}
          </div>
          <p>If you have urgent questions, you can also reach us directly at <a href="mailto:support@savzyen.si" style="color: #60A5FA; text-decoration: none;">support@savzyen.si</a>.</p>
          <div class="footer">
            © ${new Date().getFullYear()} Savzyen • Become the Top 1% in the AI Era.
          </div>
        </div>
      </body>
    </html>
  `;

  // Dispatch both in parallel
  const [adminResult, userResult] = await Promise.allSettled([
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `[Savzyen Inquiry] ${readableType} from ${data.name}`,
      html: adminHtml,
      replyTo: data.email,
    }),
    sendEmail({
      to: data.email,
      subject: `We've received your message | Savzyen`,
      html: userHtml,
    }),
  ]);

  return { adminResult, userResult };
}

/**
 * Dispatches both Admin Notification and Partner Confirmation for /collab Proposals
 */
export async function sendCollabProposalEmails(data: CollabProposalData) {
  const formattedDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #050816; color: #f8fafc; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background: #0D1730; border: 1px solid #10B981; border-radius: 16px; padding: 32px; }
          .badge { display: inline-block; padding: 4px 12px; background: rgba(16, 185, 129, 0.2); border: 1px solid #10B981; color: #6EE7B7; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 16px; }
          h2 { margin: 0 0 16px 0; color: #ffffff; font-size: 22px; font-weight: 800; }
          .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .info-table td { padding: 10px 12px; border-bottom: 1px solid #1E293B; font-size: 13px; }
          .info-table td.label { color: #A7B2CC; width: 35%; font-weight: 600; }
          .info-table td.value { color: #FFFFFF; }
          .tag { display: inline-block; background: #112040; border: 1px solid #24314F; color: #60A5FA; padding: 2px 8px; border-radius: 6px; font-size: 11px; margin-right: 4px; margin-bottom: 4px; }
          .message-box { background: #050816; border: 1px solid #24314F; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; color: #E2E8F0; margin-top: 16px; white-space: pre-wrap; }
          .footer { margin-top: 24px; font-size: 11px; color: #6B7FA3; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">New Collaboration Proposal</div>
          <h2>${data.organization} (${data.category})</h2>
          <table class="info-table">
            <tr><td class="label">Lead Contact</td><td class="value"><strong>${data.name}</strong> (${data.email})</td></tr>
            <tr><td class="label">Designation / Role</td><td class="value">${data.role}</td></tr>
            <tr><td class="label">Category</td><td class="value">${data.category}</td></tr>
            ${data.phone ? `<tr><td class="label">Phone</td><td class="value">${data.phone}</td></tr>` : ""}
            ${data.studentCount ? `<tr><td class="label">Team / Student Size</td><td class="value">${data.studentCount}</td></tr>` : ""}
            <tr><td class="label">Submitted</td><td class="value">${formattedDate} (IST)</td></tr>
          </table>
          <div style="font-size: 12px; color: #A7B2CC; font-weight: bold; margin-top: 16px;">Selected Interest Tracks:</div>
          <div style="margin-top: 8px;">
            ${data.interests.map((t) => `<span class="tag">${t}</span>`).join("")}
          </div>
          <div style="font-size: 12px; color: #A7B2CC; font-weight: bold; margin-top: 20px;">Collaboration Proposal:</div>
          <div class="message-box">${data.message}</div>
          <div class="footer">
            Savzyen Partnerships Team • Reply to this email to connect directly with ${data.name}.
          </div>
        </div>
      </body>
    </html>
  `;

  const partnerHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #050816; color: #f8fafc; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background: #0D1730; border: 1px solid #24314F; border-radius: 16px; padding: 32px; }
          .logo { font-size: 20px; font-weight: 900; color: #ffffff; margin-bottom: 24px; }
          .logo span { background: linear-gradient(135deg, #10B981, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          h2 { margin: 0 0 16px 0; color: #ffffff; font-size: 20px; font-weight: 700; }
          p { font-size: 14px; line-height: 1.6; color: #A7B2CC; margin: 0 0 16px 0; }
          .highlight { background: #050816; border-left: 3px solid #10B981; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #E2E8F0; margin: 20px 0; }
          .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #1E293B; font-size: 12px; color: #6B7FA3; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">Sav<span>zyen</span> Partnerships</div>
          <h2>Collaboration Proposal Received: ${data.organization}</h2>
          <p>Dear ${data.name},</p>
          <p>Thank you for initiating a collaboration with Savzyen. We are excited about the potential to build the AI frontier together with your institution.</p>
          <p>Our academic & industry partnerships team has received your submission and will review your selected tracks: <strong>${data.interests.join(", ")}</strong>.</p>
          <div class="highlight">
            <strong>What happens next?</strong><br/>
            Our team will benchmark your requirements and schedule an introductory coordination call within 2 business days.
          </div>
          <p>For urgent questions or scheduling requests, feel free to reply directly to <a href="mailto:support@savzyen.si" style="color: #10B981; text-decoration: none;">support@savzyen.si</a>.</p>
          <div class="footer">
            © ${new Date().getFullYear()} Savzyen • Become the Top 1% in the AI Era.
          </div>
        </div>
      </body>
    </html>
  `;

  const [adminResult, partnerResult] = await Promise.allSettled([
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `[Savzyen Collab Proposal] ${data.organization} (${data.category})`,
      html: adminHtml,
      replyTo: data.email,
    }),
    sendEmail({
      to: data.email,
      subject: `Collaboration Proposal Received | Savzyen & ${data.organization}`,
      html: partnerHtml,
    }),
  ]);

  return { adminResult, partnerResult };
}

// ─────────────────────────────────────────────────────────────────────────────
// UPI PAYMENT & PRO MEMBERSHIP ACTIVATION EMAILS
// ─────────────────────────────────────────────────────────────────────────────

export interface PaymentProofEmailData {
  userName: string;
  userEmail: string;
  userPhone?: string;
  utrNumber: string;
  amount: number; // e.g. 499
  screenshotUrl?: string;
}

export interface PremiumActivatedEmailData {
  userName: string;
  userEmail: string;
  planName?: string;
  amount?: number;
  paymentId?: string;
  endDate: Date | string | null;
}

/**
 * Dispatches Admin Alert and User Acknowledgment when UPI proof is submitted
 */
export async function sendPaymentProofSubmittedEmails(data: PaymentProofEmailData) {
  const formattedDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://savzyen.si";

  // 1. Admin Alert Email HTML
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #050816; color: #f8fafc; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background: #0D1730; border: 1px solid #7C3AED; border-radius: 16px; padding: 32px; }
          .badge { display: inline-block; padding: 4px 12px; background: rgba(124, 58, 237, 0.2); border: 1px solid #7C3AED; color: #C4B5FD; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 16px; }
          h2 { margin: 0 0 16px 0; color: #ffffff; font-size: 22px; font-weight: 800; }
          .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .info-table td { padding: 10px 12px; border-bottom: 1px solid #1E293B; font-size: 13px; }
          .info-table td.label { color: #A7B2CC; width: 35%; font-weight: 600; }
          .info-table td.value { color: #FFFFFF; font-weight: 700; }
          .utr-box { background: #050816; border: 1px solid #7C3AED; border-radius: 10px; padding: 14px; font-size: 16px; font-family: monospace; color: #60A5FA; font-weight: bold; margin-top: 10px; text-align: center; }
          .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #7C3AED, #3B82F6); color: #ffffff; font-weight: bold; text-decoration: none; border-radius: 10px; font-size: 13px; margin-top: 20px; text-align: center; }
          .footer { margin-top: 24px; font-size: 11px; color: #6B7FA3; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">UPI Payment Action Required</div>
          <h2>New ₹${data.amount} Payment Submitted</h2>
          <table class="info-table">
            <tr><td class="label">User Name</td><td class="value">${data.userName}</td></tr>
            <tr><td class="label">User Email</td><td class="value">${data.userEmail}</td></tr>
            ${data.userPhone ? `<tr><td class="label">Mobile Number</td><td class="value">${data.userPhone}</td></tr>` : ""}
            <tr><td class="label">Plan</td><td class="value">SAVZYEN Premium (Annual)</td></tr>
            <tr><td class="label">Amount Due</td><td class="value">₹${data.amount}.00</td></tr>
            <tr><td class="label">Submitted</td><td class="value">${formattedDate} (IST)</td></tr>
          </table>

          <div style="font-size: 12px; color: #A7B2CC; font-weight: bold; margin-top: 14px;">12-Digit UTR / Transaction Reference:</div>
          <div class="utr-box">${data.utrNumber}</div>

          ${data.screenshotUrl ? `<p style="font-size: 12px; color: #60A5FA; margin-top: 12px;">Payment screenshot attached in system.</p>` : ""}

          <div style="text-align: center;">
            <a href="${appUrl}/admin/payments" class="btn">Open Admin Verification Queue</a>
          </div>

          <div class="footer">
            Savzyen Payment Operations • Verify against bank/UPI app then approve in admin panel.
          </div>
        </div>
      </body>
    </html>
  `;

  // 2. User Acknowledgment Email HTML
  const userHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #050816; color: #f8fafc; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background: #0D1730; border: 1px solid #24314F; border-radius: 16px; padding: 32px; }
          .logo { font-size: 20px; font-weight: 900; color: #ffffff; margin-bottom: 24px; }
          .logo span { background: linear-gradient(135deg, #7C3AED, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          h2 { margin: 0 0 16px 0; color: #ffffff; font-size: 20px; font-weight: 700; }
          p { font-size: 14px; line-height: 1.6; color: #A7B2CC; margin: 0 0 16px 0; }
          .highlight { background: #050816; border-left: 3px solid #7C3AED; padding: 14px 16px; border-radius: 4px; font-size: 13px; color: #E2E8F0; margin: 20px 0; }
          .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #1E293B; font-size: 12px; color: #6B7FA3; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">Sav<span>zyen</span></div>
          <h2>Payment Proof Received, ${data.userName}!</h2>
          <p>Thank you for subscribing to <strong>SAVZYEN Premium (₹${data.amount}/year)</strong>.</p>
          <div class="highlight">
            <strong>Transaction Details:</strong><br/>
            • <strong>UTR / Reference ID:</strong> ${data.utrNumber}<br/>
            • <strong>Amount:</strong> ₹${data.amount}.00<br/>
            • <strong>Status:</strong> Verification in Progress
          </div>
          <p>Our team is verifying your payment. Once approved, your account will be upgraded to Pro automatically, and you will receive an activation email.</p>
          <p>If you have any questions or need immediate assistance, simply reply directly to this email or reach us at <a href="mailto:support@savzyen.si" style="color: #60A5FA; text-decoration: none;">support@savzyen.si</a>.</p>
          <div class="footer">
            © ${new Date().getFullYear()} Savzyen • Become the Top 1% in the AI Era.
          </div>
        </div>
      </body>
    </html>
  `;

  const [adminResult, userResult] = await Promise.allSettled([
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `[Action Required] New ₹${data.amount} UPI Payment from ${data.userName} (UTR: ${data.utrNumber})`,
      html: adminHtml,
      replyTo: data.userEmail,
    }),
    sendEmail({
      to: data.userEmail,
      subject: `Payment Proof Received | Savzyen Pro Under Review`,
      html: userHtml,
    }),
  ]);

  return { adminResult, userResult };
}

/**
 * Dispatches Official Payment Confirmation & Membership Activation Email
 * Mobile-First, bulletproof HTML email with 100% inline styles for flawless Gmail & Outlook rendering.
 */
export async function sendPremiumActivatedEmail(data: PremiumActivatedEmailData) {
  const formattedEndDate = data.endDate
    ? new Date(data.endDate).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "1 Year";

  // Use live domain for emails so mobile users can click directly
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_APP_URL
      : "https://savzyen.si";
  const displayUrl = appUrl.replace(/^https?:\/\//, "");
  const amountPaid = data.amount ? `₹${data.amount}` : "₹499";
  const paymentId = data.paymentId || `SAV-${Date.now().toString(36).toUpperCase()}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SAVZYEN Premium Membership Confirmation</title>
      </head>
      <body style="margin: 0; padding: 12px 6px; background-color: #050816; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        <!-- Main Container Table -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; max-width: 560px; margin: 0 auto; background-color: #0D1730; border: 1px solid #24314F; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 24px 18px; color: #F8FAFC;">
              
              <!-- Brand Header -->
              <div style="font-size: 20px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px; margin-bottom: 16px;">
                SAV<span style="color: #60A5FA;">ZYEN</span>
              </div>

              <!-- Greeting & Welcome -->
              <p style="font-size: 15px; color: #FFFFFF; font-weight: 600; margin: 0 0 6px 0;">
                Hi ${data.userName},
              </p>
              <h1 style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin: 0 0 14px 0; line-height: 1.3;">
                Welcome to SAVZYEN!
              </h1>

              <p style="font-size: 14px; line-height: 1.5; color: #E2E8F0; margin: 0 0 10px 0;">
                Your payment has been successfully received, and your Premium Membership is now <strong>ACTIVE</strong>!
              </p>
              <p style="font-size: 13px; line-height: 1.5; color: #A7B2CC; margin: 0 0 20px 0;">
                You're officially part of a community that believes in staying ahead of the future.
              </p>

              <!-- Features Section -->
              <div style="font-size: 12px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 10px 0;">
                Here's what you can explore with SAVZYEN Premium:
              </div>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; background-color: #050816; border: 1px solid #1E293B; border-radius: 8px; margin: 0 0 20px 0;">
                <tr>
                  <td style="padding: 14px 14px; font-size: 13px; line-height: 1.8; color: #E2E8F0;">
                    <div style="margin: 2px 0;">&#8226; &nbsp;Daily AI News &amp; Industry Updates</div>
                    <div style="margin: 2px 0;">&#8226; &nbsp;Latest AI Tools &amp; Features</div>
                    <div style="margin: 2px 0;">&#8226; &nbsp;AI Tutorials &amp; Learning Resources</div>
                    <div style="margin: 2px 0;">&#8226; &nbsp;Industry Trends &amp; Weekly Reports</div>
                    <div style="margin: 2px 0;">&#8226; &nbsp;Tech Events, Meetups &amp; Conferences</div>
                    <div style="margin: 2px 0;">&#8226; &nbsp;Exclusive Live Sessions &amp; Expert Insights</div>
                    <div style="margin: 2px 0;">&#8226; &nbsp;Exclusive Learning Opportunities</div>
                  </td>
                </tr>
              </table>

              <!-- Membership Details Section -->
              <div style="font-size: 12px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 10px 0;">
                Your Membership Details
              </div>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; background-color: #050816; border: 1px solid #1E293B; border-radius: 8px; border-collapse: collapse; margin: 0 0 22px 0;">
                <tr>
                  <td style="padding: 10px 12px; font-size: 13px; color: #94A3B8; border-bottom: 1px solid #1E293B; width: 38%; white-space: nowrap;">Name</td>
                  <td style="padding: 10px 12px; font-size: 13px; color: #FFFFFF; font-weight: 600; border-bottom: 1px solid #1E293B; word-break: break-word;">${data.userName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; font-size: 13px; color: #94A3B8; border-bottom: 1px solid #1E293B; white-space: nowrap;">Email</td>
                  <td style="padding: 10px 12px; font-size: 13px; color: #FFFFFF; font-weight: 600; border-bottom: 1px solid #1E293B; word-break: break-all;">${data.userEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; font-size: 13px; color: #94A3B8; border-bottom: 1px solid #1E293B; white-space: nowrap;">Amount Paid</td>
                  <td style="padding: 10px 12px; font-size: 13px; color: #FFFFFF; font-weight: 600; border-bottom: 1px solid #1E293B;">${amountPaid}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; font-size: 13px; color: #94A3B8; border-bottom: 1px solid #1E293B; white-space: nowrap;">Membership</td>
                  <td style="padding: 10px 12px; font-size: 13px; color: #FFFFFF; font-weight: 600; border-bottom: 1px solid #1E293B;">${data.planName || "Premium – 1 Year"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; font-size: 13px; color: #94A3B8; border-bottom: 1px solid #1E293B; white-space: nowrap;">Payment ID</td>
                  <td style="padding: 10px 12px; font-size: 13px; color: #60A5FA; font-weight: 600; font-family: monospace; border-bottom: 1px solid #1E293B; word-break: break-all;">${paymentId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; font-size: 13px; color: #94A3B8; border-bottom: 1px solid #1E293B; white-space: nowrap;">Valid Until</td>
                  <td style="padding: 10px 12px; font-size: 13px; color: #FFFFFF; font-weight: 600; border-bottom: 1px solid #1E293B;">${formattedEndDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; font-size: 13px; color: #94A3B8; white-space: nowrap;">Status</td>
                  <td style="padding: 10px 12px; font-size: 12px; color: #34D399; font-weight: 700;">ACTIVE</td>
                </tr>
              </table>

              <!-- Access Call To Action -->
              <div style="text-align: center; margin: 24px 0 22px 0;">
                <p style="font-size: 13px; color: #CBD5E1; font-weight: 600; margin: 0 0 10px 0;">
                  Access Your Premium Membership:
                </p>
                <a href="${appUrl}" target="_blank" style="display: inline-block; background-color: #2563EB; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
                  Access SAVZYEN Premium
                </a>
                <p style="font-size: 12px; margin: 10px 0 0 0; word-break: break-all;">
                  <a href="${appUrl}" target="_blank" style="color: #60A5FA; text-decoration: underline;">
                    ${appUrl}
                  </a>
                </p>
              </div>

              <!-- Closing -->
              <div style="border-top: 1px solid #1E293B; padding-top: 18px; margin-top: 20px;">
                <p style="font-size: 13px; line-height: 1.5; color: #A7B2CC; margin: 0 0 10px 0;">
                  Thank you for choosing SAVZYEN. We're excited to be part of your learning journey.
                </p>
                <p style="font-size: 13px; line-height: 1.5; color: #FFFFFF; font-weight: 600; margin: 0 0 18px 0;">
                  Stay curious. Stay ahead. Shape the future.
                </p>
                <div style="font-size: 13px; color: #A7B2CC; line-height: 1.5;">
                  Best Regards,<br/>
                  <strong style="color: #FFFFFF;">Team SAVZYEN</strong><br/>
                  <a href="${appUrl}" target="_blank" style="color: #60A5FA; text-decoration: none;">${displayUrl}</a>
                </div>
              </div>

              <!-- Footer Tagline -->
              <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #1E293B; font-size: 11px; color: #6B7FA3; text-align: center;">
                &copy; ${new Date().getFullYear()} SAVZYEN &bull; Become the Top 1% in the AI Era.
              </div>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return await sendEmail({
    to: data.userEmail,
    subject: `Payment Successful — Welcome to SAVZYEN Premium!`,
    html: emailHtml,
  });
}


