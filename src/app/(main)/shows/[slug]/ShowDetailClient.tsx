"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play, ListVideo, ThumbsUp, Share2, MessageCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Program, Episode } from "@/lib/programs";

export default function ShowDetailClient({
  program,
  episodes,
}: {
  program: Program;
  episodes: Episode[];
}) {
  const router = useRouter();
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [currentEpIndex, setCurrentEpIndex] = useState(0);

  useEffect(() => {
    if (episodes.length > 0) {
      setPlayingVideo(episodes[0].videoId);
      setCurrentEpIndex(0);
    }
  }, [episodes]);

  const playEpisode = (index: number) => {
    if (index >= 0 && index < episodes.length) {
      setPlayingVideo(episodes[index].videoId);
      setCurrentEpIndex(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentEp = episodes[currentEpIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Player + Info — Left sidebar layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <Link href="/shows">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground mb-3 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shows
          </Button>
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left main content */}
          <div className="flex-1 min-w-0">
            {/* Video player */}
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              {playingVideo ? (
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentEp?.title || program.title}
                />
              ) : episodes.length > 0 ? (
                <div className="w-full h-full flex items-center justify-center bg-btl-darker">
                  <Play className="h-16 w-16 text-white/30" />
                </div>
              ) : null}
            </div>

            {/* Video info below player */}
            <div className="mt-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                    {decodeHtmlEntities(currentEp?.title || program.title)}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <Badge className="bg-btl-red/90 text-white text-xs font-bold">
                      {program.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      <ListVideo className="h-3.5 w-3.5 inline mr-1" />
                      {episodes.length} {episodes.length === 1 ? "Episode" : "Episodes"}
                    </span>
                    {currentEp && (
                      <span className="text-sm text-muted-foreground">
                        Episode {currentEp.position}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {program.description}
              </p>

              {/* Engagement buttons */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
                <a
                  href={currentEp ? `https://www.youtube.com/watch?v=${currentEp.videoId}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium bg-white/5 hover:bg-white/10 text-foreground transition-colors"
                >
                  <ThumbsUp className="h-3 sm:h-3.5 w-3 sm:w-3.5" /> Like
                </a>
                <button
                  onClick={() => {
                    const url = currentEp
                      ? `https://www.youtube.com/watch?v=${currentEp.videoId}`
                      : window.location.href;
                    if (navigator.share) {
                      navigator.share({ title: currentEp?.title || program.title, url });
                    } else {
                      navigator.clipboard.writeText(url);
                    }
                  }}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium bg-white/5 hover:bg-white/10 text-foreground transition-colors"
                >
                  <Share2 className="h-3 sm:h-3.5 w-3 sm:w-3.5" /> Share
                </button>
                <a
                  href={currentEp ? `https://www.youtube.com/watch?v=${currentEp.videoId}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium bg-white/5 hover:bg-white/10 text-foreground transition-colors"
                >
                  <MessageCircle className="h-3 sm:h-3.5 w-3 sm:w-3.5" /> Comment
                </a>
                <a
                  href="https://www.youtube.com/channel/UCQDWVxk6usW0vMV-5CXApwg?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium bg-btl-red hover:bg-btl-red-dark text-white transition-colors"
                >
                  <Bell className="h-3 sm:h-3.5 w-3 sm:w-3.5" /> Subscribe
                </a>
              </div>
            </div>

            {/* Full episode list (mobile/tablet: after info; desktop: below info) */}
            <div className="mt-8 lg:hidden">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <ListVideo className="h-5 w-5 text-btl-red" /> All Episodes
              </h2>
              <EpisodeList
                episodes={episodes}
                currentEpIndex={currentEpIndex}
                onPlay={playEpisode}
              />
            </div>
          </div>

          {/* Right sidebar — Up next (desktop only) */}
          <div className="hidden lg:block w-[380px] shrink-0">
            <div className="sticky top-20">
              <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Play className="h-4 w-4 text-btl-red" /> Up Next
              </h2>
              <div className="space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 custom-scrollbar">
                {episodes.map((ep, i) => (
                  <EpisodeRow
                    key={ep.videoId + ep.position}
                    episode={ep}
                    index={i}
                    isActive={i === currentEpIndex}
                    onPlay={() => playEpisode(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EpisodeList({
  episodes,
  currentEpIndex,
  onPlay,
}: {
  episodes: Episode[];
  currentEpIndex: number;
  onPlay: (index: number) => void;
}) {
  return (
    <div className="space-y-2">
      {episodes.map((ep, i) => (
        <EpisodeRow
          key={ep.videoId + ep.position}
          episode={ep}
          index={i}
          isActive={i === currentEpIndex}
          onPlay={() => onPlay(i)}
        />
      ))}
    </div>
  );
}

function EpisodeRow({
  episode,
  index,
  isActive,
  onPlay,
}: {
  episode: Episode;
  index: number;
  isActive: boolean;
  onPlay: () => void;
}) {
  return (
    <button
      onClick={onPlay}
      className={`w-full text-left flex gap-3 p-2 rounded-lg transition-all group ${
        isActive
          ? "bg-btl-red/10 ring-1 ring-btl-red/30"
          : "hover:bg-white/5"
      }`}
    >
      <div className="relative w-40 shrink-0 aspect-video rounded overflow-hidden bg-black">
        <img
          src={episode.thumbnail}
          alt={episode.title}
          width={160}
          height={90}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="h-8 w-8 rounded-full bg-btl-red/90 flex items-center justify-center">
              <Play className="h-3.5 w-3.5 text-white fill-white ml-0.5" />
            </div>
          </div>
        )}
        <Badge className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0">
          EP{episode.position}
        </Badge>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug line-clamp-2 ${
          isActive ? "text-btl-red" : "text-foreground group-hover:text-white"
        }`}>
          {decodeHtmlEntities(episode.title)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Episode {episode.position}
        </p>
      </div>
    </button>
  );
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const router = useRouter();
  return (
    <a href={href} onClick={(e) => { e.preventDefault(); router.push(href); }} className={className}>
      {children}
    </a>
  );
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
