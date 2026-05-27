"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import episodesData from "@/lib/episodes-data.json";

interface Episode {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  position: number;
}

interface Program {
  id: string;
  title: string;
  poster: string;
  category: string;
  description: string;
}

function getEpisodes(playlistId: string): Episode[] {
  return (episodesData.episodes as Record<string, Episode[]>)[playlistId] || [];
}

function getEpisodeCount(playlistId: string): number {
  return getEpisodes(playlistId).length;
}

function ProgramCard({
  program,
  onClick,
  size = "normal",
}: {
  program: Program;
  onClick: () => void;
  size?: "normal" | "small";
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="shrink-0 cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`relative overflow-hidden rounded-md bg-btl-card ${size === "small"
            ? "w-36 sm:w-44"
            : "w-44 sm:w-52"
          }`}
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={program.poster}
            alt={program.title}
            width={320}
            height={180}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-1.5 left-1.5 bg-btl-red/90 text-white text-[9px] font-bold px-1.5 py-0">
            {program.category}
          </Badge>
          <div className="absolute bottom-1.5 right-1.5 bg-black/60 rounded-full px-1.5 py-0 text-[9px] text-white flex items-center gap-0.5">
            <Play className="h-2.5 w-2.5 fill-white" />
            {getEpisodeCount(program.id)}
          </div>
        </div>
        <div className="pt-1.5 px-2 pb-2">
          <h3 className={`font-medium text-foreground truncate leading-tight ${size === "small" ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"
            }`}>
            {program.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

export default ProgramCard;
