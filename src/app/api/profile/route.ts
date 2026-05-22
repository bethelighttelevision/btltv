import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser, unauthorized } from "@/lib/user-auth";

export async function GET() {
  const session = await getUser();
  if (!session) return unauthorized();
  const user = await prisma.user.findUnique({
    where: { email: session.user!.email! },
    select: { id: true, name: true, email: true, image: true, role: true },
  });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getUser();
  if (!session) return unauthorized();

  const { name, email } = await req.json();

  if (email && email !== session.user!.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const user = await prisma.user.update({
    where: { email: session.user!.email! },
    data: {
      name: name ?? undefined,
      email: email ?? undefined,
    },
  });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
