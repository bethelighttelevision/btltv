import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET() {
  const session = await checkAdmin();
  if (!session) return unauthorized();
  const courses = await prisma.course.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { lessons: true, enrollments: true } } } });
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return unauthorized();
  try {
    const data = await req.json();
    const course = await prisma.course.create({ data: { title: data.title, slug: data.slug, description: data.description, thumbnail: data.thumbnail, level: data.level || "intro", creditText: data.creditText, order: data.order || 0, isPublished: data.isPublished || false } });
    return NextResponse.json(course, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
