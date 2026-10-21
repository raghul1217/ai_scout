import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "0.1.0",
    env: process.env.NODE_ENV,
    // DB check will be added in Phase 3
    db: "not_configured",
  };

  return NextResponse.json(health, { status: 200 });
}
