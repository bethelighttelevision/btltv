"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siteName: "", siteTagline: "",
    contactEmail: "", facebook: "", youtube: "", instagram: "", twitter: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => { if (data && typeof data === "object") setForm((f) => ({ ...f, ...data })); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) toast.success("Settings saved"); else toast.error("Failed to save");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">General Settings</h1>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Site Name</label>
          <input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Site Tagline</label>
          <input value={form.siteTagline} onChange={(e) => setForm({ ...form, siteTagline: e.target.value })}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Contact Email</label>
          <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div className="pt-2 border-t border-white/[0.04]">
          <h3 className="text-xs text-gray-400 font-semibold mb-3">Social Media Links</h3>
          <div className="space-y-3">
            {(["facebook", "youtube", "instagram", "twitter"] as const).map((s) => (
              <div key={s}>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{s}</label>
                <input value={(form as any)[s] || ""} onChange={(e) => setForm({ ...form, [s]: e.target.value })}
                  className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
              </div>
            ))}
          </div>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60 mt-2">
          <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
