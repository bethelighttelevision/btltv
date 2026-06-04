import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET() {
  const session = await checkAdmin();
  if (!session) return unauthorized();

  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(reviews);
}
