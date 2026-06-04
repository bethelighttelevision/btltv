import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { getPageContent, getActiveShows, getTeamMembers, getLiveStream, getSettings } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get("page") || "home";
    const [content, shows, team, live, settings] = await Promise.all([
      getPageContent(page),
      getActiveShows(),
      getTeamMembers(),
      getLiveStream(),
      getSettings(["siteName", "siteTagline", "logo", "contactEmail", "facebook", "youtube", "instagram", "twitter"]),
    ]);
    return NextResponse.json({ content, shows, team, live, settings }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (e) { return apiError(e); }
}
