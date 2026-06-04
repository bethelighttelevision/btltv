import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const { id } = await params;
    const data = await req.json();
    const show = await prisma.show.update({ where: { id }, data });
    return NextResponse.json(show);
  } catch (e) { return apiError(e); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const { id } = await params;
    await prisma.show.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) { return apiError(e); }
}
