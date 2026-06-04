import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";
import { hash, compare } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    if (newPassword.length < 6) return NextResponse.json({ error: "Password too short" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: session.user!.email! } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const valid = await compare(currentPassword, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    const passwordHash = await hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    return NextResponse.json({ success: true });
  } catch (e) { return apiError(e); }
}
