import { getProgramBySlug, ALL_SHOWS, getEpisodes } from "@/lib/programs";
import type { Metadata } from "next";
import ShowDetailClient from "./ShowDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_SHOWS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) return { title: "Show Not Found — BTL TV" };

  const episodes = getEpisodes(program.id);

  return {
    title: `${program.title} — BTL TV Shows`,
    description: program.description,
    alternates: { canonical: `https://btl-tv.com/shows/${slug}` },
    openGraph: {
      title: `${program.title} — BTL TV`,
      description: program.description,
      url: `https://btl-tv.com/shows/${slug}`,
      images: [{ url: program.poster, width: 1280, height: 720 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${program.title} — BTL TV`,
      description: program.description,
      images: [program.poster],
    },
  };
}

export default async function ShowDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  const episodes = getEpisodes(program.id);

  return <ShowDetailClient program={program} episodes={episodes} />;
}
