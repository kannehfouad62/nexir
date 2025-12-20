import { NextResponse } from "next/server";
import { resolveAny } from "node:dns/promises";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = (searchParams.get("domain") || "").toLowerCase().trim();

  if (!domain || !/^[a-z0-9-]+\.[a-z]{2,}$/.test(domain)) {
    return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
  }

  try {
    const records = await resolveAny(domain);
    return NextResponse.json({
      domain,
      dnsExists: true,
      recordsCount: records?.length ?? 0
    });
  } catch {
    // No DNS records found
    return NextResponse.json({
      domain,
      dnsExists: false,
      recordsCount: 0
    });
  }
}
