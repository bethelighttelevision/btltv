"use client";

import React from "react";
import { motion } from "framer-motion";
import { Baby, Play, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KIDS_PROGRAMS, getEpisodeCount } from "@/lib/site-data";

export default function KidsContent() {
  return (
    <div className="min-h-screen">
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-btl-red/20 via-btl-dark to-btl-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.1),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3"><Sparkles className="h-8 w-8 text-btl-red" /></div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">BTL Kids</h1>
            <p className="text-white/60 text-sm mt-3 max-w-md mx-auto">Fun and faith-filled programs for children — Bible stories, prophecies, and more!</p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {KIDS_PROGRAMS.map((program) => (
            <motion.div key={program.id} whileHover={{ y: -6, scale: 1.02 }} className="cursor-pointer" onClick={() => window.location.href = '/shows/' + program.slug}>
              <Card className="bg-btl-card border-btl-card-border hover:border-btl-red/30 transition-all overflow-hidden h-full">
                <div className="relative aspect-video overflow-hidden">
                  <img src={program.poster} alt={program.title} width={320} height={180} loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <Badge className="absolute top-2 left-2 bg-btl-red text-black text-[10px] font-bold px-2 py-0.5">KIDS</Badge>
                  <div className="absolute bottom-2 right-2 bg-black/60 rounded-full px-2 py-0.5 text-[10px] text-white flex items-center gap-1">
                    <Play className="h-3 w-3 fill-white" /> {getEpisodeCount(program.id)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                    <div className="h-14 w-14 rounded-full bg-btl-red/90 flex items-center justify-center shadow-lg">
                      <Play className="h-6 w-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground text-base leading-tight">{program.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{program.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Sparkles className="h-3.5 w-3.5 text-btl-red" />
                    <span className="text-xs text-btl-red font-medium">{getEpisodeCount(program.id)} Episodes</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
