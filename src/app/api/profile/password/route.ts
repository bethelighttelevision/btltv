import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser, unauthorized } from "@/lib/user-auth";
import { compare, hash } from "bcryptjs";

export async function PUT(req: NextRequest) {
  const session = await getUser();
  if (!session) return unauthorized();

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both passwords are required" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } });
  if (!user || !user.password) {
    return NextResponse.json({ error: "Password login not set up for this account" }, { status: 400 });
  }

  const valid = await compare(currentPassword, user.password);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });

  const hashed = await hash(newPassword, 12);
  await prisma.user.update({
    where: { email: session.user!.email! },
    data: { password: hashed },
  });

  return NextResponse.json({ success: true });
}
