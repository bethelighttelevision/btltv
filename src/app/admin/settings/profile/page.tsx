"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Mail, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
    setLoading(false);
  }, [session]);

  const save = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    const res = await fetch("/api/admin/profile", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      toast.success("Profile updated");
      await update({ name: name.trim() });
    } else {
      toast.error("Failed to update");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Profile</h1>
      <div className="max-w-sm space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold flex items-center gap-1">
            <Mail className="h-3 w-3" /> Email
          </label>
          <div className="w-full bg-black/30 border border-white/[0.08] text-gray-400 text-sm rounded-lg px-3 h-10 mt-1 flex items-center">
            {session?.user?.email || "-"}
          </div>
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold flex items-center gap-1">
            <User className="h-3 w-3" /> Display Name
          </label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60">
          <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}
