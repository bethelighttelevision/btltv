import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const [shows, videos, team, liveStream] = await Promise.all([
      prisma.show.count(),
      prisma.video.count(),
      prisma.teamMember.count(),
      prisma.liveStream.findFirst(),
    ]);
    return NextResponse.json({ shows, videos, team, isLive: liveStream?.isLive ?? false });
  } catch (e) { return apiError(e); }
}
