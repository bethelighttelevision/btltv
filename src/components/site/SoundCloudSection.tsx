import { Headphones, ExternalLink, Music } from "lucide-react";

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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {SOUNDCLOUD_PLAYLISTS.map((pl) => (
            <a
              key={pl.slug}
              href={`${SC_BASE}/${pl.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-[#ff5500]/30 hover:bg-gradient-to-b hover:from-[#ff5500]/5 hover:to-transparent transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,85,0,0.1)]"
            >
              <div className="text-3xl mb-3 h-14 w-14 rounded-full bg-white/5 group-hover:bg-[#ff5500]/20 flex items-center justify-center transition-colors duration-300">
                <span className="group-hover:scale-110 transition-transform duration-300">{pl.icon}</span>
              </div>
              <p className="font-bold text-sm text-gray-300 group-hover:text-white transition-colors duration-300 line-clamp-2 leading-tight">
                {pl.title}
              </p>
              <p className="text-xs font-urdu text-gray-500 mt-1 line-clamp-1" dir="rtl">{pl.titleUr}</p>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-gray-600 group-hover:text-[#ff5500] transition-colors duration-300 uppercase tracking-wider font-semibold">
                <Music className="h-3 w-3" />
                Listen
                <ExternalLink className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SoundCloudSection;
