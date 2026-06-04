"use client";

import { useState, useEffect } from "react";
import { UserCircle, Camera, Save, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function AdminProfile() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
    if (!res.ok) { toast.error("Failed to upload avatar"); setAvatarUploading(false); return; }
    toast.success("Avatar updated!");
    await update();
    setAvatarUploading(false);
  };

  const saveProfile = async () => {
    if (!name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Failed to update profile");
      toast.success("Profile updated!");
      await update();
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword) return toast.error("Fill in both password fields");
    if (newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    setSaving(true);
    const res = await fetch("/api/auth/change-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) { const err = await res.json(); return toast.error(err.error || "Failed to change password"); }
    toast.success("Password changed!");
    setCurrentPassword("");
    setNewPassword("");
    setSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-btl-red" />
            Profile Picture
          </h2>
        </div>
        <div className="p-5 flex items-center gap-6">
          <div className="relative group">
            <div className="h-20 w-20 rounded-full bg-btl-red/20 border-2 border-btl-red/30 flex items-center justify-center text-2xl text-btl-red font-bold uppercase overflow-hidden">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                (session?.user?.name || "A")[0]
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
          <div>
            <p className="text-sm text-white font-medium">{session?.user?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
            <p className="text-[10px] text-gray-600 mt-1">Click the image to upload a new avatar</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-btl-red" />
            Profile Information
          </h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-btl-red/40 transition-colors"
              placeholder="Your full name" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-btl-red/40 transition-colors" />
            <p className="text-[10px] text-gray-600 mt-1">Changing email will update your login email</p>
          </div>
          <button onClick={saveProfile} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-btl-red hover:bg-btl-red/80 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-btl-red" />
            Change Password
          </h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Current Password</label>
            <input type={showPw ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-btl-red/40 transition-colors"
              placeholder="Enter current password" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">New Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-btl-red/40 transition-colors pr-10"
                placeholder="Enter new password (min 6 chars)" />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <button onClick={changePassword} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold rounded-lg transition-colors border border-white/[0.1] disabled:opacity-50">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
