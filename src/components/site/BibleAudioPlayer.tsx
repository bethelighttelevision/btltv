"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BibleAudioPlayerProps {
  audioUrl?: string;
  title?: string;
}

export default function BibleAudioPlayer({ audioUrl, title }: BibleAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;
    let mounted = true;

    setLoadError(false);
    setIsReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setLocalLoading(true);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const audio = new Audio(audioUrl);
    audio.preload = "auto";
    audio.volume = volume;

    audio.addEventListener("loadedmetadata", () => {
      if (!mounted) return;
      setDuration(audio.duration);
    });

    audio.addEventListener("canplay", () => {
      if (!mounted) return;
      setIsReady(true);
      setLoadError(false);
      setLocalLoading(false);
    });

    audio.addEventListener("timeupdate", () => {
      if (!mounted) return;
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      if (!mounted) return;
      setIsPlaying(false);
    });

    audio.addEventListener("error", () => {
      if (!mounted) return;
      setLoadError(true);
      setLocalLoading(false);
    });

    audio.addEventListener("play", () => {
      if (mounted) setIsPlaying(true);
    });

    audio.addEventListener("pause", () => {
      if (mounted) setIsPlaying(false);
    });

    audioRef.current = audio;

    return () => {
      mounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => setLoadError(true));
    } else {
      audioRef.current.pause();
    }
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    const t = Math.max(0, audioRef.current.currentTime - 10);
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    const t = Math.min(duration, audioRef.current.currentTime + 10);
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = v;
      audioRef.current.muted = false;
    }
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

      {/* Decorative waveform bars */}
      <div className="flex items-end justify-center gap-[2px] h-16">
        {[...Array(48)].map((_, i) => {
          const baseH = 4 + Math.abs(Math.sin(i * 0.5)) * 24;
          const wave = isPlaying ? Math.abs(Math.sin(i * 0.2 + Date.now() * 0.003)) * 20 : 0;
          const progress = duration > 0 ? currentTime / duration : 0;
          const barPos = i / 48;
          const isPlayed = barPos <= progress;
          return (
            <div
              key={i}
              className="w-[2px] rounded-full transition-all duration-100"
              style={{
                height: `${baseH + wave}px`,
                backgroundColor: isReady && isPlayed ? '#e50914' : isReady && isPlayed ? 'rgba(229, 9, 20, 0.5)' : 'rgba(255,255,255,0.08)',
                opacity: localLoading ? 0.4 : 0.85,
              }}
            />
          );
        })}
      </div>

      {/* Waveform space (kept for future use) */}
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
