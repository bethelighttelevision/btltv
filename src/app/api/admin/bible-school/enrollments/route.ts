import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET() {
  const session = await checkAdmin();
  if (!session) return unauthorized();
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: { course: { select: { title: true, slug: true } }, certificate: { select: { certId: true } } },
  });
  return NextResponse.json(enrollments);
}
