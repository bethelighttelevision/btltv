"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Save, ArrowLeft, Loader2, CheckCircle, XCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AuthGuard from "@/components/AuthGuard";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      toast.error("Failed to upload avatar");
      setAvatarUploading(false);
      return;
    }
    toast.success("Avatar updated!");
    await update();
    setAvatarUploading(false);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Failed to update profile");
    } else {
      toast.success("Profile updated!");
      await update();
    }
    setSaving(false);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");

    setSaving(true);
    const res = await fetch("/api/profile/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Failed to change password");
    } else {
      toast.success("Password changed!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Profile Settings</h1>

          {/* Avatar */}
          <div className="bg-btl-card border border-btl-card-border rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Camera className="h-5 w-5 text-btl-red" /> Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="h-20 w-20 rounded-full bg-btl-red/20 border-2 border-btl-red/30 flex items-center justify-center text-2xl text-btl-red font-bold uppercase overflow-hidden">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (session?.user?.name || "S")[0]
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Camera className="h-5 w-5 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
                </label>
                {avatarUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">Click the image to upload a new avatar</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-btl-card border border-btl-card-border rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><User className="h-5 w-5 text-btl-red" /> Profile Info</h2>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-btl-dark/50 border-border/50 h-11" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-btl-dark/50 border-border/50 h-11" />
              </div>
              <Button type="submit" disabled={saving} className="bg-btl-red hover:bg-btl-red/90 text-white">
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-btl-card border border-btl-card-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Lock className="h-5 w-5 text-btl-red" /> Change Password</h2>
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Current Password</label>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-btl-dark/50 border-border/50 h-11" required />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">New Password</label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-btl-dark/50 border-border/50 h-11" required />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Confirm New Password</label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-btl-dark/50 border-border/50 h-11" required />
                {newPassword && confirmPassword && (newPassword !== confirmPassword) && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><XCircle className="h-3 w-3" /> Passwords do not match</p>
                )}
                {newPassword && confirmPassword && newPassword === confirmPassword && (
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Passwords match</p>
                )}
              </div>
              <Button type="submit" disabled={saving || !currentPassword || !newPassword || newPassword !== confirmPassword} className="bg-btl-red hover:bg-btl-red/90 text-white">
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Changing...</> : <><Lock className="h-4 w-4 mr-2" /> Change Password</>}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
