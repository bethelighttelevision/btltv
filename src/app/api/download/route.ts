import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BOT_ISPS = ["google", "amazon", "microsoft", "azure", "cloudflare", "digitalocean", "oracle", "hetzner", "ovh"];

function isBotIsp(isp: string): boolean {
  const lower = isp.toLowerCase();
  return BOT_ISPS.some(bot => lower.includes(bot));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform") || "android";

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const referrer = request.headers.get("referer") || "";

  let city = "";
  let country = "";
  let isp = "";

  try {
    const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=city,country,isp`, { signal: AbortSignal.timeout(3000) });
    if (geoRes.ok) {
      const geo = await geoRes.json();
      city = geo.city || "";
      country = geo.country || "";
      isp = geo.isp || "";
    }
  } catch {}

  // Only record real users, not bots/cloud providers
  if (!isp || !isBotIsp(isp)) {
    try {
      await prisma.appDownload.create({
        data: { platform, version: "1.0.0", ip, city, country, isp, userAgent, referrer },
      });
    } catch {}
  }

  const apkUrl = "https://expo.dev/artifacts/eas/Jjos7CJiBSW_AoQkxufZxSsUEz3E0Mqy0rGR2U5dIDA.apk";

  return NextResponse.redirect(apkUrl, {
    status: 307,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
