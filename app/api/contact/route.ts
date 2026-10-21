import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(200).optional(),
  message: z.string().min(10).max(2000),
  type: z.enum(["TEAM_ENQUIRY", "GENERAL", "PARTNERSHIP"]).default("GENERAL"),
});

export async function POST(req: NextRequest) {
  try {
    // Request size limit
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 10_000) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const body = await req.json();
    const result = enquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", issues: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, company, message, type } = result.data;

    // In Phase 3, this will save to PostgreSQL via Prisma
    // For now, log to console
    console.log("[Contact Enquiry]", { name, email, company, message, type, timestamp: new Date().toISOString() });

    // TODO Phase 3: 
    // await prisma.contactEnquiry.create({ data: { name, email, company, message, type } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[Contact API Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
