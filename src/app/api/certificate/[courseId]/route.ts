import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";

export async function GET(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await getUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await params;
  const userId = (session.user as any).id;

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: { course: true },
  });

  if (!enrollment || !enrollment.completed) {
    return NextResponse.json({ error: "Course not completed" }, { status: 400 });
  }

  const userName = (session.user as any).name || "Student";
  const courseName = enrollment.course.title;
  const date = enrollment.updatedAt.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0a0a0f"/>
        <stop offset="100%" style="stop-color:#1a1a2e"/>
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#E50914"/>
        <stop offset="100%" style="stop-color:#ff4d4d"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bg)" rx="20"/>
    <rect x="30" y="30" width="740" height="540" fill="none" stroke="rgba(229,9,20,0.3)" stroke-width="2" rx="15"/>
    <rect x="40" y="40" width="720" height="520" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" rx="12"/>

    <rect x="300" y="80" width="200" height="4" fill="url(#accent)" rx="2"/>

    <text x="400" y="140" text-anchor="middle" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#ffffff">Certificate of Completion</text>

    <text x="400" y="190" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#888888">This certifies that</text>

    <text x="400" y="250" text-anchor="middle" font-family="Georgia, serif" font-size="32" fill="#E50914" font-weight="bold">${userName}</text>

    <text x="400" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#888888">has successfully completed the course</text>

    <text x="400" y="350" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#ffffff">${courseName}</text>

    <text x="400" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666666">Completed on ${date}</text>

    <rect x="320" y="430" width="160" height="2" fill="rgba(255,255,255,0.1)"/>
    <text x="400" y="460" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#666666">BTL TV Bible School</text>

    <text x="400" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#444444">Be The Light Television — btltv.com</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": `attachment; filename="certificate-${courseId}.svg"`,
    },
  });
}
