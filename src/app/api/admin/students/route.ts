import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";

export async function GET() {
  const session = await getUser();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { enrollments: true } },
      enrollments: { select: { completed: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function DELETE(request: Request) {
  const session = await getUser();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { userId } = await request.json();
  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ success: true });
}
