"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 2000);
    } else {
      setError(data.error || "Signup failed");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-8 text-center max-w-sm">
          <div className="h-14 w-14 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">✓</div>
          <h1 className="text-xl font-bold text-white">Account Created!</h1>
          <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-xl bg-btl-red flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">B</div>
            <h1 className="text-2xl font-bold text-white">Create Admin</h1>
            <p className="text-sm text-gray-500 mt-1">BTL TV Admin Panel</p>
          </div>
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center p-3 rounded-lg">{error}</div>
            )}
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input type="text" placeholder="Full name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg pl-10 pr-4 h-12 focus:outline-none focus:border-btl-red/50"
                required disabled={loading} />
            </div>
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
                required disabled={loading} minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-12 bg-btl-red hover:bg-btl-red/90 text-white font-semibold text-sm rounded-lg transition-all disabled:opacity-60 flex items-center justify-center">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</> : "Create Admin"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/admin/login" className="text-xs text-gray-500 hover:text-gray-300">Already have an account? Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
