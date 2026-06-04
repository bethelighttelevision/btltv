"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SEO_KEYS = ["seoMetaTitle", "seoMetaDescription", "seoOgImage"];

export default function SEOSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ seoMetaTitle: "", seoMetaDescription: "", seoOgImage: "" });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => { if (data && typeof data === "object") setForm((f) => ({ ...f, ...data })); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    const payload: Record<string, string> = {};
    SEO_KEYS.forEach((k) => { payload[k] = (form as any)[k] || ""; });
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) toast.success("SEO settings saved"); else toast.error("Failed to save");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">SEO Settings</h1>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Default Meta Title</label>
          <input value={form.seoMetaTitle} onChange={(e) => setForm({ ...form, seoMetaTitle: e.target.value })}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Default Meta Description</label>
          <textarea value={form.seoMetaDescription} onChange={(e) => setForm({ ...form, seoMetaDescription: e.target.value })} rows={3}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Default OG Image URL</label>
          <input value={form.seoOgImage} onChange={(e) => setForm({ ...form, seoOgImage: e.target.value })}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60">
          <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save SEO Settings"}
        </button>
      </div>
    </div>
  );
}
