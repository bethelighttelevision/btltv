import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";
import { getValidAccessToken } from "@/lib/youtube-api";
import { generateSEO } from "@/lib/youtube-seo";

function isValidTitle(t: string): boolean {
  if (!t || typeof t !== "string") return false;
  const stripped = t.replace(/[|–\-,\s]/g, "").trim();
  if (stripped.length <= 3 || t.startsWith(" |") || t.startsWith("| ") || /^\s*$/.test(t)) return false;
  // Detect duplicate SEO suffix (e.g., "| Talk Show | Talk Show | BTL TV")
  const suffixMatch = t.match(/\|\s*([^|]+)\s*\|\s*btl\s*tv\s*$/i);
  if (suffixMatch) {
    const category = suffixMatch[1].trim();
    const escaped = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const count = (t.match(new RegExp(escaped, 'gi')) || []).length;
    if (count > 1) return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();

    const { videoIds, include = ["title", "description", "tags"] } = await req.json();
    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0) {
      return NextResponse.json({ error: "No video IDs provided" }, { status: 400 });
    }

    const token = await getValidAccessToken();
    if (!token) return NextResponse.json({ error: "YouTube not connected" }, { status: 401 });

    const seoRecords = await prisma.videoSEO.findMany({
      where: { videoId: { in: videoIds }, status: "generated" },
    });

    if (seoRecords.length === 0) {
      return NextResponse.json({ error: "No generated SEO found. Run SEO generation first." }, { status: 400 });
    }

    const currentRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(",")}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const currentData = await currentRes.json();
    const currentMap = new Map<string, any>((currentData.items || []).map((i: any) => [i.id, i.snippet]));

    const results: any[] = [];
    const errors: any[] = [];

    for (const record of seoRecords) {
      try {
        const current = currentMap.get(record.videoId);

        let videoTitle = current?.title || record.oldTitle || "BTL TV Video";

        if (include.includes("title")) {
          const seoTitle = record.title || "";
          if (!isValidTitle(seoTitle)) {
            const fresh = generateSEO(videoTitle);
            videoTitle = fresh.title;
            await prisma.videoSEO.update({ where: { id: record.id }, data: { title: videoTitle } });
          } else {
            videoTitle = seoTitle;
          }
        }

        let videoDescription = current?.description || record.oldDescription || "";
        if (include.includes("description")) {
          const seoDesc = record.description || "";
          if (!seoDesc || seoDesc.length < 20) {
            const fresh = generateSEO(videoTitle);
            videoDescription = fresh.description;
            await prisma.videoSEO.update({ where: { id: record.id }, data: { description: videoDescription } });
          } else {
            videoDescription = seoDesc;
          }
        }

        let videoTags: string[] = current?.tags || [];
        if (include.includes("tags")) {
          const seoTags = record.tags || "";
          if (!seoTags || seoTags.length < 5) {
            const fresh = generateSEO(videoTitle);
            videoTags = fresh.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
            await prisma.videoSEO.update({ where: { id: record.id }, data: { tags: fresh.tags } });
          } else {
            videoTags = seoTags.split(",").map((t: string) => t.trim()).filter(Boolean);
          }
        }

        const snippet: Record<string, any> = {
          title: videoTitle,
          categoryId: current?.categoryId || "22",
          defaultLanguage: current?.defaultLanguage || "ur",
          defaultAudioLanguage: current?.defaultAudioLanguage || "ur",
          description: videoDescription,
          tags: videoTags,
        };

        const requestBody = JSON.stringify({ id: record.videoId, snippet });
        const updateRes = await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet", {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: requestBody,
        });

        if (!updateRes.ok) {
          const errText = await updateRes.text();
          errors.push({ videoId: record.videoId, error: errText, status: updateRes.status, sentTitle: videoTitle, requestBody });
          await prisma.videoSEO.update({ where: { id: record.id }, data: { status: "error", errorMessage: errText.substring(0, 500) } });
        } else {
          await prisma.videoSEO.update({ where: { id: record.id }, data: { status: "applied", appliedAt: new Date() } });
          results.push({ videoId: record.videoId, status: "applied" });
        }
      } catch (e: any) { errors.push({ videoId: record.videoId, error: e.message }); }
    }

    return NextResponse.json({ success: results.length, failed: errors.length, results, errors });
  } catch (e) { return apiError(e); }
}
