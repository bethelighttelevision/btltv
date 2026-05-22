import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";

export async function GET() {
  const [courses, lessons, users, enrollments] = await Promise.all([
    prisma.course.count({ where: { published: true } }),
    prisma.lesson.count(),
    prisma.user.count(),
    prisma.enrollment.count(),
  ]);

  const session = await getUser();
  const userEnrolled = session
    ? await prisma.enrollment.count({ where: { userId: (session.user as any).id } })
    : 0;

  return NextResponse.json({ courses, lessons, users, enrollments, userEnrolled });
}
