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
            © ${new Date().getFullYear()} Savzyen. Discover, Learn & Build with Modern AI.
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
            © ${new Date().getFullYear()} Savzyen. Building the Future of Applied AI.
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

