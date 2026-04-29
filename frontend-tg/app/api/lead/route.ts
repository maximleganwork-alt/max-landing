import { NextResponse, type NextRequest } from "next/server";
import { leadSchema } from "shared/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "0.0.0.0";
}

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const data = parsed.data;

  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  const { consent: _consent, ...rest } = data;
  const upstreamPayload = { ...rest, source: "tg" as const };

  try {
    const upstream = await fetch(`${BACKEND_URL}/api/lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Real-IP": ip,
        "X-Forwarded-For": ip,
        "X-User-Agent": userAgent,
      },
      body: JSON.stringify(upstreamPayload),
      cache: "no-store",
    });

    if (upstream.status === 429) {
      return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
    }

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      console.error("[lead] backend error", upstream.status, text);
      return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
    }

    const json = await upstream.json().catch(() => ({ ok: true }));
    return NextResponse.json(json);
  } catch (err) {
    console.error("[lead] proxy failure", err);
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
  }
}
