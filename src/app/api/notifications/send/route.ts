import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export async function POST(request: Request) {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();

    const { title, body, data, type } = await request.json();
    if (!title || !body) {
      return NextResponse.json({ error: "Title and body required" }, { status: 400 });
    }

    const tokens = await prisma.pushToken.findMany({
      where: { active: true },
      select: { token: true },
    });

    if (tokens.length === 0) {
      return NextResponse.json({ error: "No registered devices" }, { status: 400 });
    }

    const messages = tokens.map((t) => ({
      to: t.token,
      sound: "default",
      title,
      body,
      data: { type: type || "general", ...data },
      channelId: type === "live" ? "live" : type === "episodes" ? "episodes" : "default",
      badge: 1,
    }));

    const res = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(messages),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Expo push error:", result);
      return NextResponse.json({ error: "Push send failed" }, { status: 500 });
    }

    const sent = result.data?.filter((d: any) => d.status === "ok").length || 0;
    const failed = result.data?.filter((d: any) => d.status !== "ok").length || 0;

    if (failed > 0) {
      const errors = result.data?.filter((d: any) => d.status !== "ok");
      for (const err of errors) {
        if (err.details?.error === "DeviceNotRegistered") {
          const invalidToken = err.details?.apnsToken || "";
          if (invalidToken) {
            await prisma.pushToken.updateMany({
              where: { token: invalidToken },
              data: { active: false },
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, sent, failed });
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) return unauthorized();

    const count = await prisma.pushToken.count({ where: { active: true } });
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Get device count error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
