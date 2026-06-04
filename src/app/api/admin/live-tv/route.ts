import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const stream = await prisma.liveStream.findFirst();
    return NextResponse.json(stream ?? {});
  } catch (e) { return apiError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const data = await req.json();
    const existing = await prisma.liveStream.findFirst();
    if (existing) {
      const updated = await prisma.liveStream.update({ where: { id: existing.id }, data });
      return NextResponse.json(updated);
    }
    const created = await prisma.liveStream.create({ data });
    return NextResponse.json(created);
  } catch (e) { return apiError(e); }
}
