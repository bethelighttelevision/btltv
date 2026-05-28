"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  List,
  X,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  { id: "est", name: "Esther", nameUr: "آستر", chapters: 10, testament: "OT" },
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
  { id: "1ti", name: "1 Timothy", nameUr: "1 تیمتھیس", chapters: 6, testament: "NT" },
  { id: "2ti", name: "2 Timothy", nameUr: "2 تیمتھیس", chapters: 4, testament: "NT" },
  { id: "tit", name: "Titus", nameUr: "ططس", chapters: 3, testament: "NT" },
  { id: "phm", name: "Philemon", nameUr: "فلیمون", chapters: 1, testament: "NT" },
  { id: "heb", name: "Hebrews", nameUr: "عبرانیوں", chapters: 13, testament: "NT" },
  { id: "jas", name: "James", nameUr: "یعقوب", chapters: 5, testament: "NT" },
  { id: "1pe", name: "1 Peter", nameUr: "1 پطرس", chapters: 5, testament: "NT" },
  { id: "2pe", name: "2 Peter", nameUr: "2 پطرس", chapters: 5, testament: "NT" },
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

const CHAPTERS_PER_PAGE = 20;

function UrduBiblePlayer() {
  const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[39]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [testamentFilter, setTestamentFilter] = useState<"OT" | "NT">("NT");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [chapterPage, setChapterPage] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mountedRef = useRef(true);
  const animationRef = useRef(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef(selectedBook);
  const chapterRef = useRef(selectedChapter);
  const loadingRef = useRef(false);
  const [barHeights, setBarHeights] = useState<number[]>([]);
  const barCount = 36;

  bookRef.current = selectedBook;
  chapterRef.current = selectedChapter;

  useEffect(() => {
    const initial = Array.from({ length: barCount }, (_, i) => {
      const base = 4 + Math.abs(Math.sin(i * 0.7)) * 28;
      const variation = 4 + Math.abs(Math.cos(i * 1.3)) * 16;
      return base + Math.random() * variation;
    });
    setBarHeights(initial);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    setChapterPage(0);
  }, [selectedBook]);

  const getAudioUrl = (bookId: string, chapter: number) =>
    `https://www.gbcpakistan.org/mp3/urdu_bible/${GBC_AUDIO_MAP[bookId]}${chapter}.mp3`;

  const animateBars = useCallback(() => {
    if (!mountedRef.current) return;
    setBarHeights(prev => prev.map((_, i) => {
      const center = 4 + Math.abs(Math.sin(i * 0.7 + Date.now() * 0.001)) * 28;
      const wave = 4 + Math.abs(Math.sin(i * 0.15 + Date.now() * 0.002)) * 16;
      const flicker = Math.random() * 8;
      return Math.min(72, Math.max(4, center + wave * 0.5 + flicker));
    }));
    animationRef.current = requestAnimationFrame(animateBars);
  }, []);

  const startBarAnimation = useCallback(() => {
    cancelAnimationFrame(animationRef.current);
    animateBars();
  }, [animateBars]);

  const stopBarAnimation = useCallback(() => {
    cancelAnimationFrame(animationRef.current);
    setBarHeights(prev => prev.map((_, i) => {
      const base = 4 + Math.abs(Math.sin(i * 0.7)) * 28;
      const variation = 4 + Math.abs(Math.cos(i * 1.3)) * 16;
      return base + variation * 0.3;
    }));
  }, []);

  // Initialize single Audio element once with permanent event listeners
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";

    audio.addEventListener("loadedmetadata", () => {
      if (mountedRef.current) setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      if (mountedRef.current) setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      if (!mountedRef.current) return;
      setIsPlaying(false);
      setCurrentTime(0);
      loadingRef.current = false;
      stopBarAnimation();
      setChapterPage(0);

      const book = bookRef.current;
      const ch = chapterRef.current;
      if (ch < book.chapters) {
        const nextCh = ch + 1;
        setSelectedChapter(nextCh);
        loadChapter(book.id, nextCh);
      } else {
        const idx = BIBLE_BOOKS.findIndex(b => b.id === book.id);
        const nextBook = idx >= 0 && idx < BIBLE_BOOKS.length - 1 ? BIBLE_BOOKS[idx + 1] : null;
        if (nextBook) {
          setSelectedBook(nextBook);
          setSelectedChapter(1);
          setTestamentFilter(nextBook.testament as "OT" | "NT");
          loadChapter(nextBook.id, 1);
        }
      }
    });

    audio.addEventListener("error", () => {
      if (mountedRef.current) {
        setAudioError(true);
        setAudioLoading(false);
        loadingRef.current = false;
        stopBarAnimation();
      }
    });

    audio.addEventListener("pause", () => {
      if (mountedRef.current && !audio.ended) {
        setIsPlaying(false);
        stopBarAnimation();
      }
    });

    audio.addEventListener("play", () => {
      if (mountedRef.current) {
        setIsPlaying(true);
        startBarAnimation();
      }
    });

    audio.addEventListener("waiting", () => {
      if (mountedRef.current) setAudioLoading(true);
    });

    audio.addEventListener("canplay", () => {
      if (mountedRef.current) {
        setAudioLoading(false);
        setAudioError(false);
      }
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, [startBarAnimation, stopBarAnimation]);

  const loadChapter = useCallback((bookId: string, chapter: number) => {
    if (!mountedRef.current || loadingRef.current) return;
    loadingRef.current = true;

    setAudioLoading(true);
    setAudioError(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    stopBarAnimation();

    const url = getAudioUrl(bookId, chapter);
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = url;
    audio.currentTime = 0;

    audio.play().then(() => {
      if (mountedRef.current) {
        setAudioLoading(false);
        setAudioError(false);
        loadingRef.current = false;
      }
    }).catch(() => {
      if (mountedRef.current) {
        setAudioLoading(false);
        setAudioError(true);
        loadingRef.current = false;
        stopBarAnimation();
      }
    });
  }, [stopBarAnimation]);

  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (loadingRef.current) return;

    if (audio.src && audio.src !== window.location.href) {
      setAudioError(false);
      audio.play().catch(() => {
        loadChapter(bookRef.current.id, chapterRef.current);
      });
    } else {
      loadChapter(bookRef.current.id, chapterRef.current);
    }
  }, [loadChapter]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
  }, []);

  const handleBookSelect = useCallback((book: typeof BIBLE_BOOKS[0]) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
    }
    loadingRef.current = false;
    setSelectedBook(book);
    setSelectedChapter(1);
    setAudioError(false);
    setShowModal(false);
    stopBarAnimation();
    loadChapter(book.id, 1);
  }, [stopBarAnimation, loadChapter]);

  const skipChapter = useCallback((dir: -1 | 1) => {
    const book = bookRef.current;
    const ch = chapterRef.current;
    const newCh = ch + dir;
    if (newCh >= 1 && newCh <= book.chapters) {
      loadingRef.current = false;
      setSelectedChapter(newCh);
      setAudioError(false);
      loadChapter(book.id, newCh);
    }
  }, [loadChapter]);

  const skipBackward = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.src) {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    }
  }, []);

  const skipForward = useCallback(() => {
    const audio = audioRef.current;
    if (audio && duration > 0) {
      audio.currentTime = Math.min(duration, audio.currentTime + 10);
    }
  }, [duration]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(false);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = v;
      audio.muted = false;
    }
  }, []);

  const seekProgress = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || duration <= 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
  }, [duration]);

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  const filteredBooks = BIBLE_BOOKS.filter(
    (b) => b.testament === testamentFilter &&
      (searchQuery === "" ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.nameUr.includes(searchQuery))
  );

  const getNextBook = () => {
    const idx = BIBLE_BOOKS.findIndex(b => b.id === selectedBook.id);
    return idx >= 0 && idx < BIBLE_BOOKS.length - 1 ? BIBLE_BOOKS[idx + 1] : null;
  };

  const getPrevBook = () => {
    const idx = BIBLE_BOOKS.findIndex(b => b.id === selectedBook.id);
    return idx > 0 ? BIBLE_BOOKS[idx - 1] : null;
  };

  const totalChapterPages = Math.ceil(selectedBook.chapters / CHAPTERS_PER_PAGE);
  const chapterStart = chapterPage * CHAPTERS_PER_PAGE;
  const chapterEnd = Math.min(chapterStart + CHAPTERS_PER_PAGE, selectedBook.chapters);
  const visibleChapters = Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).slice(chapterStart, chapterEnd);

  return (
    <>
      {/* Main player */}
      <div className="w-full max-w-3xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.95)] border border-white/[0.06]">

          {/* ─── COVER ART ─── */}
          <div className="relative w-full aspect-video overflow-hidden bg-[#080810]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f2e]/90 via-[#1a0505]/80 to-[#080810] z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(120,40,200,0.15),transparent_60%),radial-gradient(ellipse_at_80%_80%,rgba(229,9,20,0.1),transparent_60%)] z-10" />

            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="relative w-3/5 h-3/5 flex items-center justify-center">
                <div className="absolute inset-0 border border-white/[0.03] rounded-full animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-[10%] border border-white/[0.04] rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                <div className="absolute inset-[22%] border border-white/[0.06] rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-1/2 h-1/2 bg-[radial-gradient(circle,rgba(229,9,20,0.2),transparent_70%)] rounded-full animate-pulse" />
                <div className={`relative z-30 transition-transform duration-700 ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}>
                  <img
                    src="/images/logo/btl-logo.webp"
                    alt="BTL TV"
                    width={160}
                    height={160}
                    className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-[0_0_40px_rgba(229,9,20,0.4)]"
                  />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 md:p-5 lg:p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-btl-red/20 text-btl-red border border-btl-red/30">
                  {selectedBook.testament === "OT" ? "Old Testament" : "New Testament"}
                </span>
                <span className="text-[9px] text-gray-500 font-mono">
                  {selectedBook.id.toUpperCase()}
                </span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white truncate drop-shadow-lg">
                    {selectedBook.name}
                  </h2>
                  <p className="text-sm md:text-base text-gray-400 font-urdu leading-tight" dir="rtl">
                    {selectedBook.nameUr}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-2xl md:text-3xl font-black text-btl-red drop-shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                    {selectedChapter}
                  </p>
                  <p className="text-[9px] text-gray-600 uppercase tracking-wider">
                    Chapter
                  </p>
                </div>
              </div>
            </div>

            {audioLoading && (
              <div className="absolute inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-6 rounded-full bg-btl-red/60"
                      style={{ animation: `pulse 0.6s ease-in-out ${i * 0.1}s infinite` }}
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-3 font-medium">Loading chapter {selectedChapter}...</span>
                </div>
              </div>
            )}
          </div>

          {/* ─── PLAYER BODY ─── */}
          <div className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] p-4 md:p-5 lg:p-6 space-y-3">

            <div
              ref={progressRef}
              className="relative h-1.5 bg-white/10 rounded-full cursor-pointer group overflow-hidden"
              onClick={seekProgress}
            >
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-btl-red to-btl-red/80 rounded-full transition-all duration-150"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progress * 100}% - 6px)` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono font-medium text-gray-500 -mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-end justify-center gap-[2px] h-12 md:h-14">
              {barHeights.slice(0, barCount).map((h, i) => {
                const barPos = i / barCount;
                const isPlayed = barPos <= progress;
                return (
                  <div
                    key={i}
                    className="w-[2px] min-[420px]:w-[3px] rounded-full transition-all duration-75"
                    style={{
                      height: `${h}px`,
                      backgroundColor: isPlaying && isPlayed ? '#e50914' : isPlayed ? 'rgba(229,9,20,0.35)' : 'rgba(255,255,255,0.06)',
                    }}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-9 md:w-9 text-gray-400 hover:text-white"
                onClick={() => {
                  const prev = getPrevBook();
                  if (prev) handleBookSelect(prev);
                }}
                disabled={!getPrevBook()}
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-9 md:w-9 text-gray-400 hover:text-white"
                onClick={skipBackward}
                disabled={!audioRef.current?.src || audioError}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <button
                disabled={selectedChapter <= 1}
                onClick={() => skipChapter(-1)}
                className="h-7 w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                className={`h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isPlaying
                    ? "bg-white text-black hover:scale-105 shadow-white/20"
                    : audioError
                      ? "bg-red-900/50 text-red-400 border border-red-500/50"
                      : "bg-btl-red text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(229,9,20,0.5)] shadow-[0_0_15px_rgba(229,9,20,0.3)]"
                }`}
                onClick={audioError ? playAudio : isPlaying ? pauseAudio : playAudio}
                disabled={audioLoading && !audioError}
              >
                {audioLoading && !audioError ? (
                  <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : audioError ? (
                  <RotateCcw className="h-5 w-5" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5 md:h-6 md:w-6 fill-current" />
                ) : (
                  <Play className="h-5 w-5 md:h-6 md:w-6 fill-current ml-0.5" />
                )}
              </button>

              <button
                disabled={selectedChapter >= selectedBook.chapters}
                onClick={() => skipChapter(1)}
                className="h-7 w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-9 md:w-9 text-gray-400 hover:text-white"
                onClick={skipForward}
                disabled={!audioRef.current?.src || audioError}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-9 md:w-9 text-gray-400 hover:text-white"
                onClick={() => {
                  const next = getNextBook();
                  if (next) handleBookSelect(next);
                }}
                disabled={!getNextBook()}
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </Button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-white flex-shrink-0"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-3.5 w-3.5" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="h-3.5 w-3.5" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" />
                  )}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 accent-btl-red"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0 text-gray-400 hover:text-white"
                onClick={() => setShowModal(true)}
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </div>

            <AnimatePresence>
              {audioError && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <p className="text-xs text-red-400 font-medium">Audio unavailable — tap retry.</p>
                  <p className="text-[10px] text-gray-600 font-urdu mt-0.5" dir="rtl">دوبارہ کوشش کریں</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── FULL-SCREEN MODAL ─── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowModal(false)} />

            {/* Modal content */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-4 md:inset-8 lg:inset-x-20 lg:inset-y-12 bg-[#0d0d0d] rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)]"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    onClick={() => setShowModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <h2 className="text-sm font-bold text-white">Browse Bible</h2>
                </div>
                <span className="text-[10px] text-gray-600 font-urdu" dir="rtl">کتاب اور باب منتخب کریں</span>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">
                {/* Testament toggle + search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-white/5 gap-1">
                    <button
                      onClick={() => setTestamentFilter("NT")}
                      className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        testamentFilter === "NT"
                          ? "bg-btl-red text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]"
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      New Testament (27)
                    </button>
                    <button
                      onClick={() => setTestamentFilter("OT")}
                      className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        testamentFilter === "OT"
                          ? "bg-btl-red text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]"
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      Old Testament (39)
                    </button>
                  </div>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" />
                    <Input
                      placeholder="Search book..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#1a1a1a] border-white/5 h-9 text-xs pl-9 rounded-xl text-gray-300 placeholder:text-gray-600"
                    />
                  </div>
                </div>

                {/* Books grid */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2.5">Select Book</p>
                  <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5">
                    {filteredBooks.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => handleBookSelect(book)}
                        className={`p-2 rounded-xl text-left transition-all duration-200 border ${
                          book.id === selectedBook.id
                            ? "bg-btl-red/15 border-btl-red/50 shadow-[0_0_12px_rgba(229,9,20,0.2)]"
                            : "bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/15"
                        }`}
                      >
                        <p className={`text-[10px] font-semibold truncate leading-tight ${book.id === selectedBook.id ? "text-btl-red" : "text-gray-300"}`}>
                          {book.name}
                        </p>
                        <p className="text-[8px] text-gray-600 truncate mt-0.5" dir="rtl">{book.nameUr}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chapters grid with pagination */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                      Chapter — <span className="text-btl-red">{selectedBook.chapters} total</span>
                    </p>
                    {totalChapterPages > 1 && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setChapterPage(Math.max(0, chapterPage - 1))}
                          disabled={chapterPage === 0}
                          className="h-6 w-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </button>
                        <span className="text-[10px] text-gray-600 font-mono tabular-nums">
                          {chapterStart + 1}–{chapterEnd}
                        </span>
                        <button
                          onClick={() => setChapterPage(Math.min(totalChapterPages - 1, chapterPage + 1))}
                          disabled={chapterPage >= totalChapterPages - 1}
                          className="h-6 w-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
                        >
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {visibleChapters.map((ch) => (
                      <button
                        key={ch}
                        onClick={() => {
                          loadingRef.current = false;
                          setSelectedChapter(ch);
                          setAudioError(false);
                          loadChapter(selectedBook.id, ch);
                          setShowModal(false);
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default UrduBiblePlayer;
