import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ certId: string }> }) {
  const { certId } = await params;
  const cert = await prisma.certificate.findUnique({ where: { certId }, include: { enrollment: { include: { course: true } } } });
  if (!cert) return NextResponse.json({ error: "Invalid certificate" }, { status: 404 });
  return NextResponse.json(cert);
}
