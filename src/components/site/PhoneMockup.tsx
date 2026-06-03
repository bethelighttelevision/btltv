"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tv, Play, Flame, BookOpen, Smartphone } from "lucide-react";
import { PROGRAMS } from "@/lib/site-data";

const showPrograms = PROGRAMS.slice(0, 15);
const showNames = showPrograms.map((p) => p.title);
const showPosterMap = Object.fromEntries(showPrograms.map((p) => [p.title, p.poster]));
const categories = ["DEVOTIONAL", "TALK SHOW", "DRAMA", "DOCUMENTARY"] as const;
const categoryColors: Record<string, string> = {
  DEVOTIONAL: "bg-emerald-500",
  "TALK SHOW": "bg-blue-500",
  DRAMA: "bg-purple-500",
  DOCUMENTARY: "bg-amber-500",
  "SOCIAL ISSUES": "bg-orange-500",
};

function EqualizerBars() {
  const bars = useMemo(() => [0.4, 0.6, 0.5, 0.7, 0.3], []);
  return (
    <div className="flex items-end gap-[2px] h-6">
      {bars.map((freq, i) => (
        <motion.div
          key={i}
          className="w-[2.5px] bg-btl-red rounded-t"
          animate={{ scaleY: [1, 1.8, 1, 2.2, 1, 1.5, 1] }}
          transition={{ duration: freq + 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
          style={{ originY: 1, height: 12 }}
        />
      ))}
    </div>
  );
}

function WaveformBars() {
  const count = 18;
  return (
    <div className="flex items-center gap-[1.5px] h-8">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] bg-btl-red/70 rounded-t"
          animate={{ height: [4, 16 - Math.abs(i - count / 2) * 0.8 + Math.random() * 8, 4] }}
          transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
          style={{ originY: 1 }}
        />
      ))}
    </div>
  );
}

