import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export async function GET(req: NextRequest, context: any) {
  try {
    return await handler(req, context);
  } catch (error) {
    console.error("NextAuth GET error:", error);
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: any) {
  try {
    return await handler(req, context);
  } catch (error) {
    console.error("NextAuth POST error:", error);
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
