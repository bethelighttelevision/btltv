import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  try {
    const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=city,country`, { signal: AbortSignal.timeout(3000) });
    if (geoRes.ok) {
      const geo = await geoRes.json();
      city = geo.city || "";
      country = geo.country || "";
    }
  } catch {}

  try {
    await prisma.appDownload.create({
      data: { platform, version: "1.0.0", ip, city, country, userAgent, referrer },
    });
  } catch {}

  const apkUrl = "https://expo.dev/artifacts/eas/q5eLL2FpbW3GBDv3qvYJ7Q.apk";

  return NextResponse.redirect(apkUrl, {
    status: 307,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
