import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser, unauthorized } from "@/lib/user-auth";

export async function GET() {
  const session = await getUser();
  if (!session) return unauthorized();

  const userId = (session.user as any).id;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          _count: { select: { lessons: true } },
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, title: true, order: true },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const lessonProgress = await prisma.lessonProgress.findMany({
    where: { userId },
    select: { lessonId: true, completed: true },
  });

  const enrollmentsWithResume = enrollments.map((enrollment) => {
    const completedLessonIds = lessonProgress.filter((p) => p.completed).map((p) => p.lessonId);
    const nextLesson = enrollment.course.lessons.find((l) => !completedLessonIds.includes(l.id));
    return {
      ...enrollment,
      resumeLessonTitle: nextLesson?.title || null,
    };
  });

  return NextResponse.json({ enrollments: enrollmentsWithResume, lessonProgress });
}
