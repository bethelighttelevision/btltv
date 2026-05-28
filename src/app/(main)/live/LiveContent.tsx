"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Clock, Tv, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import HLSPlayer from "@/components/site/HLSPlayer";

export default function LiveContent() {
  return (
    <div className="min-h-screen">
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-btl-dark via-btl-dark to-btl-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.08),transparent_70%)]" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative flex items-center gap-2">
              <span className="animate-pulse-live inline-block h-3 w-3 rounded-full bg-btl-red shadow-[0_0_12px_rgba(229,9,20,0.6)]" />
              <Badge className="bg-btl-red text-white font-bold text-xs px-3 py-1 animate-pulse shadow-[0_0_16px_rgba(229,9,20,0.3)]">LIVE NOW</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Live TV</h1>
          </div>
          <p className="text-muted-foreground text-sm">Watch BTL TV live 24/7 — your source for Christian programming in Urdu.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-2">
        <div className="relative rounded-xl overflow-hidden shadow-[0_0_40px_rgba(229,9,20,0.1),0_20px_60px_rgba(0,0,0,0.5)] bg-black border border-white/5">
          <div className="aspect-video w-full"><HLSPlayer /></div>
          <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
            <div className="flex items-center gap-2">
              <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-6 w-auto object-contain opacity-80" />
              <span className="text-white/60 text-xs font-medium">BTL TV — Be The Light Television</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="animate-pulse-live h-2 w-2 rounded-full bg-btl-red" />
              <span className="text-white/60 text-[10px] uppercase tracking-wider font-bold">Live</span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
              <div className="flex items-center gap-3"><Flame className="h-5 w-5 text-btl-red" /><h3 className="text-lg font-bold text-foreground">Now Playing</h3><Badge className="bg-btl-red text-white text-[10px] px-2 py-0.5 animate-pulse">LIVE</Badge></div>
            </div>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-foreground">BTL TV Live Stream</h4>
                  <p className="text-sm text-muted-foreground mt-1">24/7 Christian programming in Urdu — devotional, talk shows, drama, and more.</p>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-btl-red hover:bg-btl-red-dark text-white min-h-[44px] shadow-[0_0_20px_rgba(229,9,20,0.2)]" onClick={() => window.open("https://www.youtube.com/@btltv", "_blank")}><Youtube className="h-4 w-4 mr-2" /> YouTube</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
              <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-btl-red" /><h3 className="text-lg font-bold text-foreground">Program Schedule</h3></div>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border/20">
                {[
                  { time: "6:00 AM", show: "Yesu Sang Sawera (Morning Devotional)" },
                  { time: "8:00 AM", show: "Ochtend met Jezus (Dutch Devotional)" },
                  { time: "10:00 AM", show: "Farman-e-Masih / Masihi Zindagi" },
                  { time: "12:00 PM", show: "Talk Shows & Discussions" },
                  { time: "2:00 PM", show: "Drama Series" },
                  { time: "4:00 PM", show: "Aap Ki Sehat (Health Program)" },
                  { time: "6:00 PM", show: "Documentary & Social Issues" },
                  { time: "8:00 PM", show: "Puray Dil Se (Worship)" },
                  { time: "10:00 PM", show: "Debate & Apologetics" },
                ].map((item) => (
                  <div key={item.time} className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors">
                    <span className="text-sm font-mono text-btl-red w-20 shrink-0">{item.time}</span>
                    <span className="text-sm text-foreground">{item.show}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
