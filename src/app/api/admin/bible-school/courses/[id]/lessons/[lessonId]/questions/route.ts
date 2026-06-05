import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();
  const { lessonId } = await params;
  const questions = await prisma.quizQuestion.findMany({ where: { lessonId }, orderBy: { order: "asc" } });
  return NextResponse.json(questions);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();
  const { lessonId } = await params;
  try {
    const data = await req.json();
    const q = await prisma.quizQuestion.create({ data: { lessonId, question: data.question, options: JSON.stringify(data.options), correctAnswer: data.correctAnswer, order: data.order || 0 } });
    return NextResponse.json(q, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
