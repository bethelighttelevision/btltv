import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";
import { getValidAccessToken } from "@/lib/youtube-api";

export async function GET(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();

    const token = await getValidAccessToken();
    if (!token) return NextResponse.json({ error: "YouTube not connected" }, { status: 401 });

    let channelId = (await prisma.setting.findUnique({ where: { key: "youtubeChannelId" } }))?.value;

    const url = new URL(req.url);
    const pageToken = url.searchParams.get("pageToken") || "";
    const maxResults = url.searchParams.get("maxResults") || "50";
    const order = url.searchParams.get("order") || "date";
    const query = url.searchParams.get("query") || "";

    if (!channelId) {
      const chRes = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&mine=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const chData = await chRes.json();
      channelId = chData?.items?.[0]?.id;
      if (!channelId) {
        const errBody = await chRes.text().catch(() => "");
        return NextResponse.json({ error: "Could not find channel", apiError: errBody.substring(0, 500) }, { status: 400 });
      }
      await prisma.setting.upsert({ where: { key: "youtubeChannelId" }, update: { value: channelId }, create: { key: "youtubeChannelId", value: channelId } });
    }

    const uploadsId = (await prisma.setting.findUnique({ where: { key: "youtubeUploadsPlaylist" } }))?.value
      || (await (async () => {
        const chRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const chData = await chRes.json();
        const id = chData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (id) {
          await prisma.setting.upsert({ where: { key: "youtubeUploadsPlaylist" }, update: { value: id }, create: { key: "youtubeUploadsPlaylist", value: id } });
        }
        return id;
      })());

    if (!uploadsId) {
      return NextResponse.json({ error: "Could not find uploads playlist" }, { status: 400 });
    }

    let playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=${maxResults}&playlistId=${uploadsId}`;
    if (pageToken) playlistUrl += `&pageToken=${pageToken}`;

    const plRes = await fetch(playlistUrl, { headers: { Authorization: `Bearer ${token}` } });
    if (plRes.status === 401) return NextResponse.json({ error: "Token expired" }, { status: 401 });
    if (!plRes.ok) {
      const errText = await plRes.text();
      return NextResponse.json({ error: "Playlist fetch failed", details: errText.substring(0, 500) }, { status: plRes.status });
    }

    const plData = await plRes.json();

    const videoIds = plData.items?.map((i: any) => i.snippet.resourceId.videoId).filter(Boolean) || [];
    const publishedAts = new Map((plData.items || []).map((i: any) => [i.snippet.resourceId.videoId, i.snippet.publishedAt]));

    let stats: any[] = [];
    if (videoIds.length > 0) {
      const statsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,status&id=${videoIds.join(",")}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        stats = statsData.items || [];
      }
    }

    const statsMap = new Map(stats.map((s: any) => [s.id, s]));
    const seoRecords = await prisma.videoSEO.findMany({ where: { videoId: { in: videoIds } } });
    const seoMap = new Map(seoRecords.map((s) => [s.videoId, s]));

    const videos = (plData.items || []).map((item: any) => {
      const videoId = item.snippet.resourceId.videoId;
      const stat = statsMap.get(videoId);
      const seo = seoMap.get(videoId);
      return {
        videoId,
        title: item.snippet.title,
        description: item.snippet.description || "",
        thumbnails: item.snippet.thumbnails,
        publishedAt: publishedAts.get(videoId) || item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        views: stat?.statistics?.viewCount || "0",
        likes: stat?.statistics?.likeCount || "0",
        comments: stat?.statistics?.commentCount || "0",
        duration: stat?.contentDetails?.duration || "",
        privacyStatus: stat?.status?.privacyStatus || "public",
        seoStatus: seo?.status || "pending",
        seoTitle: seo?.title || null,
        seoDescription: seo?.description || null,
        seoTags: seo?.tags || null,
        seoErrorMessage: seo?.errorMessage || null,
      };
    });

    return NextResponse.json({
      videos,
      nextPageToken: plData.nextPageToken || null,
      prevPageToken: plData.prevPageToken || null,
      totalResults: plData.pageInfo?.totalResults || 0,
    });
  } catch (e) { return apiError(e); }
}
