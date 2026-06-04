"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const save = async () => {
    if (!form.currentPassword || !form.newPassword) { toast.error("All fields required"); return; }
    if (form.newPassword !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (form.newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSaving(true);
    const res = await fetch("/api/admin/change-password", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
    });
    if (res.ok) { toast.success("Password updated"); setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
    else { const d = await res.json(); toast.error(d.error || "Failed to update"); }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Change Password</h1>
      <div className="max-w-sm space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Current Password</label>
          <input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">New Password</label>
          <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Confirm New Password</label>
          <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60">
          <Save className="h-3.5 w-3.5" /> {saving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
