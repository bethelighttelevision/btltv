"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Search,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getEpisodes,
  getEpisodeCount,
  PROGRAMS,
  KIDS_PROGRAMS,
  CATEGORIES,
  decodeHtmlEntities,
} from "@/lib/site-data";
import ProgramCard from "@/components/site/ProgramCard";

function ShowsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedShow = searchParams.get("id");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Show detail view
  if (selectedShow) {
    const program = PROGRAMS.find((p) => p.id === selectedShow) || KIDS_PROGRAMS.find((p) => p.id === selectedShow);
    if (!program) return null;
    const episodes = getEpisodes(selectedShow);

    return (
      <div className="min-h-screen">
        {playingVideo && (
          <div className="w-full aspect-video max-h-[70vh] bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video Player"
            />
          </div>
        )}

        <div className="px-4 md:px-6 py-6">
          <Link href="/shows">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shows
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/5 lg:w-1/3 shrink-0">
              <div className="relative rounded-lg shadow-xl bg-btl-dark overflow-hidden">
                <div className="aspect-[16/9] md:aspect-[4/3]">
                  <img
                    src={program.poster}
                    alt={program.title}
                    width={1280}
                    height={720}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3">
                  <Badge className="bg-btl-red/90 text-white text-xs font-bold mb-2">{program.category}</Badge>
                  <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">{program.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-white/70 mt-1">
                    <Play className="h-3.5 w-3.5" />
                    {episodes.length} Episodes
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <p className="text-muted-foreground text-sm">{program.description}</p>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-4">Episodes</h2>
              <div className="grid gap-3">
                {episodes.map((ep) => (
                  <motion.div
                    key={ep.videoId + ep.position}
                    whileHover={{ scale: 1.01 }}
                    className="cursor-pointer"
                    onClick={() => setPlayingVideo(ep.videoId)}
                  >
                    <Card className="bg-btl-card border-btl-card-border hover:border-btl-red/30 transition-all overflow-hidden">
                      <CardContent className="p-3 flex gap-4 items-center">
                        <div className="relative w-40 sm:w-48 shrink-0 aspect-video rounded overflow-hidden bg-black">
                          <img
                            src={ep.thumbnail}
                            alt={decodeHtmlEntities(ep.title)}
                            width={320}
                            height={180}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                            <div className="h-10 w-10 rounded-full bg-btl-red/90 flex items-center justify-center">
                              <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                          <Badge className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0">
                            EP{ep.position}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-foreground line-clamp-2">
                            {decodeHtmlEntities(ep.title)}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">Episode {ep.position}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Shows grid view - same landscape card style
  const allCategories = ["ALL", ...Object.keys(CATEGORIES)];
  const filtered = PROGRAMS.filter((p) => {
    const matchCategory = filterCategory === "ALL" || p.category === filterCategory;
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen px-4 md:px-6 py-6">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">All Shows</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shows..."
            className="pl-10 bg-white/5 border-border/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allCategories.map((cat) => (
            <Button
              key={cat}
              variant={filterCategory === cat ? "default" : "outline"}
              size="sm"
              className={
                filterCategory === cat
                  ? "bg-btl-red hover:bg-btl-red-dark text-white"
                  : "border-border/50 text-muted-foreground hover:text-foreground"
              }
              onClick={() => setFilterCategory(cat)}
            >
              {cat === "ALL" ? "All" : CATEGORIES[cat]?.label || cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Shows Grid - Same landscape cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {filtered.map((program) => (
          <motion.div
            key={program.id}
            whileHover={{ y: -4 }}
            className="cursor-pointer"
            onClick={() => router.push(`/shows?id=${program.id}`)}
          >
            <div className="overflow-hidden rounded-md bg-btl-card hover:ring-1 hover:ring-btl-red/30 transition-all">
              <div className="relative aspect-video overflow-hidden">
                <img src={program.poster} alt={program.title} width={320} height={180} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-1.5 left-1.5 bg-btl-red/90 text-white text-[9px] font-bold px-1.5 py-0">
                  {program.category}
                </Badge>
                <div className="absolute bottom-1.5 right-1.5 bg-black/60 rounded-full px-1.5 py-0 text-[9px] text-white flex items-center gap-0.5">
                  <Play className="h-2.5 w-2.5 fill-white" />
                  {getEpisodeCount(program.id)}
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-medium text-[11px] sm:text-xs text-foreground truncate">{program.title}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ShowsPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-2 border-btl-red border-t-transparent" /></div>}>
      <ShowsPage />
    </Suspense>
  );
}
