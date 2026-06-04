import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";

export async function GET(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const pageKey = req.nextUrl.searchParams.get("pageKey");
    if (!pageKey) return NextResponse.json({ error: "pageKey required" }, { status: 400 });
    const entries = await prisma.pageContent.findMany({ where: { pageKey } });
    const data: Record<string, string> = {};
    entries.forEach((e) => { data[e.fieldKey] = e.fieldValue ?? ""; });
    return NextResponse.json(data);
  } catch (e) { return apiError(e); }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const { pageKey, fields } = await req.json();
    if (!pageKey || !fields) return NextResponse.json({ error: "pageKey and fields required" }, { status: 400 });
    for (const [fieldKey, fieldValue] of Object.entries(fields)) {
      if (typeof fieldValue === "string") {
        await prisma.pageContent.upsert({
          where: { pageKey_fieldKey: { pageKey, fieldKey } },
          update: { fieldValue },
          create: { pageKey, fieldKey, fieldValue },
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) { return apiError(e); }
}
