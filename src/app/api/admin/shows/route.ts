import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const shows = await prisma.show.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { videos: true } } } });
    return NextResponse.json(shows);
  } catch (e) { return apiError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const data = await req.json();
    const show = await prisma.show.create({ data });
    return NextResponse.json(show);
  } catch (e) { return apiError(e); }
}
