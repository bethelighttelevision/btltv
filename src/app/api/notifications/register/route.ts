import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token, platform } = await request.json();
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    await prisma.pushToken.upsert({
      where: { token },
      update: { platform: platform || "ios", active: true },
      create: { token, platform: platform || "ios", active: true },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to register token" }, { status: 500 });
  }
}
