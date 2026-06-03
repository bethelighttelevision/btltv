"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Flame,
  BookOpen,
  Mic,
  Drama,
  Headphones,
  Cross,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HERO_SHOWS,
  PROGRAMS,
  KIDS_PROGRAMS,
  PARTNERS,
  getProgramById,
} from "@/lib/site-data";
import ShowSection from "@/components/site/ShowSection";
import SoundCloudSection from "@/components/site/SoundCloudSection";
import UrduBiblePlayer from "@/components/site/UrduBiblePlayer";
import ProgramCard from "@/components/site/ProgramCard";
import PhoneMockup from "@/components/site/PhoneMockup";

function HomePage() {
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SHOWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scrollContainer = useCallback(
    (key: string, direction: "left" | "right") => {
      const el = document.getElementById(`scroll-${key}`);
      if (!el) return;
      el.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    },
    []
  );

  const devotionalShows = PROGRAMS.filter((p) => p.category === "DEVOTIONAL");
  const talkShows = PROGRAMS.filter((p) => p.category === "TALK SHOW");
  const dramaShows = PROGRAMS.filter((p) => p.category === "DRAMA");

  const hero = HERO_SHOWS[heroIndex];

  return (
    <>
      {/* Hero Carousel */}
      <section className="relative w-full min-h-[50vh] sm:min-h-[55vh] md:h-[75vh] lg:h-[85vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={hero.programId}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img src={hero.image} alt={hero.title} width={1280} height={720} fetchPriority="high" decoding="async" className="w-full h-full object-cover object-center" />
          </motion.div>
        </AnimatePresence>
        <div className="hero-gradient absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-12 pb-3 sm:pb-4 md:pb-6 lg:pb-12 px-3 sm:px-4 md:px-6 lg:px-12">
          <div className="max-w-2xl space-y-2 sm:space-y-3 md:space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={hero.programId}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {hero.programId === "btl-logo" ? (
                  <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                    <img src="/images/logo/btl-logo.webp" alt="BTL TV" width={500} height={500} className="h-10 sm:h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-[0_0_20px_rgba(229,9,20,0.3)]" />
                  </div>
                ) : (
                  <Badge className="bg-btl-red text-white font-bold text-[10px] sm:text-xs mb-1 sm:mb-3">
                    <Cross className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    BTL TV ORIGINAL
                  </Badge>
                )}
                <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-tight">
                  {hero.title}
                </h1>
                <p className="text-btl-red font-semibold text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1">
                  {hero.subtitle}
                </p>
                <p className="text-white/70 text-xs sm:text-sm md:text-base mt-1 sm:mt-3 line-clamp-2 max-w-lg">
                  {(PROGRAMS.find((p) => p.id === hero.programId) || KIDS_PROGRAMS.find((p) => p.id === hero.programId))?.description}
                </p>
                <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3 md:mt-5">
                  <Link
                    href={hero.programId === "btl-logo" ? "/shows" : `/shows/${getProgramById(hero.programId)?.slug || hero.programId}`}
                  >
                    <Button className="bg-btl-red hover:bg-btl-red-dark text-white font-semibold px-6 min-h-[44px]">
                      <Play className="h-4 w-4 mr-2 fill-current" />
                      {hero.programId === "btl-logo" ? "Explore Shows" : "Watch Now"}
                    </Button>
                  </Link>
                  <Link href="/shows">
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 min-h-[44px]"
                    >
                      All Shows
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 mt-4">
              {HERO_SHOWS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 min-w-[20px] ${idx === heroIndex ? "w-8 bg-btl-red" : "w-4 bg-white/30 hover:bg-white/50"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now - Same landscape cards */}
      <section className="py-6 md:py-8">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-btl-red" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Trending Now</h2>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => scrollContainer("trending", "left")}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => scrollContainer("trending", "right")}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div
            id="scroll-trending"
            className="flex gap-3 overflow-x-auto hide-scrollbar smooth-scroll pb-2"
          >
            {PROGRAMS.slice(0, 15).map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onClick={() => router.push(`/shows/${program.slug}`)}
                size="small"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Devotional Programs */}
      <ShowSection
        title="Devotional Programs"
        icon={BookOpen}
        programs={devotionalShows}
        sectionKey="devotional"
        scrollContainer={scrollContainer}
        onSelectShow={(id) => {
          const p = PROGRAMS.find((pr) => pr.id === id);
          router.push(`/shows/${p?.slug || id}`);
        }}
      />

      {/* Talk Shows & Discussions */}
      <ShowSection
        title="Talk Shows & Discussions"
        icon={Mic}
        programs={talkShows}
        sectionKey="talkshow"
        scrollContainer={scrollContainer}
        onSelectShow={(id) => {
          const p = PROGRAMS.find((pr) => pr.id === id);
          router.push(`/shows/${p?.slug || id}`);
        }}
      />

      {/* Drama Series */}
      <ShowSection
        title="Drama Series"
        icon={Drama}
        programs={dramaShows}
        sectionKey="drama"
        scrollContainer={scrollContainer}
        onSelectShow={(id) => {
          const p = PROGRAMS.find((pr) => pr.id === id);
          router.push(`/shows/${p?.slug || id}`);
        }}
      />

      {/* Our Partners - 3D Animated Cards */}
      <section className="py-8 md:py-12">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-btl-red/40" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Our Partners</h2>
            <div className="h-px w-12 bg-btl-red/40" />
          </div>
          <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
            {PARTNERS.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{
                  scale: 1.08,
                  rotateY: 8,
                  rotateX: -4,
                  z: 40,
                }}
                style={{ perspective: 800 }}
                className="group cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-btl-red/0 group-hover:bg-btl-red/15 rounded-2xl blur-xl transition-all duration-500 scale-110" />
                  <Card className="relative bg-btl-card/80 border-btl-card-border hover:border-btl-red/40 transition-all duration-500 flex items-center justify-center p-6 md:p-8 h-32 w-48 md:h-40 md:w-60 backdrop-blur-sm group-hover:shadow-[0_0_30px_rgba(229,9,20,0.15)]">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      width={400}
                      height={228}
                      loading="lazy"
                      className="max-h-20 md:max-h-24 max-w-full object-contain brightness-90 contrast-110 group-hover:brightness-110 group-hover:contrast-125 transition-all duration-500 drop-shadow-[0_0_8px_rgba(229,9,20,0.1)] group-hover:drop-shadow-[0_0_16px_rgba(229,9,20,0.25)]"
                    />
                  </Card>
                </div>
                <p className="text-center text-[11px] md:text-xs text-muted-foreground mt-2 font-medium group-hover:text-btl-red transition-colors duration-300">
                  {partner.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-8 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-btl-red/5 to-transparent" />
        <div className="px-4 md:px-6 max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
          >
            {/* Phone mockup */}
            <div className="flex-shrink-0">
              <PhoneMockup />
            </div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground"
              >
                Get the <span className="text-btl-red">BTL TV</span> App
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-sm md:text-base text-muted-foreground mt-3 max-w-lg leading-relaxed"
              >
                Watch live TV, browse all shows, listen to the Urdu Audio Bible, and stay connected with the ministry — all from your phone.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-wrap items-center gap-3 mt-6 justify-center md:justify-start"
              >
                <a href="/api/download">
                  <Button size="lg" className="bg-btl-red hover:bg-btl-red-dark text-white font-semibold min-h-[48px] px-8 shadow-lg shadow-btl-red/25">
                    <Smartphone className="h-5 w-5 mr-2" />
                    Download APK
                  </Button>
                </a>
                <p className="text-xs text-muted-foreground">Free · 92 MB · Android 8+</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SoundCloud Section */}
      <SoundCloudSection />

      {/* Urdu Audio Bible Section */}
      <section className="py-8 md:py-12">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-btl-red/40" />
            <Headphones className="h-5 w-5 text-btl-red" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Urdu Audio Bible</h2>
            <div className="h-px w-12 bg-btl-red/40" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-btl-card/60 border-btl-card-border overflow-hidden backdrop-blur-sm">
              <div className="bg-gradient-to-r from-btl-red/10 via-btl-red/5 to-transparent p-4 md:p-5 border-b border-btl-card-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-btl-red/15 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-btl-red" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm md:text-base">Complete Urdu Bible — Audio</h3>
                    <p className="text-[11px] md:text-xs text-muted-foreground">66 books · Old & New Testament · Listen for free</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 md:p-6">
                <UrduBiblePlayer />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
