"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-400 font-medium mb-2">Invalid reset link</p>
        <p className="text-gray-500 text-sm mb-6">This link is missing required parameters.</p>
        <Link href="/forgot-password" className="text-btl-red hover:underline">Request a new reset link</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
        <p className="text-green-400 font-medium mb-2">Password reset successful!</p>
        <p className="text-gray-500 text-sm mb-6">You can now log in with your new password.</p>
        <Link href="/auth/login">
          <Button className="bg-btl-red hover:bg-btl-red/90 text-white">Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-400 text-center">Reset password for <span className="text-white">{email}</span></p>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">New Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 6 characters"
          className="bg-btl-dark/50 border-border/50 h-11"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">Confirm Password</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className="bg-btl-dark/50 border-border/50 h-11"
          required
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full bg-btl-red hover:bg-btl-red/90 text-white h-11">
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Resetting...</> : <><Lock className="h-4 w-4 mr-2" /> Reset Password</>}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-background text-white flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-btl-card border border-btl-card-border rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Set New Password</h1>
          </div>
          <Suspense fallback={<div className="text-center py-6"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}>
            <ResetForm />
          </Suspense>
        </div>
      </motion.div>
    </main>
  );
}
