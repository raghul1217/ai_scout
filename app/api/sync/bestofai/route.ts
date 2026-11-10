import { NextResponse } from "next/server";
import { syncBestOfAITools } from "@/lib/tools/bestofai";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Check authorization (Bearer SYNC_SECRET or ADMIN role)
    const authHeader = req.headers.get("authorization");
    const syncSecret = process.env.SYNC_SECRET;

    let isAuthorized = false;

    if (syncSecret && authHeader === `Bearer ${syncSecret}`) {
      isAuthorized = true;
    } else {
      const user = await getCurrentUser();
      if (user?.role === "ADMIN") {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Admin session or Bearer SYNC_SECRET required." },
        { status: 401 }
      );
    }

    const result = await syncBestOfAITools();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Sync failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${result.count} tools from ${result.source === "github" ? "GitHub (best-of-ai/best-of-ai)" : "curated Best of AI catalog"}.`,
      count: result.count,
      source: result.source,
    });
  } catch (error) {
    console.error("[API Sync BestOfAI Error]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

