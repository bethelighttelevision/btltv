import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lessons = await prisma.lesson.findMany({
    where: { courseId: id },
    orderBy: { order: "asc" },
    include: { _count: { select: { questions: true } } },
  });
  return NextResponse.json(lessons);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const { title, content } = await req.json();
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const count = await prisma.lesson.count({ where: { courseId: id } });
  const lesson = await prisma.lesson.create({
    data: {
      title,
      content: content || "",
      order: count,
      courseId: id,
    },
  });
  return NextResponse.json(lesson);
}
