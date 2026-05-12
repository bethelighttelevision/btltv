"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, BookMarked, Award, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BibleSchool() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-32 font-urdu overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop"
            alt="Bible School Hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#0a0a0a]/80 to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-btl-red/20 via-transparent to-transparent opacity-50 blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="py-10"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-[0_10px_20px_rgba(229,9,20,0.4)] leading-normal pb-4">
              <span className="font-sans font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-widest mr-4">BTL</span>
              <span className="text-btl-red">بائبل سکول</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 drop-shadow-xl leading-relaxed max-w-3xl mx-auto py-2">
              خدا کے کلام کی گہرائی میں اتریں اور مفت آن لائن کورسز کے ذریعے اپنی روحانی زندگی کو مضبوط بنائیں۔
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 overflow-visible py-4">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 px-8 bg-btl-red hover:bg-white hover:text-black hover:scale-105 text-white font-urdu text-xl rounded-full shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all duration-300">
                  <LogIn className="mr-3 h-5 w-5" /> لاگ ان کریں
                </Button>
              </Link>
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-8 border-2 border-white/40 text-white hover:bg-white hover:text-black hover:scale-105 font-urdu text-xl rounded-full bg-transparent transition-all duration-300">
                  <UserPlus className="mr-3 h-5 w-5" /> رجسٹر کریں
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <Link href="/" className="absolute top-8 left-8 z-20 group">
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-4 h-10">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-2 transition-transform" /> ہوم پیج پر واپس
          </Button>
        </Link>
      </div>

      {/* Course Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 mt-[-2vh]">

        <div className="flex items-center justify-end gap-6 mb-12 border-b border-white/10 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            دستیاب کورسز
          </h2>
          <div className="h-12 w-1 bg-btl-red rounded-full shadow-[0_0_10px_rgba(229,9,20,1)]"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Chapman Course Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="group relative rounded-2xl bg-[#111111] border border-white/5 overflow-hidden hover:border-btl-red/40 transition-all duration-500 shadow-2xl hover:shadow-[0_0_30px_rgba(229,9,20,0.15)] flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="h-48 relative overflow-hidden flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1519011985187-444d62641929?q=80&w=2000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
              <BookOpen className="h-16 w-16 text-btl-red/80 drop-shadow-[0_0_15px_rgba(229,9,20,0.5)] relative z-10 group-hover:-translate-y-2 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-btl-red/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                نیا کورس
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col text-right z-10">
              <div className="flex justify-between items-center mb-4 flex-row-reverse">
                <h3 className="text-3xl font-bold text-white group-hover:text-btl-red transition-colors">Chapman</h3>
                <span className="text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">22 طلباء</span>
              </div>

              <div className="flex items-center justify-end gap-2 text-btl-red mb-4 bg-btl-red/5 w-fit ml-auto px-3 py-1.5 rounded-full">
                <BookMarked className="h-4 w-4" />
                <span className="text-sm font-bold">10 اسباق</span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed flex-1">
                یہ 10 اسباق پر مشتمل ایک بہترین کورس ہے۔ ہر باب میں کچھ متن پڑھنے کو ہوتا ہے اور اس کے بارے میں کچھ سوالات ہوتے ہیں۔ آپ کو ایک ایسا سرپرست ملے گا جو آپ کی رہنمائی کرے گا۔
              </p>

              <Link href="/bible-school/course" className="mt-8 block">
                <Button className="w-full bg-[#1a1a1a] border border-white/10 hover:bg-btl-red hover:border-btl-red text-white text-xl h-14 rounded-xl transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(229,9,20,0.3)]">
                  مزید پڑھیں / شروع کریں
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* BiblBasics Course Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="group relative rounded-2xl bg-[#111111] border border-white/5 overflow-hidden hover:border-btl-red/40 transition-all duration-500 shadow-2xl hover:shadow-[0_0_30px_rgba(229,9,20,0.15)] flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="h-48 relative overflow-hidden flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=2000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
              <BookOpen className="h-16 w-16 text-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] relative z-10 group-hover:-translate-y-2 transition-transform duration-500 group-hover:text-white" />
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                بنیادی تعلیم
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col text-right z-10">
              <div className="flex justify-between items-center mb-4 flex-row-reverse">
                <h3 className="text-3xl font-bold text-white group-hover:text-btl-red transition-colors">BiblBasics</h3>
                <span className="text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">7 طلباء</span>
              </div>

              <div className="flex items-center justify-end gap-2 text-btl-red mb-4 bg-btl-red/5 w-fit ml-auto px-3 py-1.5 rounded-full">
                <BookMarked className="h-4 w-4" />
                <span className="text-sm font-bold">15 اسباق</span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed flex-1">
                یہ 15 اسباق پر مشتمل ہے۔ یہ آپ کو بائبل کی جھلکیاں اور آپ کے لیے خدا کا پیغام دکھائے گا۔ ہر سبق کے بعد سوالات ہیں تاکہ آپ اپنی سمجھ کو جانچ سکیں۔
              </p>

              <Link href="/bible-school/course" className="mt-8 block">
                <Button className="w-full bg-[#1a1a1a] border border-white/10 hover:bg-btl-red hover:border-btl-red text-white text-xl h-14 rounded-xl transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(229,9,20,0.3)]">
                  مزید پڑھیں / شروع کریں
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Premium Info Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 relative overflow-hidden rounded-2xl p-1"
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-btl-red via-black to-btl-red opacity-30 blur-sm"></div>

          <div className="relative bg-[#0d0d0d] rounded-xl p-8 flex flex-col md:flex-row-reverse items-center justify-between gap-8 border border-white/5">
            <div className="flex-1 text-center md:text-right z-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                آن لائن کورس کیوں؟
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl ml-auto">
                یہ کورس ہر اس شخص کے لیے تیار کیا گیا ہے جو مسیحی ایمان کو بہتر طور پر سمجھنا چاہتا ہے۔ ہمارے سرپرست آپ کی روحانی رہنمائی کے لیے ہر قدم پر موجود ہوں گے۔
              </p>
            </div>

            <div className="shrink-0 flex gap-4 relative z-10">
              <div className="h-16 w-16 rounded-full bg-btl-red/10 border border-btl-red/30 flex items-center justify-center">
                <Award className="h-8 w-8 text-btl-red" />
              </div>
              <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <BookMarked className="h-8 w-8 text-white/80" />
              </div>
            </div>

            {/* Background Texture inside banner */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none rounded-[22px]"></div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
