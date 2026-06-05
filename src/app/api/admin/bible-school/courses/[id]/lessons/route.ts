import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();
  const { id } = await params;
  const lessons = await prisma.lesson.findMany({ where: { courseId: id }, orderBy: { order: "asc" }, include: { _count: { select: { questions: true } } } });
  return NextResponse.json(lessons);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();
  const { id } = await params;
  try {
    const data = await req.json();
    const lesson = await prisma.lesson.create({ data: { courseId: id, title: data.title, description: data.description, youtubeId: data.youtubeId, pdfUrl: data.pdfUrl, content: data.content, order: data.order || 0 } });
    return NextResponse.json(lesson, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
