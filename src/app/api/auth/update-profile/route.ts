import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";

export async function PUT(request: Request) {
  try {
    const session = await getUser();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    if (!userId) return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });

    const { name, email } = await request.json();
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const data: Record<string, string> = { name: name.trim() };
    if (email?.trim()) data.email = email.trim();

    await prisma.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
