"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LiveTVPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ streamUrl: "", isLive: false, offlineMessage: "", schedule: "" });

  useEffect(() => {
    fetch("/api/admin/live-tv")
      .then((r) => r.json())
      .then((data) => { if (data?.id) setForm(data); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/live-tv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { toast.success("Live TV settings updated"); } else toast.error("Failed to save");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Live TV</h1>
      </div>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Live Stream URL</label>
          <input value={form.streamUrl || ""} onChange={(e) => setForm({ ...form, streamUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..."
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isLive" checked={form.isLive} onChange={(e) => setForm({ ...form, isLive: e.target.checked })} className="accent-btl-red" />
          <label htmlFor="isLive" className="text-xs text-gray-300">Stream is Live</label>
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Offline Message</label>
          <textarea value={form.offlineMessage || ""} onChange={(e) => setForm({ ...form, offlineMessage: e.target.value })} rows={3} placeholder="No live stream currently..."
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Schedule (optional)</label>
          <input value={form.schedule || ""} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="e.g., Sundays at 10:00 AM"
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60">
          <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
