"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("This login feature is a UI template. Connect it to Firebase/Supabase for real authentication.");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
      </div>

      <Link href="/bible-school" className="absolute top-6 left-6 z-20">
        <Button variant="ghost" className="text-white hover:bg-white/20">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-btl-card/90 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-white/10 z-10 shadow-2xl relative"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-urdu text-btl-red mb-2 drop-shadow-md">
            سائن ان کریں
          </h1>
          <p className="text-gray-400 font-urdu text-lg">
            بائبل سکول میں خوش آمدید
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4 text-right">
            <div className="relative">
              <Input
                type="email"
                placeholder="ای میل ایڈریس"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border-white/20 text-white font-urdu text-right pr-12 h-12 rounded-lg focus:border-btl-red transition-colors"
                required
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            </div>
            
            <div className="relative">
              <Input
                type="password"
                placeholder="پاس ورڈ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/50 border-white/20 text-white font-urdu text-right pr-12 h-12 rounded-lg focus:border-btl-red transition-colors"
                required
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-btl-red hover:bg-btl-red-dark text-white font-urdu text-lg rounded-lg transition-transform active:scale-95">
            لاگ ان کریں
          </Button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-x-0 h-px bg-white/10" />
            <span className="relative bg-[#1f1f1f] px-4 text-sm text-gray-400 font-urdu rounded-full">یا اس سے سائن ان کریں</span>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleLogin}
              variant="outline"
              className="w-full h-12 bg-white text-black hover:bg-gray-100 font-urdu text-lg flex items-center justify-center gap-3 rounded-lg"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              گوگل کے ساتھ جاری رکھیں
            </Button>
            
            <Button
              type="button"
              onClick={handleLogin}
              className="w-full h-12 bg-[#1877F2] hover:bg-[#166fe5] text-white font-urdu text-lg flex items-center justify-center gap-3 rounded-lg border-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
              فیس بک کے ساتھ جاری رکھیں
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400 font-urdu">
          اکاؤنٹ نہیں ہے؟ <Link href="/auth/signup" className="text-btl-red hover:underline">رجسٹر کریں</Link>
        </div>
      </motion.div>
    </main>
  );
}
