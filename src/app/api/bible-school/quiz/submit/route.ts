import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { enrollmentId, lessonId, answers } = await req.json();
    if (!enrollmentId || !lessonId || !answers) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const questions = await prisma.quizQuestion.findMany({ where: { lessonId }, orderBy: { order: "asc" } });
    if (!questions.length) return NextResponse.json({ error: "No quiz" }, { status: 400 });

    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctAnswer) correct++;
    }
    const passed = (correct / questions.length) >= 0.7;

    const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
    if (!enrollment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const passedIds = enrollment.passedLessonIds ? enrollment.passedLessonIds.split(",").filter(Boolean) : [];
    if (passed && !passedIds.includes(lessonId)) passedIds.push(lessonId);

    const totalLessons = await prisma.lesson.count({ where: { courseId: enrollment.courseId } });
    const progress = totalLessons > 0 ? Math.round((passedIds.length / totalLessons) * 100) : 0;
    const completed = progress >= 100 ? new Date() : null;

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { passedLessonIds: passedIds.join(","), progress, currentLessonId: lessonId, completedAt: completed },
    });

    if (completed) {
      const certId = `CERT-BTL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      await prisma.certificate.create({ data: { enrollmentId, certId } });
      return NextResponse.json({ passed, correct, total: questions.length, progress, completed: true, certId });
    }

    return NextResponse.json({ passed, correct, total: questions.length, progress, completed: false });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
