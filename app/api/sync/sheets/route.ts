import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { runGoogleSheetsSync } from "@/lib/sheets/sync";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 1. Check Bearer Token
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  const syncSecret = process.env.SYNC_SECRET;

  let isAuthorized = false;

  if (syncSecret && token === syncSecret) {
    isAuthorized = true;
  } else {
    // 2. Check if logged in user is ADMIN
    const user = await getCurrentUser();
    if (user && user.role === "ADMIN") {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Unauthorized. Provide valid Bearer SYNC_SECRET or log in as Admin." },
      { status: 401 }
    );
  }

  try {
    const result = await runGoogleSheetsSync();
    return NextResponse.json({
      message: "Sync completed",
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Sync execution failed" },
      { status: 500 }
    );
  }
}
