"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function EditLesson() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    fetch(`/api/lessons/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({ title: data.title, content: data.content || "" });
        setLoading(false);
      });
  }, [id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/lessons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) { toast.error("Failed to update"); setSaving(false); return; }
    toast.success("Lesson updated!");
    router.back();
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
    </div>
  );

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Lesson</h1>
        <p className="text-sm text-gray-500 mt-1">{form.title}</p>
      </div>

      <form onSubmit={save} className="max-w-2xl bg-[#111] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-btl-red/50 transition-colors" required />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Content (markdown)</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-btl-red/50 transition-colors resize-none" />
        </div>
        <Button type="submit" disabled={saving} className="bg-btl-red hover:bg-btl-red/90 text-white shadow-lg shadow-btl-red/20">
          {saving ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-1.5" /> Save Changes</>}
        </Button>
      </form>
    </div>
  );
}
