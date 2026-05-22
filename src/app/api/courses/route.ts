import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { lessons: true, enrollments: true } } },
  });
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return unauthorized();

  const { title, description, image, category } = await req.json();
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const count = await prisma.course.count();
  const course = await prisma.course.create({
    data: {
      title,
      description: description || "",
      image: image || "",
      category: category || "general",
      order: count,
      createdById: (session.user as any).id,
    },
  });
  return NextResponse.json(course);
}
