"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Clock, Tv, Youtube, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import HLSPlayer from "@/components/site/HLSPlayer";

export default function LiveContent() {
  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public?page=live", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setLiveData(data?.live || null))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
      </div>
    );
  }

  const isLive = liveData?.isLive === true;
  const streamUrl = liveData?.streamUrl || "";
  const offlineMsg = liveData?.offlineMessage || "";
  const schedule = liveData?.schedule || "";

  return (
    <div className="min-h-screen">
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-btl-dark via-btl-dark to-btl-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.08),transparent_70%)]" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded-full ${isLive ? "bg-btl-red animate-pulse shadow-[0_0_12px_rgba(229,9,20,0.6)]" : "bg-gray-500"}`} />
              <Badge className={`${isLive ? "bg-btl-red animate-pulse" : "bg-gray-600"} text-white font-bold text-xs px-3 py-1`}>
                {isLive ? "LIVE NOW" : "OFFLINE"}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Live TV</h1>
          </div>
          <p className="text-muted-foreground text-sm">Watch BTL TV live 24/7 — your source for Christian programming in Urdu.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-2">
        <div className="relative rounded-xl overflow-hidden shadow-[0_0_40px_rgba(229,9,20,0.1),0_20px_60px_rgba(0,0,0,0.5)] bg-black border border-white/5">
          <div className="aspect-video w-full">
            {streamUrl ? <HLSPlayer src={streamUrl} /> : <HLSPlayer />}
          </div>
          <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
            <div className="flex items-center gap-2">
              <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-6 w-auto object-contain opacity-80" />
              <span className="text-white/60 text-xs font-medium">BTL TV — Be The Light Television</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isLive ? "bg-btl-red animate-pulse" : "bg-gray-500"}`} />
              <span className="text-white/60 text-[10px] uppercase tracking-wider font-bold">{isLive ? "Live" : "Offline"}</span>
            </div>
          </div>
        </div>

        {!isLive && offlineMsg && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm text-center">
            {offlineMsg}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <Card className="bg-btl-card border-btl-card-border overflow-hidden">
            <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
              <div className="flex items-center gap-3">
                <Flame className="h-5 w-5 text-btl-red" />
                <h3 className="text-lg font-bold text-foreground">Now Playing</h3>
                <Badge className={`${isLive ? "bg-btl-red animate-pulse" : "bg-gray-600"} text-white text-[10px] px-2 py-0.5`}>
                  {isLive ? "LIVE" : "OFFLINE"}
                </Badge>
              </div>
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

          {schedule && (
            <Card className="bg-btl-card border-btl-card-border overflow-hidden">
              <div className="bg-gradient-to-r from-btl-red/10 to-transparent p-4 md:p-6 border-b border-btl-card-border">
                <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-btl-red" /><h3 className="text-lg font-bold text-foreground">Schedule</h3></div>
              </div>
              <CardContent className="p-4 md:p-6">
                <p className="text-sm text-muted-foreground whitespace-pre-line">{schedule}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
