import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const questions = await prisma.quizQuestion.findMany({
    where: { lessonId: id },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(questions);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const { question, options, correctAnswer } = await req.json();
  if (!question || !options || correctAnswer === undefined) {
    return NextResponse.json({ error: "Question, options, and correctAnswer are required" }, { status: 400 });
  }

  const count = await prisma.quizQuestion.count({ where: { lessonId: id } });
  const q = await prisma.quizQuestion.create({
    data: {
      question,
      options: JSON.stringify(options),
      correctAnswer,
      order: count,
      lessonId: id,
    },
  });
  return NextResponse.json(q);
}
