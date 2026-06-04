import { NextRequest, NextResponse } from "next/server";
import { fetchPlaylistEpisodes } from "@/lib/youtube";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = await params;
  const episodes = await fetchPlaylistEpisodes(playlistId);
  return NextResponse.json({ episodes, count: episodes.length });
}
