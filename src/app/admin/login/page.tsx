"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") router.push("/admin");
  }, [status, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-xl bg-btl-red flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">B</div>
            <h1 className="text-2xl font-bold text-white">Sign In</h1>
            <p className="text-sm text-gray-500 mt-1">BTL TV Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center p-3 rounded-lg">{error}</div>
            )}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg pl-10 pr-4 h-12 focus:outline-none focus:border-btl-red/50"
                required disabled={loading} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg pl-10 pr-10 h-12 focus:outline-none focus:border-btl-red/50"
                required disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-12 bg-btl-red hover:bg-btl-red/90 text-white font-semibold text-sm rounded-lg transition-all disabled:opacity-60 flex items-center justify-center">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center space-y-2">
            <Link href="/admin/signup" className="text-xs text-gray-500 hover:text-gray-300 block">Create new admin &rarr;</Link>
            <a href="/" className="text-xs text-gray-500 hover:text-gray-300">&larr; Back to Website</a>
          </div>
        </div>
      </div>
    </div>
  );
}
