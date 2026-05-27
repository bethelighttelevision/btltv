"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tv, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

function HLSPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const hlsRef = useRef<import("hls.js").default | null>(null);

  useEffect(() => {
    let hls: import("hls.js").default | null = null;
    const initPlayer = async () => {
      if (!videoRef.current) return;
      const Hls = (await import("hls.js")).default;
      const src = "https://livecdn.live247stream.com/btl/tv/playlist.m3u8";
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          startLevel: -1,
        });
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          videoRef.current?.play().catch(() => { });
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                if (retryCount < 3) {
                  setRetryCount((prev) => prev + 1);
                  hls?.startLoad();
                } else {
                  setError(true);
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls?.recoverMediaError();
                break;
              default:
                setError(true);
                break;
            }
          }
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = src;
        videoRef.current.addEventListener("loadeddata", () => setLoading(false));
        videoRef.current.addEventListener("error", () => setError(true));
        videoRef.current.play().catch(() => { });
      } else {
        setError(true);
      }
    };
    initPlayer();
    return () => {
      if (hls) hls.destroy();
    };
  }, [retryCount]);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setRetryCount(0);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white gap-4">
        <Tv className="h-12 w-12 text-btl-red" />
        <p className="text-sm text-white/70">Live stream temporarily unavailable</p>
        <div className="flex gap-3">
          <Button
            className="bg-btl-red hover:bg-btl-red-dark text-white min-h-[44px]"
            onClick={() => window.open("https://www.youtube.com/@btltv", "_blank")}
          >
            <Youtube className="h-4 w-4 mr-2" />
            Watch on YouTube
          </Button>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 min-h-[44px]"
            onClick={handleRetry}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
          <div className="h-10 w-10 border-2 border-btl-red border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-white/50">Connecting to live stream...</p>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        autoPlay
        playsInline
        muted
        controls
      />
    </div>
  );
}

export default HLSPlayer;
