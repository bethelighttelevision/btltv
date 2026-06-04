import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const session = await getUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("avatar") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const userId = (session.user as any).id;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `avatar-${userId}.${ext}`;
  const dir = path.join(process.cwd(), "public", "images", "avatars");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  const avatarUrl = `/images/avatars/${filename}`;
  await prisma.user.update({ where: { id: userId }, data: { image: avatarUrl } });

  return NextResponse.json({ url: avatarUrl });
}
