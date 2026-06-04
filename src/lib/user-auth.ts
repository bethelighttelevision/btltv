import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = await getToken({
      req: { cookies: cookieStore } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token || !token.email) return null;

    return {
      user: {
        id: (token.sub || token.id) as string,
        email: token.email as string,
        name: (token.name as string) || "",
        role: ((token as any).role as string) || "user",
        image: (token.picture as string) || null,
      },
    };
  } catch (err) {
    console.error("getUser error:", err);
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
