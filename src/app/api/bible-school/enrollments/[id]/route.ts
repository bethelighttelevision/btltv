import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      course: { select: { title: true, slug: true } },
      certificate: { select: { certId: true, issuedAt: true } },
    },
  });
  if (!enrollment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(enrollment);
}
