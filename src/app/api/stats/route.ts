import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET() {
  const session = await checkAdmin();
  if (!session) return unauthorized();

  const [courses, lessons, questions, users, enrollments] = await Promise.all([
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.quizQuestion.count(),
    prisma.user.count(),
    prisma.enrollment.count(),
  ]);

  return NextResponse.json({ courses, lessons, questions, users, enrollments });
}
