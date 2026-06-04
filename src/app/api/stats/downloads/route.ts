import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [total, byCountry, byPlatform, recent] = await Promise.all([
    prisma.appDownload.count(),
    prisma.appDownload.groupBy({
      by: ["country"],
      _count: true,
      orderBy: { _count: { country: "desc" } },
      take: 20,
    }),
    prisma.appDownload.groupBy({
      by: ["platform"],
      _count: true,
    }),
    prisma.appDownload.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, country: true, city: true, platform: true, createdAt: true },
    }),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = await prisma.appDownload.count({
    where: { createdAt: { gte: today } },
  });

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayCount = await prisma.appDownload.count({
    where: { createdAt: { gte: yesterday, lt: today } },
  });

  return NextResponse.json({
    total,
    today: todayCount,
    yesterday: yesterdayCount,
    byCountry,
    byPlatform,
    recent,
  });
}
