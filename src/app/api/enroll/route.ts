import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser, unauthorized } from "@/lib/user-auth";

export async function POST(req: NextRequest) {
  const session = await getUser();
  if (!session) return unauthorized();

  const { courseId } = await req.json();
  if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 });

  const existing = await prisma.enrollment.findFirst({
    where: { userId: (session.user as any).id, courseId },
  });
  if (existing) return NextResponse.json(existing);

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: (session.user as any).id,
      courseId,
    },
  });
  return NextResponse.json(enrollment);
}
