import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();
  const { id } = await params;

  try {
    const { isApproved, name, comment, rating, source } = await req.json();
    const data: any = {};
    if (typeof isApproved === "boolean") data.isApproved = isApproved;
    if (name !== undefined) data.name = name;
    if (comment !== undefined) data.comment = comment;
    if (rating !== undefined) data.rating = rating;
    if (source !== undefined) data.source = source;

    const review = await prisma.review.update({ where: { id }, data });
    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await checkAdmin();
  if (!session) return unauthorized();
  const { id } = await params;

  try {
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
