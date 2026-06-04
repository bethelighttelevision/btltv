"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const CATEGORIES = ["Talk Show", "Devotional", "Documentary", "Drama", "Social Issues", "Health", "Education", "Bible School", "Kids"];

export default function EditShowPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/shows`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const show = data.find((s: any) => s.id === params.id);
          if (show) setForm(show);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const save = async () => {
    if (!form?.title) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      title: form.title,
      titleUrdu: form.titleUrdu,
      slug: form.slug,
      category: form.category,
      playlistId: form.playlistId,
      thumbnail: form.thumbnail,
      description: form.description,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      order: form.order,
    };
    const res = await fetch(`/api/admin/shows/${params.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { toast.success("Show updated"); router.push("/admin/shows"); }
    else { const err = await res.json().catch(() => null); toast.error(err?.message || "Failed to update"); }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;
  if (!form) return <div className="text-center py-20 text-gray-500 text-sm">Show not found</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/shows" className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.04]"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="text-xl font-bold text-white">Edit Show</h1>
      </div>
      <div className="max-w-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Title (English)</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Title (Urdu)</label>
            <input value={form.titleUrdu || ""} onChange={(e) => setForm({ ...form, titleUrdu: e.target.value })}
              className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">YouTube Playlist ID</label>
            <input value={form.playlistId || ""} onChange={(e) => setForm({ ...form, playlistId: e.target.value })}
              className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Description</label>
            <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
              className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-btl-red/50" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-xs text-gray-400">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-btl-red" /> Active
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-400">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-btl-red" /> Featured
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60">
            <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Update Show"}
          </button>
          <Link href="/admin/shows" className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 text-xs font-semibold rounded-lg transition-colors">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
