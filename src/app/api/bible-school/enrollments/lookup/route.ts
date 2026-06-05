import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, studentName, courseId } = await req.json();
    const where: any = {};
    if (email) where.email = email;
    else if (studentName) where.studentName = studentName;
    else return NextResponse.json({ error: "Email or name required" }, { status: 400 });
    if (courseId) where.courseId = courseId;

    const enrollments = await prisma.enrollment.findMany({
      where, include: { course: { select: { title: true, slug: true, thumbnail: true } }, certificate: { select: { certId: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(enrollments);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
