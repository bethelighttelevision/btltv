import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();
  const { id } = await params;
  try {
    const data = await req.json();
    const q = await prisma.quizQuestion.update({ where: { id }, data: { question: data.question, options: JSON.stringify(data.options), correctAnswer: data.correctAnswer, order: data.order } });
    return NextResponse.json(q);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();
  const { id } = await params;
  try { await prisma.quizQuestion.delete({ where: { id } }); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
