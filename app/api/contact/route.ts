import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { sendContactEnquiryEmails } from "@/lib/email/sender";

export const dynamic = "force-dynamic";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Valid email address is required"),
  company: z.string().max(200).optional(),
  message: z.string().min(3, "Message must be at least 3 characters").max(2000),
  type: z.enum(["TEAM_ENQUIRY", "GENERAL", "PARTNERSHIP"]).default("GENERAL"),
});

export async function POST(req: NextRequest) {
  try {
    // Request size limit (10KB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 10_000) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const body = await req.json();
    const result = enquirySchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues[0]?.message || "Invalid data";
      return NextResponse.json(
        { error: errorMsg, issues: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, company, message, type } = result.data;

    // 1. Persist to Database if available (wrapped in try/catch for robust offline dev support)
    try {
      await prisma.contactEnquiry.create({
        data: {
          name,
          email,
          company: company || null,
          enquiryType: type.toLowerCase(),
          message,
          status: "NEW",
        },
      });
    } catch (dbErr) {
      console.warn("[Contact API DB Notice]: Could not save to DB (offline fallback active):", dbErr);
    }

    console.log("[Contact Enquiry Received]", {
      name,
      email,
      company,
      type,
      timestamp: new Date().toISOString(),
    });

    // 2. Dispatch Live Emails via Resend (Admin Notification + User Auto-reply)
    try {
      await sendContactEnquiryEmails({
        name,
        email,
        company,
        message,
        type,
      });
    } catch (emailErr) {
      console.error("[Contact Email Dispatch Error]:", emailErr);
      // We don't fail the user request if email provider encounters an error
    }

    return NextResponse.json(
      { success: true, message: "Enquiry submitted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Contact API Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
