import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const { name } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    await prisma.user.update({ where: { email: session.user!.email! }, data: { name: name.trim() } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
