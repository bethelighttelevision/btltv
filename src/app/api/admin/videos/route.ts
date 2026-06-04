import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const videos = await prisma.video.findMany({
      orderBy: { publishedAt: "desc" },
      include: { show: { select: { title: true } } },
    });
    return NextResponse.json(videos);
  } catch (e) { return apiError(e); }
}
