"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditLesson() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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
    const res = await fetch(`/api/lessons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) return toast.error("Failed to update");
    toast.success("Lesson updated");
    router.back();
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-400"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>;

  return (
    <div>
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Lesson</h1>
      <form onSubmit={save} className="max-w-2xl bg-[#111] border border-white/5 rounded-xl p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-btl-red" required />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Content (markdown)</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-btl-red resize-none" />
        </div>
        <Button type="submit" className="bg-btl-red hover:bg-btl-red/90 text-white">Save Changes</Button>
      </form>
    </div>
  );
}