const screens = [
  {
    id: "home",
    label: "Home",
    icon: Tv,
    content: (
      <div className="p-2.5 space-y-2">
        <div className="relative h-28 md:h-32 rounded-xl overflow-hidden">
          <img src="/images/programs/debate.webp" alt="Debate" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-btl-red/10 mix-blend-overlay" />
          <div className="absolute bottom-2 left-2.5 right-2.5">
            <p className="text-[8px] md:text-[9px] text-btl-red font-bold uppercase tracking-wider">Featured</p>
            <p className="text-xs md:text-sm font-bold text-white mt-0.5">Debate</p>
            <p className="text-[6px] md:text-[7px] text-white/60 mt-0.5 truncate">Christian apologetics</p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 md:h-8 md:w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <div className="h-0 w-0 border-t-[4px] border-b-[4px] border-l-[7px] border-t-transparent border-b-transparent border-l-white ml-0.5" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[7px] md:text-[8px] text-white/60 font-medium uppercase tracking-wider">Trending</span>
            <span className="text-[6px] md:text-[7px] text-btl-red">See all</span>
          </div>
          <div className="flex gap-1.5 overflow-hidden">
            {showPrograms.slice(0, 4).map((p) => (
              <div key={p.title} className="shrink-0 w-14 md:w-16 rounded-lg overflow-hidden bg-white/5">
                <div className="h-8 md:h-10 relative">
                  <img src={p.poster} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <p className="text-[6px] md:text-[7px] text-white/60 px-1 pb-1 truncate">{p.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-0.5">
          {[Tv, Play, Flame, BookOpen].map((Icon, i) => (
            <div key={i} className={`h-5 w-5 md:h-6 md:w-6 rounded flex items-center justify-center ${i === 0 ? "bg-btl-red/20" : "bg-white/5"}`}>
              <Icon className={`h-2.5 w-2.5 md:h-3 md:w-3 ${i === 0 ? "text-btl-red" : "text-white/30"}`} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "shows",
    label: "Shows",
    icon: Play,
    content: (
      <div className="p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[8px] md:text-[9px] text-white font-semibold">All Shows</span>
          <div className="flex gap-1">
            <div className="h-1.5 w-4 rounded-full bg-btl-red" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {showPrograms.slice(0, 9).map((p, i) => {
            const cat = categories[i % categories.length];
            return (
              <div key={p.title} className="rounded-lg overflow-hidden bg-white/5">
                <div className="h-10 md:h-12 relative">
                  <img src={p.poster} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className={`absolute top-0.5 left-0.5 px-1 rounded-sm ${categoryColors[cat]} text-white font-semibold`}
                    style={{ fontSize: "5px", lineHeight: "1.2" }}
                  >
                    {cat.slice(0, 4)}
                  </div>
                </div>
                <p className="text-[6px] md:text-[7px] text-white/70 px-1 pb-1 truncate">{p.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
  {
    id: "live",
    label: "Live TV",
    icon: Flame,
    content: (
      <div className="p-2.5 space-y-2">
        <div className="h-28 md:h-32 rounded-xl overflow-hidden relative border border-white/5">
          <img src="/images/programs/connection.webp" alt="Live" className="absolute inset-0 w-full h-full object-cover" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-btl-red/15 via-black/40 to-black/60"
            animate={{ opacity: [0.6, 0.8, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <motion.div
                  className="h-2 w-2 rounded-full bg-btl-red"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[8px] md:text-[9px] text-btl-red font-bold tracking-widest">LIVE</span>
              </div>
              <div className="flex justify-center">
                <EqualizerBars />
              </div>
              <p className="text-[8px] md:text-[9px] text-white/70 mt-2 font-medium">Now Streaming</p>
              <p className="text-[7px] md:text-[8px] text-white/50">Connection</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <div className="space-y-1">
          <span className="text-[7px] md:text-[8px] text-white/50 uppercase tracking-wider">Up Next</span>
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-1.5">
            <div className="h-6 w-8 rounded overflow-hidden shrink-0 relative">
              <img src="/images/programs/295c.webp" alt="295C" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[7px] md:text-[8px] text-white/70 truncate font-medium">295C</p>
              <p className="text-[6px] md:text-[7px] text-white/40">Up next in 5 min</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "bible",
    label: "Bible",
    icon: BookOpen,
    content: (
      <div className="p-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[8px] md:text-[9px] text-white font-semibold">Audio Bible</span>
          <div className="h-4 w-4 rounded bg-btl-red/20 flex items-center justify-center">
            <BookOpen className="h-2.5 w-2.5 text-btl-red" />
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-btl-red/10 to-transparent border border-btl-red/20 p-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[7px] md:text-[8px] text-white/60">Now Playing</span>
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-btl-red"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          <p className="text-[9px] md:text-[10px] text-white font-semibold">Genesis</p>
          <p className="text-[7px] md:text-[8px] text-white/50">Chapter 1</p>
          <div className="flex justify-center py-1">
            <WaveformBars />
          </div>
          <div className="h-0.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-btl-red rounded-full"
              animate={{ width: ["0%", "45%", "32%", "58%", "41%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between text-[6px] md:text-[7px] text-white/40">
            <span>1:23</span>
            <span>31:45</span>
          </div>
        </div>
        <div className="space-y-0.5">
          {[1, 2, 3, 4].map((ch) => (
            <div key={ch} className="flex items-center justify-between rounded bg-white/5 px-2 py-1">
              <span className="text-[7px] md:text-[8px] text-white/60">Chapter {ch}</span>
              <span className="text-[6px] md:text-[7px] text-white/30">{Math.floor(20 + ch * 5)}:00</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function PhoneMockup() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % screens.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const current = screens[activeIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative shrink-0"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div
          className="relative w-[190px] h-[375px] md:w-[240px] md:h-[470px] rounded-[28px] md:rounded-[32px] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 50%, #0a0a0f 100%)",
            border: "1.5px solid rgba(255,255,255,0.08)",
            boxShadow: `
              0 0 0 1px rgba(229,9,20,0.08),
              0 8px 32px rgba(0,0,0,0.6),
              0 2px 8px rgba(0,0,0,0.3),
              0 20px 60px rgba(229,9,20,0.08),
              0 40px 80px rgba(0,0,0,0.4),
              inset 0 0 1px rgba(255,255,255,0.1)
            `,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.01) 100%)",
            }}
          />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
            <div className="relative w-20 h-[22px] md:w-24 md:h-[26px] bg-black rounded-b-2xl flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-800/60" />
            </div>
          </div>

          <div className="relative z-10 pt-[18px] md:pt-[22px] px-5 md:px-6 flex justify-between items-center">
            <span className="text-[7px] md:text-[8px] text-white/70 font-semibold tracking-tight">9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-[1px]">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-[2px] md:w-[2.5px] rounded-sm ${i <= 2 ? "bg-white/60" : "bg-white/20"}`} style={{ height: 5 + i * 2 }} />
                ))}
              </div>
              <div className="w-3.5 md:w-4 h-[7px] md:h-[8px] rounded-[2px] border border-white/30 relative ml-1">
                <div className="absolute inset-[1px] bg-white/50 rounded-[1px]" style={{ width: "70%" }} />
              </div>
            </div>
          </div>

          <div className="relative z-10 px-3 md:px-4 pt-1 md:pt-1.5 pb-0.5 flex items-center gap-2 border-b border-white/5">
            <div className="h-4 w-4 md:h-5 md:w-5 rounded-md bg-btl-red/20 flex items-center justify-center">
              <Smartphone className="h-2.5 w-2.5 md:h-3 md:w-3 text-btl-red" />
            </div>
            <span className="text-[8px] md:text-[9px] text-white font-semibold tracking-tight">BTL TV</span>
            <div className="ml-auto flex gap-1">
              <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white/15" />
              <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white/15" />
            </div>
          </div>

          <div className="relative" style={{ height: "calc(100% - 118px)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.8 }}
                className="absolute inset-0"
              >
                {current.content}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/90 backdrop-blur-xl border-t border-white/5">
            <div className="flex justify-around items-center py-1 md:py-1.5 px-1">
              {screens.map((screen, idx) => {
                const ScreenIcon = screen.icon;
                const isActive = idx === activeIndex;
                return (
                  <motion.button
                    key={screen.id}
                    className="flex flex-col items-center gap-[1px] px-2 py-0.5 relative w-12 md:w-14"
                    onClick={() => setActiveIndex(idx)}
                    whileTap={{ scale: 0.85 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="tab-bar-indicator"
                        className="absolute -top-1 left-2 right-2 h-[2px] bg-btl-red rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <ScreenIcon
                      className={`h-[14px] w-[14px] md:h-4 md:w-4 ${isActive ? "text-btl-red" : "text-white/35"}`}
                    />
                    <span
                      className={`text-[6px] md:text-[7px] leading-none ${isActive ? "text-btl-red font-semibold" : "text-white/35"}`}
                    >
                      {screen.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="absolute inset-0 rounded-[inherit] pointer-events-none ring-1 ring-white/[0.06] z-20" />
        </div>
      </motion.div>

      <motion.div
        className="absolute -inset-6 rounded-full -z-10"
        style={{ background: "radial-gradient(circle, rgba(229,9,20,0.08) 0%, transparent 70%)" }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-3 rounded-full -z-10"
        style={{ background: "radial-gradient(circle, rgba(229,9,20,0.04) 0%, transparent 60%)" }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </motion.div>
  );
}
