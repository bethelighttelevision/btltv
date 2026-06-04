import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const defaults: Record<string, string> = {
    siteName: "BTL TV",
    siteDescription: "Be The Light Television — Spreading the Gospel worldwide",
    adminEmail: "admin@btl-tv.com",
    maintenanceMode: "false",
    allowRegistration: "true",
    apkUrl: "https://expo.dev/artifacts/eas/q5eLL2FpbW3GBDv3qvYJ7Q.apk",
    appVersion: "1.0.0",
    socialFacebook: "https://facebook.com/btltv",
    socialYouTube: "https://youtube.com/@btltv",
    socialInstagram: "https://instagram.com/btltv",
  };

  for (const [key, value] of Object.entries(defaults)) {
    await prisma.adminSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  return NextResponse.json({ success: true, settings: defaults });
}
