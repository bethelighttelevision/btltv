import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";
import { getValidAccessToken } from "@/lib/youtube-api";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const { id } = await params;

    const token = await getValidAccessToken();
    if (!token) return NextResponse.json({ error: "YouTube not connected" }, { status: 401 });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails,status&id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const video = data?.items?.[0];
    if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });

    const seo = await prisma.videoSEO.findUnique({ where: { videoId: id } });

    return NextResponse.json({
      videoId: video.id, title: video.snippet.title, description: video.snippet.description,
      tags: video.snippet.tags?.join(", ") || "", categoryId: video.snippet.categoryId,
      thumbnails: video.snippet.thumbnails, publishedAt: video.snippet.publishedAt,
      views: video.statistics?.viewCount || "0", likes: video.statistics?.likeCount || "0",
      comments: video.statistics?.commentCount || "0", duration: video.contentDetails?.duration,
      privacyStatus: video.status?.privacyStatus, seoStatus: seo?.status || "pending",
    });
  } catch (e) { return apiError(e); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const { id } = await params;

    const token = await getValidAccessToken();
    if (!token) return NextResponse.json({ error: "YouTube not connected" }, { status: 401 });

    const body = await req.json();
    const snippet: Record<string, any> = {};
    if (body.title) snippet.title = body.title;
    if (body.description) snippet.description = body.description;
    if (body.tags) snippet.tags = typeof body.tags === "string" ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : body.tags;
    if (body.categoryId) snippet.categoryId = body.categoryId;

    if (Object.keys(snippet).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

    const updateRes = await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ id, snippet }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      return NextResponse.json({ error: "YouTube API error", details: err }, { status: updateRes.status });
    }

    await prisma.videoSEO.update({ where: { videoId: id }, data: { status: "applied", appliedAt: new Date() } });

    return NextResponse.json({ success: true });
  } catch (e) { return apiError(e); }
}
