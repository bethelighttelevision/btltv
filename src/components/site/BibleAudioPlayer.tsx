"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BibleAudioPlayerProps {
  audioUrl?: string;
  title?: string;
}

export default function BibleAudioPlayer({ audioUrl, title }: BibleAudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!audioUrl || !containerRef.current) return;

    let mounted = true;
    let ws: any = null;

    const init = async () => {
      try {
        const WaveSurfer = (await import("wavesurfer.js")).default;
        ws = WaveSurfer.create({
          container: containerRef.current!,
          waveColor: "rgba(229, 9, 20, 0.3)",
          progressColor: "#e50914",
          cursorColor: "#e50914",
          cursorWidth: 1,
          barWidth: 2,
          barGap: 1,
          barRadius: 2,
          height: 64,
          normalize: true,
          backend: "WebAudio",
        });

        ws.load(audioUrl);

        ws.on("ready", () => {
          if (!mounted) return;
          setIsReady(true);
          setDuration(ws.getDuration());
          setLoadError(false);
        });

        ws.on("audioprocess", () => {
          if (!mounted) return;
          setCurrentTime(ws.getCurrentTime());
        });

        ws.on("play", () => {
          if (!mounted) return;
          setIsPlaying(true);
        });

        ws.on("pause", () => {
          if (!mounted) return;
          setIsPlaying(false);
        });

        ws.on("finish", () => {
          if (!mounted) return;
          setIsPlaying(false);
        });

        ws.on("error", () => {
          if (!mounted) return;
          setLoadError(true);
        });

        wavesurferRef.current = ws;
      } catch {
        if (mounted) setLoadError(true);
      }
    };

    init();

    return () => {
      mounted = false;
      if (ws) {
        try { ws.destroy(); } catch {}
        wavesurferRef.current = null;
      }
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
  };

  const skipBackward = () => {
    if (!wavesurferRef.current) return;
    const t = Math.max(0, wavesurferRef.current.getCurrentTime() - 10);
    wavesurferRef.current.setTime(t);
    setCurrentTime(t);
  };

  const skipForward = () => {
    if (!wavesurferRef.current) return;
    const t = Math.min(duration, wavesurferRef.current.getCurrentTime() + 10);
    wavesurferRef.current.setTime(t);
    setCurrentTime(t);
  };

  const toggleMute = () => {
    if (!wavesurferRef.current) return;
    const newMuted = !isMuted;
    wavesurferRef.current.setVolume(newMuted ? 0 : volume);
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(false);
    if (wavesurferRef.current) wavesurferRef.current.setVolume(v);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!audioUrl) return null;

  if (loadError) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
        <p className="text-sm text-red-400">Audio could not be loaded. The file may not exist or is in an unsupported format.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-3">
      {title && (
        <p className="text-xs text-gray-400 font-medium truncate">{title}</p>
      )}

      <div ref={containerRef} className="w-full" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={skipBackward}
            disabled={!isReady}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-btl-red hover:bg-btl-red-dark text-white"
            onClick={togglePlay}
            disabled={!isReady}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={skipForward}
            disabled={!isReady}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-gray-400 font-mono tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : volume < 0.5 ? (
              <Volume1 className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 accent-btl-red"
          />
        </div>
      </div>
    </div>
  );
}
