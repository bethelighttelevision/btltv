import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser, unauthorized } from "@/lib/user-auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await getUser();
  if (!session) return unauthorized();

  const { courseId } = await params;
  const userId = (session.user as any).id;

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, courseId },
  });

  const lessonProgress = await prisma.lessonProgress.findMany({
    where: { userId, lesson: { courseId } },
    include: { lesson: { select: { id: true, title: true, order: true } } },
    orderBy: { lesson: { order: "asc" } },
  });

  return NextResponse.json({ enrollment, lessonProgress });
}
