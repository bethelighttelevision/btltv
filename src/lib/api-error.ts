import { NextResponse } from "next/server";

export function apiError(error: unknown, fallback = "Internal server error") {
  console.error("[API Error]", error);
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status: 500 });
}
