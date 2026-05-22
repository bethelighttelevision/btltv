import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser, unauthorized } from "@/lib/user-auth";

export async function POST(req: NextRequest) {
  const session = await getUser();
  if (!session) return unauthorized();

  const { lessonId, score, totalQuestions } = await req.json();
  if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

  const userId = (session.user as any).id;

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  if (existing) return NextResponse.json(existing);

  await prisma.lessonProgress.create({
    data: { userId, lessonId, completed: true, score: score || 0 },
  });

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { courseId: true },
  });
  if (lesson) {
    const totalLessons = await prisma.lesson.count({ where: { courseId: lesson.courseId } });
    const completedLessons = await prisma.lessonProgress.count({
      where: { userId, lesson: { courseId: lesson.courseId }, completed: true },
    });
    const progressPct = Math.round((completedLessons / totalLessons) * 100);
    const completed = completedLessons >= totalLessons;

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId: lesson.courseId } },
      update: { progress: progressPct, completed },
      create: { userId, courseId: lesson.courseId, progress: progressPct, completed },
    });
  }

  return NextResponse.json({ success: true });
}
