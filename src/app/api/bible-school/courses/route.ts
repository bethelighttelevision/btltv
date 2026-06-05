import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } });
  return NextResponse.json(courses);
}
