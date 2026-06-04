import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value ?? ""; });
    return NextResponse.json(map);
  } catch (e) { return apiError(e); }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) { return apiError(e); }
}
