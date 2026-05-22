"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
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
          <ArrowLeft className="mr-2 h-5 w-5" /> <span className="font-urdu">واپس</span>
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
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-urdu text-center p-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-4 text-right">
            <div className="relative">
              <Input
                type="email"
                placeholder="ای میل ایڈریس"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border-white/20 text-white font-urdu text-right pr-12 h-12 rounded-lg focus:border-btl-red transition-colors"
                required
                disabled={loading}
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
                disabled={loading}
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 bg-btl-red hover:bg-btl-red-dark text-white font-urdu text-lg rounded-lg transition-transform active:scale-95 disabled:opacity-60">
            {loading ? <><Loader2 className="h-5 w-5 ml-2 animate-spin inline" /> براہ کرم انتظار کریں</> : "لاگ ان کریں"}
          </Button>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-btl-red transition-colors font-urdu">
              پاس ورڈ بھول گئے؟
            </Link>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-x-0 h-px bg-white/10" />
            <span className="relative bg-[#1f1f1f] px-4 text-sm text-gray-400 font-urdu rounded-full">یا اس سے سائن ان کریں</span>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              variant="outline"
              disabled={loading}
              className="w-full h-12 bg-white text-black hover:bg-gray-100 font-urdu text-lg flex items-center justify-center gap-3 rounded-lg"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              گوگل کے ساتھ جاری رکھیں
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
