import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";
import { generateSEO } from "@/lib/youtube-seo";
import { getValidAccessToken } from "@/lib/youtube-api";

export async function POST(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();

    const { videoIds } = await req.json();
    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0) {
      return NextResponse.json({ error: "No video IDs provided" }, { status: 400 });
    }

    const token = await getValidAccessToken();
    if (!token) return NextResponse.json({ error: "YouTube not connected" }, { status: 401 });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(",")}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const results: any[] = [];

    for (const video of data.items || []) {
      const originalTitle = video.snippet.title;
      const originalDescription = video.snippet.description;
      const originalTags = video.snippet.tags?.join(", ") || "";
      const seo = generateSEO(originalTitle);

      await prisma.videoSEO.upsert({
        where: { videoId: video.id },
        update: { title: seo.title, oldTitle: originalTitle, description: seo.description, oldDescription: originalDescription, tags: seo.tags, oldTags: originalTags, status: "generated", generatedAt: new Date() },
        create: { videoId: video.id, title: seo.title, oldTitle: originalTitle, description: seo.description, oldDescription: originalDescription, tags: seo.tags, oldTags: originalTags, status: "generated", generatedAt: new Date() },
      });

      results.push({ videoId: video.id, originalTitle, seoTitle: seo.title, status: "generated" });
    }

    return NextResponse.json({ results, count: results.length });
  } catch (e) { return apiError(e); }
}
