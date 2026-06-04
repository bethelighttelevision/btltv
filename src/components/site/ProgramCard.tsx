"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Program {
  id: string;
  title: string;
  poster: string;
  category: string;
  description: string;
}

function ProgramCard({
  program,
  onClick,
  size = "normal",
  episodeCount,
}: {
  program: Program;
  onClick: () => void;
  size?: "normal" | "small";
  episodeCount?: number;
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
            decoding="async"
            sizes="(max-width: 640px) 160px, 220px"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-1.5 left-1.5 bg-btl-red/90 text-white text-[9px] font-bold px-1.5 py-0">
            {program.category}
          </Badge>
          {episodeCount !== undefined && (
            <div className="absolute bottom-1.5 right-1.5 bg-black/60 rounded-full px-1.5 py-0 text-[9px] text-white flex items-center gap-0.5">
              <Play className="h-2.5 w-2.5 fill-white" />
              {episodeCount}
            </div>
          )}
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
