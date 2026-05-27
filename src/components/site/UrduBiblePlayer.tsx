"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const BIBLE_BOOKS = [
  { id: "gen", name: "Genesis", nameUr: "پیدائش", chapters: 50, testament: "OT" },
  { id: "exo", name: "Exodus", nameUr: "خروج", chapters: 40, testament: "OT" },
  { id: "lev", name: "Leviticus", nameUr: "احبار", chapters: 27, testament: "OT" },
  { id: "num", name: "Numbers", nameUr: "گنتی", chapters: 36, testament: "OT" },
  { id: "deu", name: "Deuteronomy", nameUr: "استثنا", chapters: 34, testament: "OT" },
  { id: "jos", name: "Joshua", nameUr: "یوشع", chapters: 24, testament: "OT" },
  { id: "jdg", name: "Judges", nameUr: "قضات", chapters: 21, testament: "OT" },
  { id: "rut", name: "Ruth", nameUr: "روت", chapters: 4, testament: "OT" },
  { id: "1sa", name: "1 Samuel", nameUr: "1 سموئیل", chapters: 31, testament: "OT" },
  { id: "2sa", name: "2 Samuel", nameUr: "2 سموئیل", chapters: 24, testament: "OT" },
  { id: "1ki", name: "1 Kings", nameUr: "1 سلاطین", chapters: 22, testament: "OT" },
  { id: "2ki", name: "2 Kings", nameUr: "2 سلاطین", chapters: 25, testament: "OT" },
  { id: "1ch", name: "1 Chronicles", nameUr: "1 تواریخ", chapters: 29, testament: "OT" },
  { id: "2ch", name: "2 Chronicles", nameUr: "2 تواریخ", chapters: 36, testament: "OT" },
  { id: "ezr", name: "Ezra", nameUr: "عزرا", chapters: 10, testament: "OT" },
  { id: "neh", name: "Nehemiah", nameUr: "نحمیاہ", chapters: 13, testament: "OT" },
  { id: "est", name: "Esther", nameUr: "استر", chapters: 10, testament: "OT" },
  { id: "job", name: "Job", nameUr: "ایوب", chapters: 42, testament: "OT" },
  { id: "psa", name: "Psalms", nameUr: "زبور", chapters: 150, testament: "OT" },
  { id: "pro", name: "Proverbs", nameUr: "امثال", chapters: 31, testament: "OT" },
  { id: "ecc", name: "Ecclesiastes", nameUr: "واعظ", chapters: 12, testament: "OT" },
  { id: "sos", name: "Song of Solomon", nameUr: "غزل غزلات", chapters: 8, testament: "OT" },
  { id: "isa", name: "Isaiah", nameUr: "یسعیاہ", chapters: 66, testament: "OT" },
  { id: "jer", name: "Jeremiah", nameUr: "یرمیاہ", chapters: 52, testament: "OT" },
  { id: "lam", name: "Lamentations", nameUr: "مراثی", chapters: 5, testament: "OT" },
  { id: "eze", name: "Ezekiel", nameUr: "حزقی ایل", chapters: 48, testament: "OT" },
  { id: "dan", name: "Daniel", nameUr: "دانی ایل", chapters: 12, testament: "OT" },
  { id: "hos", name: "Hosea", nameUr: "ہوشع", chapters: 14, testament: "OT" },
  { id: "jol", name: "Joel", nameUr: "یوایل", chapters: 3, testament: "OT" },
  { id: "amo", name: "Amos", nameUr: "عاموس", chapters: 9, testament: "OT" },
  { id: "oba", name: "Obadiah", nameUr: "عوبدیہ", chapters: 1, testament: "OT" },
  { id: "jon", name: "Jonah", nameUr: "یونس", chapters: 4, testament: "OT" },
  { id: "mic", name: "Micah", nameUr: "میکاہ", chapters: 7, testament: "OT" },
  { id: "nah", name: "Nahum", nameUr: "ناحوم", chapters: 3, testament: "OT" },
  { id: "hab", name: "Habakkuk", nameUr: "حبقوق", chapters: 3, testament: "OT" },
  { id: "zep", name: "Zephaniah", nameUr: "صفنیاہ", chapters: 3, testament: "OT" },
  { id: "hag", name: "Haggai", nameUr: "حجی", chapters: 2, testament: "OT" },
  { id: "zec", name: "Zechariah", nameUr: "زکریاہ", chapters: 14, testament: "OT" },
  { id: "mal", name: "Malachi", nameUr: "ملاکی", chapters: 4, testament: "OT" },
  { id: "mat", name: "Matthew", nameUr: "متی", chapters: 28, testament: "NT" },
  { id: "mrk", name: "Mark", nameUr: "مرقس", chapters: 16, testament: "NT" },
  { id: "luk", name: "Luke", nameUr: "لوقا", chapters: 24, testament: "NT" },
  { id: "jhn", name: "John", nameUr: "یوحنا", chapters: 21, testament: "NT" },
  { id: "act", name: "Acts", nameUr: "اعمال", chapters: 28, testament: "NT" },
  { id: "rom", name: "Romans", nameUr: "رومیوں", chapters: 16, testament: "NT" },
  { id: "1co", name: "1 Corinthians", nameUr: "1 کرنتھیوں", chapters: 16, testament: "NT" },
  { id: "2co", name: "2 Corinthians", nameUr: "2 کرنتھیوں", chapters: 13, testament: "NT" },
  { id: "gal", name: "Galatians", nameUr: "گلاتیوں", chapters: 6, testament: "NT" },
  { id: "eph", name: "Ephesians", nameUr: "افسیوں", chapters: 6, testament: "NT" },
  { id: "php", name: "Philippians", nameUr: "فلیپیوں", chapters: 4, testament: "NT" },
  { id: "col", name: "Colossians", nameUr: "کولسیوں", chapters: 4, testament: "NT" },
  { id: "1th", name: "1 Thessalonians", nameUr: "1 تھسلونیکیوں", chapters: 5, testament: "NT" },
  { id: "2th", name: "2 Thessalonians", nameUr: "2 تھسلونیکیوں", chapters: 3, testament: "NT" },
  { id: "1ti", name: "1 Timothy", nameUr: "1 تیمتاؤس", chapters: 6, testament: "NT" },
  { id: "2ti", name: "2 Timothy", nameUr: "2 تیمتاؤس", chapters: 4, testament: "NT" },
  { id: "tit", name: "Titus", nameUr: "ططس", chapters: 3, testament: "NT" },
  { id: "phm", name: "Philemon", nameUr: "فلمون", chapters: 1, testament: "NT" },
  { id: "heb", name: "Hebrews", nameUr: "عبرانیوں", chapters: 13, testament: "NT" },
  { id: "jas", name: "James", nameUr: "یعقوب", chapters: 5, testament: "NT" },
  { id: "1pe", name: "1 Peter", nameUr: "1 پطرس", chapters: 5, testament: "NT" },
  { id: "2pe", name: "2 Peter", nameUr: "2 پطرس", chapters: 3, testament: "NT" },
  { id: "1jn", name: "1 John", nameUr: "1 یوحنا", chapters: 5, testament: "NT" },
  { id: "2jn", name: "2 John", nameUr: "2 یوحنا", chapters: 1, testament: "NT" },
  { id: "3jn", name: "3 John", nameUr: "3 یوحنا", chapters: 1, testament: "NT" },
  { id: "jud", name: "Jude", nameUr: "یہوداہ", chapters: 1, testament: "NT" },
  { id: "rev", name: "Revelation", nameUr: "مکاشفہ", chapters: 22, testament: "NT" },
];

