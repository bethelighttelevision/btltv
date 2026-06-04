import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const members = await prisma.teamMember.findMany({ orderBy: { displayOrder: "asc" } });
    return NextResponse.json(members);
  } catch (e) { return apiError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const data = await req.json();
    const member = await prisma.teamMember.create({ data });
    return NextResponse.json(member);
  } catch (e) { return apiError(e); }
}
