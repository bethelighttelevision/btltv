import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const downloads = await prisma.appDownload.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const dailyMap: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    dailyMap[d.toISOString().slice(0, 10)] = 0;
  }

  downloads.forEach((d) => {
    const day = d.createdAt.toISOString().slice(0, 10);
    if (dailyMap[day] !== undefined) dailyMap[day]++;
  });

  const result = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

  return NextResponse.json(result);
}