const GBC_AUDIO_MAP: Record<string, string> = {
  gen: "Genesis", exo: "Exodus", lev: "Leviticus", num: "Numbers", deu: "Deuteronomy",
  jos: "Joshua", jdg: "Judges", rut: "Ruth",
  "1sa": "I_Samuel", "2sa": "II_Samuel", "1ki": "I_Kings", "2ki": "II_Kings",
  "1ch": "I_Chronicles", "2ch": "II_Chronicles", ezr: "Ezra", neh: "Nehemiah", est: "Esther",
  job: "Job", psa: "Psalms", pro: "Proverbs", ecc: "Ecclesiastes", sos: "Song_of_Solomon",
  isa: "Isaiah", jer: "Jeremiah", lam: "Lamentations", eze: "Ezekiel", dan: "Daniel",
  hos: "Hosea", jol: "Joel", amo: "Amos", oba: "Obadiah", jon: "Jonah",
  mic: "Micah", nah: "Nahum", hab: "Habakkuk", zep: "Zephaniah", hag: "Haggai",
  zec: "Zechariah", mal: "Malachi",
  mat: "Mathew", mrk: "Mark", luk: "Luke", jhn: "John", act: "Acts",
  rom: "Romans", "1co": "I_Corinthians", "2co": "II_Corinthians", gal: "Galatians", eph: "Ephesians",
  php: "Philippians", col: "Colossians", "1th": "I_Thessalonians", "2th": "II_Thessalonians",
  "1ti": "I_Timothy", "2ti": "II_Timothy", tit: "Titus", phm: "Philemon", heb: "Hebrews",
  jas: "James", "1pe": "I_Peter", "2pe": "II_Peter", "1jn": "I_John", "2jn": "II_John",
  "3jn": "III_John", jud: "Jude", rev: "Revelation",
};

