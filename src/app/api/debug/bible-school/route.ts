import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: { _count: { select: { lessons: true } } },
    orderBy: { order: "asc" },
  });
  const details = await Promise.all(
    courses.map(async (c) => {
      const lessons = await prisma.lesson.findMany({ where: { courseId: c.id }, select: { id: true, title: true, youtubeId: true } });
      return { id: c.id, title: c.title, slug: c.slug, lessonCount: c._count.lessons, lessons };
    })
  );
  return NextResponse.json(details);
}
