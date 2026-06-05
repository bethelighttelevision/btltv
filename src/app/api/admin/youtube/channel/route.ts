import { NextResponse } from "next/server";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";
import { getValidAccessToken } from "@/lib/youtube-api";

export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();

    const token = await getValidAccessToken();
    if (!token) return NextResponse.json({ error: "YouTube not connected" }, { status: 401 });

    const res = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&mine=true", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) return NextResponse.json({ error: "Token expired. Reconnect." }, { status: 401 });

    const data = await res.json();
    const ch = data?.items?.[0];
    if (!ch) return NextResponse.json({ error: "No channel found" }, { status: 404 });

    return NextResponse.json({
      id: ch.id, title: ch.snippet.title, description: ch.snippet.description,
      customUrl: ch.snippet.customUrl, publishedAt: ch.snippet.publishedAt,
      thumbnails: ch.snippet.thumbnails, country: ch.snippet.country,
      statistics: ch.statistics, keywords: ch.brandingSettings?.channel?.keywords || "",
      bannerUrl: ch.brandingSettings?.image?.bannerExternalUrl || "",
    });
  } catch (e) { return apiError(e); }
}
