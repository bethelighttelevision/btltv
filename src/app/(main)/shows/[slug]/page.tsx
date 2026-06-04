import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { fetchPlaylistEpisodes } from "@/lib/youtube";
import ShowDetailClient from "./ShowDetailClient";
import type { Metadata } from "next";
import type { Program, Episode } from "@/lib/programs";

interface Props {
  params: Promise<{ slug: string }>;
}

function toProgram(show: { id: string; title: string; slug: string; thumbnail: string | null; category: string; description: string | null }): Program {
  return { id: show.id, title: show.title, slug: show.slug, poster: show.thumbnail || "/images/programs/placeholder.webp", category: show.category.toUpperCase(), description: show.description || "" };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const show = await prisma.show.findUnique({ where: { slug } });
  if (!show) return { title: "Show Not Found — BTL TV" };

  return {
    title: `${show.title} — BTL TV Shows`,
    description: show.description || `Watch ${show.title} on BTL TV. Urdu Christian program with episodes, teachings, and more.`,
    alternates: { canonical: `https://btl-tv.com/shows/${slug}` },
    openGraph: {
      title: `${show.title} — BTL TV`,
      description: show.description || `Watch ${show.title} on BTL TV.`,
      type: "video.tv_show",
      url: `https://btl-tv.com/shows/${slug}`,
      images: [{ url: show.thumbnail || "/images/programs/placeholder.webp", width: 1280, height: 720 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${show.title} — BTL TV`,
      description: show.description || "",
      images: [show.thumbnail || "/images/programs/placeholder.webp"],
    },
  };
}

export default async function ShowDetailPage({ params }: Props) {
  const { slug } = await params;
  const show = await prisma.show.findUnique({ where: { slug } });
  if (!show) notFound();

  const playlistId = show.playlistId || show.id;
  const ytEpisodes = await fetchPlaylistEpisodes(playlistId);
  const episodes: Episode[] = ytEpisodes.map((e, i) => ({
    videoId: e.videoId,
    title: e.title,
    thumbnail: e.thumbnail,
    duration: "",
    channel: e.channel,
    position: e.position || i + 1,
  }));

  return <ShowDetailClient program={toProgram(show)} episodes={episodes} />;
}
