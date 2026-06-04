import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, rating, comment } = await req.json();
    if (!name?.trim() || !comment?.trim() || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Name, rating (1-5), and comment are required" }, { status: 400 });
    }
    const review = await prisma.review.create({
      data: { name: name.trim(), email: email?.trim() || null, rating, comment: comment.trim(), source: "site" },
    });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
