import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

const collabSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid institutional or work email is required"),
  organization: z.string().min(2, "Organization or institution name is required").max(200),
  category: z.enum(["COLLEGE", "SCHOOL", "COMPANY", "INDIVIDUAL", "COMMUNITY"]).default("COLLEGE"),
  role: z.string().min(2, "Role or designation is required").max(100),
  phone: z.string().max(30).optional(),
  studentCount: z.string().max(50).optional(),
  interests: z.array(z.string()).min(1, "Select at least one collaboration interest"),
  message: z.string().min(10, "Please share some details about your collaboration goals").max(3000),
});

export async function POST(req: NextRequest) {
  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 20_000) {
      return NextResponse.json({ error: "Request payload too large" }, { status: 413 });
    }

    const body = await req.json();
    const result = collabSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        { error: errorMsg, issues: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;

    // Persist into database if available
    try {
      await prisma.contactEnquiry.create({
        data: {
          name: data.name,
          email: data.email,
          company: `${data.organization} [${data.category}]`,
          teamSize: data.studentCount || "N/A",
          enquiryType: "partnership",
          message: `[Category: ${data.category}]\n[Role: ${data.role}]\n[Phone: ${data.phone || "N/A"}]\n[Interests: ${data.interests.join(", ")}]\n\nProposal:\n${data.message}`,
        },
      });
    } catch (dbErr) {
      console.warn("[Collab API DB Notice]: Could not insert to DB, logging to console:", dbErr);
    }

    console.log("[New Collaboration Proposal Received]", {
      name: data.name,
      email: data.email,
      organization: data.organization,
      category: data.category,
      role: data.role,
      interests: data.interests,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for partnering with Savzyen! Our collaboration team will review your proposal and get in touch within 24 hours.",
    });
  } catch (err) {
    console.error("[Collab API Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

