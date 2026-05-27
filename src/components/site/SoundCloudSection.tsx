"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Headphones } from "lucide-react";

const SOUNDCLOUD_PLAYLISTS = [
  { slug: "khuda-kon-hai", title: "Khuda Kon Hai", titleUr: "خدا کون ہے", icon: "✝️" },
  { slug: "merry-christmas", title: "Merry Christmas", titleUr: "میری کرسمس", icon: "🎄" },
  { slug: "abraham-sarah", title: "Abraham & Sarah", titleUr: "ابراہیم اور سارہ", icon: "📖" },
  { slug: "the-story-of-jacob-from-bible", title: "Story of Jacob", titleUr: "یعقوب کی کہانی", icon: "📖" },
  { slug: "the-story-of-noah-from-bible", title: "Story of Noah", titleUr: "نوح کی کہانی", icon: "⛵" },
  { slug: "the-story-of-noah-for-kids", title: "Noah for Kids", titleUr: "بچوں کے لیے نوح", icon: "🧒" },
  { slug: "beauty-with-brain-queen-esther", title: "Queen Esther", titleUr: "ملکہ استر", icon: "👑" },
  { slug: "adam-eve", title: "Adam & Eve", titleUr: "آدم اور حوا", icon: "🍎" },
  { slug: "urdu-zaboor-by-sumble-noreen-arrangement-dr-khizan-bashir", title: "Urdu Zaboor", titleUr: "اردو زبور", icon: "🎵" },
  { slug: "the-story-of-mary-sister-of", title: "Story of Mary", titleUr: "مریم کی کہانی", icon: "🙏" },
];

function SoundCloudSection() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(SOUNDCLOUD_PLAYLISTS[0]);

  const embedUrl = `https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/user-549013936/sets/${selectedPlaylist.slug}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;

  return (
    <section className="relative py-12 overflow-hidden bg-[#050505] border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff5500]/10 via-[#050505] to-[#050505] opacity-50"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5500]/10 border border-[#ff5500]/20 mb-3 shadow-[0_0_10px_rgba(255,85,0,0.1)]">
              <Headphones className="h-3.5 w-3.5 text-[#ff5500]" />
              <span className="text-[#ff5500] text-[10px] font-bold tracking-widest uppercase">TWR Urdu & Punjabi</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-md">
              Spiritual Audio <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5500] to-btl-red">Library</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-sm font-urdu text-right" dir="rtl">
            آڈیو کہانیوں اور زبور کے ذریعے خدا کی آواز سنیں۔
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Playlists Sidebar - Compact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 flex flex-col gap-3 bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl shadow-xl"
          >
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar max-h-[380px] overflow-y-auto pr-1">
              {SOUNDCLOUD_PLAYLISTS.map((pl) => (
                <button
                  key={pl.slug}
                  onClick={() => setSelectedPlaylist(pl)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 whitespace-nowrap md:whitespace-normal shrink-0 border text-left ${selectedPlaylist.slug === pl.slug
                      ? "bg-gradient-to-r from-[#ff5500]/10 to-transparent border-[#ff5500]/30 shadow-[0_0_15px_rgba(255,85,0,0.1)]"
                      : "bg-black/20 border-transparent hover:bg-white/5"
                    }`}
                >
                  <div className={`text-xl h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedPlaylist.slug === pl.slug ? "bg-[#ff5500]/20" : "bg-white/5"}`}>
                    {pl.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${selectedPlaylist.slug === pl.slug ? "text-white" : "text-gray-300"}`}>
                      {pl.title}
                    </p>
                    <p className="text-xs font-urdu text-gray-500 mt-0.5 truncate" dir="rtl">{pl.titleUr}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Player Main Area - Compact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <div className="relative rounded-2xl bg-[#0a0a0a] border border-white/10 p-3 shadow-2xl overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ff5500]/5 blur-[80px] pointer-events-none transition-opacity duration-700 opacity-30 group-hover:opacity-60"></div>

              <div className="relative z-10 flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5500] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5500]"></span>
                  </span>
                  <p className="text-[10px] text-[#ff5500] font-bold uppercase tracking-wider">Now Playing</p>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-black shadow-[inset_0_1px_10px_rgba(0,0,0,1)] border border-white/5">
                <iframe
                  key={selectedPlaylist.slug}
                  width="100%"
                  height="350"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  loading="lazy"
                  src={embedUrl}
                  className="w-full relative z-10 block"
                  title={`BTL TV - ${selectedPlaylist.title}`}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default SoundCloudSection;