function UrduBiblePlayer() {
  const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[39]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [testamentFilter, setTestamentFilter] = useState<"OT" | "NT">("NT");
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const retryCountRef = useRef(0);

  const getAudioUrl = (bookId: string, chapter: number) =>
    `https://www.gbcpakistan.org/mp3/urdu_bible/${GBC_AUDIO_MAP[bookId]}${chapter}.mp3`;

  const loadAndPlay = useCallback((bookId: string, chapter: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioLoading(true);
    setAudioError(false);
    retryCountRef.current = 0;

    const playAttempt = () => {
      if (!audio) return;
      const url = getAudioUrl(bookId, chapter);

      const doPlay = () => {
        const promise = audio.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              setIsPlaying(true);
              setAudioLoading(false);
              setAudioError(false);
            })
            .catch(() => {
              if (retryCountRef.current < 4) {
                retryCountRef.current++;
                setTimeout(playAttempt, retryCountRef.current * 1000);
              } else {
                setAudioError(true);
                setAudioLoading(false);
              }
            });
        }
      };

      const onLoadError = () => {
        if (retryCountRef.current < 4) {
          retryCountRef.current++;
          setTimeout(playAttempt, retryCountRef.current * 1000);
        } else {
          setAudioError(true);
          setAudioLoading(false);
        }
      };

      audio.oncanplay = doPlay;
      audio.onloadeddata = doPlay;
      audio.onerror = onLoadError;
      audio.src = `${url}?t=${Date.now()}`;
      audio.load();
    };

    playAttempt();
  }, []);

  const playAudio = useCallback(() => {
    loadAndPlay(selectedBook.id, selectedChapter);
  }, [selectedBook.id, selectedChapter, loadAndPlay]);

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleBookSelect = useCallback((book: typeof BIBLE_BOOKS[0]) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setAudioError(false);
    retryCountRef.current = 0;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.oncanplay = null;
      audioRef.current.onloadeddata = null;
      audioRef.current.onerror = null;
      audioRef.current.removeAttribute("src");
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(cur);
    setProgress(dur > 0 ? (cur / dur) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
  };

  const skipChapter = useCallback((dir: -1 | 1) => {
    const newCh = selectedChapter + dir;
    if (newCh >= 1 && newCh <= selectedBook.chapters) {
      setSelectedChapter(newCh);
      setProgress(0);
      setAudioError(false);
      retryCountRef.current = 0;
      loadAndPlay(selectedBook.id, newCh);
    }
  }, [selectedChapter, selectedBook, loadAndPlay]);

  const getNextBook = useCallback((currentBook: typeof BIBLE_BOOKS[0]) => {
    const idx = BIBLE_BOOKS.findIndex(b => b.id === currentBook.id);
    if (idx >= 0 && idx < BIBLE_BOOKS.length - 1) {
      return BIBLE_BOOKS[idx + 1];
    }
    return null;
  }, []);

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const filteredBooks = BIBLE_BOOKS.filter(
    (b) => b.testament === testamentFilter && (searchQuery === "" || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.nameUr.includes(searchQuery))
  );

  const otCount = 39;
  const ntCount = 27;

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/5 flex flex-col lg:flex-row relative">

      {/* ── LEFT PANEL: Player Controls ──────────────────────────── */}
      <div className="relative lg:w-[340px] flex-shrink-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a0505] to-[#0f0f0f] p-7 flex flex-col justify-between z-10 border-b lg:border-b-0 lg:border-r border-white/5">

        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.12),transparent_70%)] pointer-events-none" />

        {/* Book Info */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                {(isPlaying || audioLoading) && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-btl-red opacity-75" />}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying || audioLoading ? 'bg-btl-red' : 'bg-gray-600'}`} />
              </span>
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.15em]">
                {selectedBook.testament === "OT" ? "Old Testament" : "New Testament"}
              </span>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white tracking-tight leading-none mb-1">
            {selectedBook.name}
          </h2>
          <h3 className="text-lg text-gray-500 font-urdu mb-4 leading-tight" dir="rtl">
            {selectedBook.nameUr}
          </h3>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-btl-red/10 border border-btl-red/20">
            <span className="text-btl-red font-bold text-sm">Chapter {selectedChapter}</span>
            <span className="text-gray-600 text-xs">/ {selectedBook.chapters}</span>
          </div>
        </div>

        {/* Waveform visualizer (decorative bars) */}
        <div className="relative z-10 my-5 flex items-end justify-center gap-[3px] h-8">
          {[...Array(22)].map((_, i) => {
            const baseH = 4 + Math.abs(Math.sin(i * 0.7)) * 20;
            return (
              <div
                key={i}
                className={`w-[3px] rounded-full transition-colors duration-300 ${isPlaying ? 'bg-btl-red/70' : 'bg-white/10'}`}
                style={{ height: `${baseH}px` }}
              />
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 mb-5 space-y-2">
          <div
            className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer relative group/bar"
            onClick={seekTo}
          >
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-btl-red to-[#ff4444] rounded-full transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(229,9,20,0.6)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-white rounded-full shadow-lg scale-0 group-hover/bar:scale-100 transition-transform origin-center translate-x-1/2 border-2 border-btl-red" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono font-medium text-gray-600 tracking-wider">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center justify-center gap-5">
          <button
            disabled={selectedChapter <= 1}
            onClick={() => skipChapter(-1)}
            className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isPlaying
                ? "bg-white text-black hover:scale-105"
                : audioError
                  ? "bg-red-900/50 text-red-400 border border-red-500/50 hover:bg-red-900/70"
                  : "bg-btl-red text-white hover:bg-[#ff1a25] hover:scale-110 shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_35px_rgba(229,9,20,0.7)]"
            }`}
            onClick={audioError ? playAudio : isPlaying ? pauseAudio : playAudio}
            disabled={audioLoading && !audioError}
          >
            {audioLoading && !audioError ? (
              <div className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : audioError ? (
              <RotateCcw className="h-5 w-5" />
            ) : isPlaying ? (
              <Pause className="h-7 w-7 fill-current" />
            ) : (
              <Play className="h-7 w-7 fill-current ml-0.5" />
            )}
          </button>

          <button
            disabled={selectedChapter >= selectedBook.chapters}
            onClick={() => skipChapter(1)}
            className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Status messages */}
        <div className="relative z-10 h-8 mt-4 text-center">
          <AnimatePresence>
            {audioError && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-xs text-red-400 font-medium">Audio unavailable — tap retry.</p>
                <p className="text-[10px] text-gray-600 font-urdu mt-0.5" dir="rtl">دوبارہ کوشش کریں</p>
              </motion.div>
            )}
            {audioLoading && !audioError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-gray-500"
              >
                Loading chapter {selectedChapter}…
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <audio
          ref={audioRef}
          preload="auto"
          onEnded={() => {
            setProgress(0);
            setDuration(0);
            if (selectedChapter < selectedBook.chapters) {
              const nextCh = selectedChapter + 1;
              setSelectedChapter(nextCh);
              loadAndPlay(selectedBook.id, nextCh);
            } else {
              const nextBook = getNextBook(selectedBook);
              if (nextBook) {
                setSelectedBook(nextBook);
                setSelectedChapter(1);
                setTestamentFilter(nextBook.testament as "OT" | "NT");
                loadAndPlay(nextBook.id, 1);
              } else {
                setIsPlaying(false);
              }
            }
          }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>

      {/* ── RIGHT PANEL: Book + Chapter Selectors ─────────────────── */}
      <div className="flex-1 bg-[#0d0d0d] flex flex-col">

        {/* Testament Toggle + Search */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-white/5 gap-1">
            <button
              onClick={() => setTestamentFilter("NT")}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                testamentFilter === "NT"
                  ? "bg-btl-red text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              New (27)
            </button>
            <button
              onClick={() => setTestamentFilter("OT")}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                testamentFilter === "OT"
                  ? "bg-btl-red text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Old (39)
            </button>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" />
            <Input
              placeholder="Search book..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a1a1a] border-white/5 h-10 text-xs pl-9 rounded-xl text-gray-300 placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Books Grid */}
        <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "220px" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Select Book</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
            {filteredBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => handleBookSelect(book)}
                className={`p-2.5 rounded-xl text-left transition-all duration-200 border ${
                  book.id === selectedBook.id
                    ? "bg-btl-red/15 border-btl-red/50 shadow-[0_0_12px_rgba(229,9,20,0.2)]"
                    : "bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/15"
                }`}
              >
                <p className={`text-[11px] font-semibold truncate leading-tight ${book.id === selectedBook.id ? "text-btl-red" : "text-gray-300"}`}>
                  {book.name}
                </p>
                <p className="text-[9px] text-gray-600 truncate mt-0.5" dir="rtl">{book.nameUr}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chapter Grid */}
        <div className="border-t border-white/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">
            Chapter — <span className="text-btl-red">{selectedBook.chapters} total</span>
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => (
              <button
                key={ch}
                onClick={() => {
                  setSelectedChapter(ch);
                  setProgress(0);
                  setDuration(0);
                  setAudioError(false);
                  retryCountRef.current = 0;
                  loadAndPlay(selectedBook.id, ch);
                }}
                className={`min-w-[34px] h-8 px-2 rounded-lg text-[11px] font-bold transition-all duration-150 ${
                  ch === selectedChapter
                    ? "bg-btl-red text-white shadow-[0_0_10px_rgba(229,9,20,0.4)] scale-110"
                    : "bg-white/5 text-gray-500 hover:bg-btl-red/20 hover:text-btl-red hover:scale-105"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default UrduBiblePlayer;
