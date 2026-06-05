import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { courseSlug, studentName } = await req.json();
    if (!courseSlug || !studentName?.trim()) return NextResponse.json({ error: "Course slug and name required" }, { status: 400 });

    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const existing = await prisma.enrollment.findFirst({ where: { courseId: course.id, studentName: studentName.trim(), completedAt: null } });
    if (existing) return NextResponse.json(existing);

    const enrollment = await prisma.enrollment.create({
      data: { courseId: course.id, studentName: studentName.trim() },
    });
    return NextResponse.json(enrollment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}
