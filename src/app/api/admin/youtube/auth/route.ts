import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";

const SCOPES = ["https://www.googleapis.com/auth/youtube", "https://www.googleapis.com/auth/youtube.readonly", "https://www.googleapis.com/auth/userinfo.profile"].join(" ");

function getOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  return { clientId, clientSecret };
}

export async function GET(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();

    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const { clientId, clientSecret } = getOAuthConfig();

    if (action === "status") {
      const [accessToken, channelId, channelTitle] = await Promise.all([
        prisma.setting.findUnique({ where: { key: "youtubeAccessToken" } }),
        prisma.setting.findUnique({ where: { key: "youtubeChannelId" } }),
        prisma.setting.findUnique({ where: { key: "youtubeChannelTitle" } }),
      ]);
      return NextResponse.json({
        connected: !!accessToken?.value,
        clientIdSet: !!clientId,
        channelId: channelId?.value || null,
        channelTitle: channelTitle?.value || null,
      });
    }

    if (action === "connect") {
      const redirectUri = `${url.origin}/api/admin/youtube/auth?action=callback`;
      if (!clientId) {
        return NextResponse.json({ error: "Google Client ID not configured in environment variables" }, { status: 400 });
      }
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(SCOPES)}&access_type=offline&prompt=consent`;
      return NextResponse.json({ authUrl });
    }

    if (action === "callback") {
      const code = url.searchParams.get("code");
      if (!code) return NextResponse.json({ error: "No authorization code" }, { status: 400 });

      if (!clientId || !clientSecret) {
        return NextResponse.json({ error: "YouTube Client ID or Secret not configured in environment" }, { status: 400 });
      }

      const redirectUri = `${url.origin}/api/admin/youtube/auth?action=callback`;
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code, client_id: clientId, client_secret: clientSecret,
          redirect_uri: redirectUri, grant_type: "authorization_code",
        }),
      });
      const tokens = await tokenRes.json();
      if (!tokens.access_token) {
        return NextResponse.json({ error: "Failed to get access token", details: tokens }, { status: 400 });
      }

      await prisma.setting.upsert({ where: { key: "youtubeAccessToken" }, update: { value: tokens.access_token }, create: { key: "youtubeAccessToken", value: tokens.access_token } });
      if (tokens.refresh_token) {
        await prisma.setting.upsert({ where: { key: "youtubeRefreshToken" }, update: { value: tokens.refresh_token }, create: { key: "youtubeRefreshToken", value: tokens.refresh_token } });
      }
      await prisma.setting.upsert({ where: { key: "youtubeTokenExpiry" }, update: { value: String(Date.now() + (tokens.expires_in || 3600) * 1000) }, create: { key: "youtubeTokenExpiry", value: String(Date.now() + (tokens.expires_in || 3600) * 1000) } });

      const channelRes = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const channelData = await channelRes.json();
      if (channelData?.items?.[0]) {
        const ch = channelData.items[0];
        await prisma.setting.upsert({ where: { key: "youtubeChannelId" }, update: { value: ch.id }, create: { key: "youtubeChannelId", value: ch.id } });
        await prisma.setting.upsert({ where: { key: "youtubeChannelTitle" }, update: { value: ch.snippet.title }, create: { key: "youtubeChannelTitle", value: ch.snippet.title } });
      }

      return NextResponse.redirect(new URL("/admin/youtube-seo?connected=true", url.origin));
    }

    if (action === "disconnect") {
      await Promise.all([
        prisma.setting.delete({ where: { key: "youtubeAccessToken" } }).catch(() => {}),
        prisma.setting.delete({ where: { key: "youtubeRefreshToken" } }).catch(() => {}),
        prisma.setting.delete({ where: { key: "youtubeTokenExpiry" } }).catch(() => {}),
        prisma.setting.delete({ where: { key: "youtubeChannelId" } }).catch(() => {}),
        prisma.setting.delete({ where: { key: "youtubeChannelTitle" } }).catch(() => {}),
      ]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) { return apiError(e); }
}
