import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const { question, options, correctAnswer } = await req.json();
  const q = await prisma.quizQuestion.update({
    where: { id },
    data: {
      question,
      options: JSON.stringify(options),
      correctAnswer,
    },
  });
  return NextResponse.json(q);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.quizQuestion.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
