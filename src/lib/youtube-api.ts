import { prisma } from "@/lib/prisma";

export async function getValidAccessToken(): Promise<string | null> {
  const [accessToken, refreshToken, tokenExpiry] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "youtubeAccessToken" } }),
    prisma.setting.findUnique({ where: { key: "youtubeRefreshToken" } }),
    prisma.setting.findUnique({ where: { key: "youtubeTokenExpiry" } }),
  ]);

  if (!accessToken?.value) return null;

  const expiry = tokenExpiry?.value ? parseInt(tokenExpiry.value) : 0;
  if (Date.now() < expiry) return accessToken.value;

  if (!refreshToken?.value) return null;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken.value,
        grant_type: "refresh_token",
      }),
    });

    const data = await res.json();
    if (!data.access_token) return null;

    await prisma.setting.upsert({
      where: { key: "youtubeAccessToken" },
      update: { value: data.access_token },
      create: { key: "youtubeAccessToken", value: data.access_token },
    });

    if (data.expires_in) {
      await prisma.setting.upsert({
        where: { key: "youtubeTokenExpiry" },
        update: { value: String(Date.now() + data.expires_in * 1000) },
        create: { key: "youtubeTokenExpiry", value: String(Date.now() + data.expires_in * 1000) },
      });
    }

    return data.access_token;
  } catch {
    return null;
  }
}
