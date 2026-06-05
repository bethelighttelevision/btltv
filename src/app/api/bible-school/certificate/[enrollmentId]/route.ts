import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ enrollmentId: string }> }) {
  const { enrollmentId } = await params;
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true, certificate: true },
  });
  if (!enrollment || !enrollment.certificate) {
    return NextResponse.json({ error: "No certificate found" }, { status: 404 });
  }
  return NextResponse.json({
    studentName: enrollment.studentName,
    courseTitle: enrollment.course.title,
    certId: enrollment.certificate.certId,
    issuedAt: enrollment.certificate.issuedAt,
  });
}
