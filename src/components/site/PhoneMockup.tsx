"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tv, Play, Flame, BookOpen, Smartphone } from "lucide-react";

const screens = [
  {
    id: "home",
    label: "Home",
    icon: Tv,
    content: (
      <div className="p-3 space-y-2">
        <div className="h-20 rounded-lg bg-gradient-to-r from-btl-red/30 to-purple-500/20 flex items-center justify-center">
          <p className="text-[10px] text-white font-semibold">Featured Content</p>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 rounded bg-white/5" />
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
      <div className="p-3 space-y-1.5">
        {["Debate", "Connection", "Family Matters", "Healing Grace"].map((s) => (
          <div key={s} className="flex items-center gap-2 p-1.5 rounded bg-white/5">
            <div className="h-6 w-6 rounded bg-btl-red/30" />
            <span className="text-[9px] text-white">{s}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "live",
    label: "Live TV",
    icon: Flame,
    content: (
      <div className="p-3 space-y-2">
        <div className="h-24 rounded-lg bg-gradient-to-b from-btl-red/40 to-black/60 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-btl-red flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-btl-red animate-pulse" />
            </div>
          </div>
          <p className="text-[8px] text-white/70 absolute bottom-2">LIVE</p>
        </div>
      </div>
    ),
  },
  {
    id: "bible",
    label: "Bible",
    icon: BookOpen,
    content: (
      <div className="p-3 space-y-1">
        <p className="text-[9px] text-white/60 mb-1">Genesis</p>
        {[1, 2, 3, 4, 5].map((c) => (
          <div key={c} className="h-5 rounded bg-white/5 flex items-center px-2">
            <span className="text-[7px] text-white/50">Chapter {c}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function PhoneMockup() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % screens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = screens[activeIndex];
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative shrink-0"
    >
      {/* Phone frame */}
      <div className="relative w-[180px] h-[360px] md:w-[220px] md:h-[440px] rounded-[24px] md:rounded-[28px] border-2 border-white/10 bg-black shadow-2xl overflow-hidden"
        style={{
          boxShadow: "0 0 60px rgba(229,9,20,0.15), 0 0 120px rgba(229,9,20,0.05), inset 0 0 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 md:w-24 md:h-6 bg-black rounded-b-xl z-10">
          <div className="w-2 h-2 rounded-full bg-gray-800 mx-auto mt-1.5 md:mt-2" />
        </div>

        {/* Status bar */}
        <div className="pt-1.5 px-4 md:pt-2 md:px-5 flex justify-between items-center text-[7px] md:text-[8px] text-white/60">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-1.5 md:w-4 md:h-2 border border-white/30 rounded-sm relative">
              <div className="absolute inset-0.5 bg-white/40 rounded-sm" />
            </div>
          </div>
        </div>

        {/* App header */}
        <div className="px-3 pt-1 md:px-4 md:pt-1.5 flex items-center gap-2">
          <div className="h-4 w-4 md:h-5 md:w-5 rounded bg-btl-red/30 flex items-center justify-center">
            <Smartphone className="h-2.5 w-2.5 md:h-3 md:w-3 text-btl-red" />
          </div>
          <span className="text-[8px] md:text-[9px] text-white font-semibold">BTL TV</span>
        </div>

        {/* Screen content */}
        <div className="flex-1 relative" style={{ height: "calc(100% - 100px)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {current.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom tab bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/5">
          <div className="flex justify-around py-1 md:py-1.5">
            {screens.map((screen, idx) => {
              const ScreenIcon = screen.icon;
              const isActive = idx === activeIndex;
              return (
                <motion.button
                  key={screen.id}
                  className="flex flex-col items-center gap-0.5 px-2 py-0.5 relative"
                  onClick={() => setActiveIndex(idx)}
                  whileTap={{ scale: 0.9 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute -top-1 left-0 right-0 h-0.5 bg-btl-red rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <ScreenIcon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${isActive ? "text-btl-red" : "text-white/40"}`} />
                  <span className={`text-[6px] md:text-[7px] ${isActive ? "text-btl-red font-semibold" : "text-white/40"}`}>
                    {screen.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Glow overlay */}
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] ring-1 ring-white/5" />
      </div>

      {/* Glow effect behind phone */}
      <div className="absolute -inset-4 bg-btl-red/5 rounded-full blur-3xl -z-10" />
    </motion.div>
  );
}
