"use client";

import { useState } from "react";
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

const SC_BASE = "https://soundcloud.com/user-549013936/sets";

function SoundCloudSection() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(SOUNDCLOUD_PLAYLISTS[0]);

  const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(`${SC_BASE}/${selectedPlaylist.slug}`)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=true&buying=false&liking=false&sharing=false&download=false`;

  return (
    <section className="relative py-12 overflow-hidden bg-[#050505] border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff5500]/10 via-[#050505] to-[#050505] opacity-50" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

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

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Playlists Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3 shadow-xl">
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[520px] pb-1 lg:pb-0 hide-scrollbar">
                {SOUNDCLOUD_PLAYLISTS.map((pl) => (
                  <button
                    key={pl.slug}
                    onClick={() => setSelectedPlaylist(pl)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 shrink-0 border text-left ${
                      selectedPlaylist.slug === pl.slug
                        ? "bg-gradient-to-r from-[#ff5500]/10 to-transparent border-[#ff5500]/30 shadow-[0_0_15px_rgba(255,85,0,0.1)]"
                        : "bg-black/20 border-transparent hover:bg-white/5"
                    }`}
                  >
                    <div className={`text-lg h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      selectedPlaylist.slug === pl.slug ? "bg-[#ff5500]/20" : "bg-white/5"
                    }`}>
                      {pl.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-bold text-sm truncate max-w-[140px] ${
                        selectedPlaylist.slug === pl.slug ? "text-white" : "text-gray-300"
                      }`}>
                        {pl.title}
                      </p>
                      <p className="text-xs font-urdu text-gray-500 mt-0.5 truncate max-w-[140px]" dir="rtl">{pl.titleUr}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Player */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-black/40 mx-2 my-2 rounded-xl overflow-hidden border border-white/5">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="350"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  title={`BTL TV - ${selectedPlaylist.title}`}
                  className="w-full block"
                  key={selectedPlaylist.slug}
                />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default SoundCloudSection;
