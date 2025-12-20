import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Result = {
  domain: string;
  available: boolean;     // best-effort
  method: "rdap";
};

async function checkRdap(domain: string): Promise<Result> {
  // RDAP.org is a bootstrap endpoint and will redirect to the authoritative RDAP server. :contentReference[oaicite:1]{index=1}
  const url = `https://rdap.org/domain/${encodeURIComponent(domain)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      // A simple UA helps with some endpoints
      headers: { "user-agent": "Nexir/1.0 (domain-check)" }
    });

    // Many RDAP servers return 404 for unregistered domains
    if (res.status === 404) return { domain, available: true, method: "rdap" };

    // 200 usually means registered
    if (res.ok) return { domain, available: false, method: "rdap" };

    // Some servers return 400/403/429; treat as unknown -> not “available”
    return { domain, available: false, method: "rdap" };
  } catch {
    return { domain, available: false, method: "rdap" };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const domains: string[] = Array.isArray(body?.domains) ? body.domains : [];

    const clean = domains
      .map((d) => String(d).toLowerCase().trim())
      .filter((d) => /^[a-z0-9-]+\.[a-z]{2,}$/.test(d))
      .slice(0, 25); // keep it fast + safe

    if (clean.length === 0) {
      return NextResponse.json({ error: "No valid domains provided" }, { status: 400 });
    }

    // Concurrency limit (simple)
    const results: Result[] = [];
    for (const domain of clean) {
      // sequential is simplest; you can optimize later
      results.push(await checkRdap(domain));
    }

    // sort: available first
    results.sort((a, b) => Number(b.available) - Number(a.available));

    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
