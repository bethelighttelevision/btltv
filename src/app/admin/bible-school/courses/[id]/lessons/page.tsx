"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Pencil, Trash2, FileQuestion, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function AdminLessonsPage() {
  const { id } = useParams<{ id: string }>();
  const [lessons, setLessons] = useState<any[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", youtubeId: "", pdfUrl: "", content: "", order: 0 });

  const fetchData = async () => {
    const [cRes, lRes] = await Promise.all([fetch(`/api/admin/bible-school/courses/${id}`), fetch(`/api/admin/bible-school/courses/${id}/lessons`)]);
    if (cRes.ok) setCourse(await cRes.json());
    if (lRes.ok) setLessons(await lRes.json());
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, [id]);

  const save = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    const url = editing ? `/api/admin/bible-school/lessons/${editing.id}` : `/api/admin/bible-school/courses/${id}/lessons`;
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { toast.success(editing ? "Updated" : "Created"); setShowForm(false); setEditing(null); setForm({ title: "", description: "", youtubeId: "", pdfUrl: "", content: "", order: 0 }); fetchData(); }
    else toast.error("Failed");
  };

  const del = async (lessonId: string) => {
    if (!confirm("Delete?")) return;
    const res = await fetch(`/api/admin/bible-school/lessons/${lessonId}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); fetchData(); } else toast.error("Failed");
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/bible-school" className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"><ArrowLeft className="h-4 w-4 text-gray-400" /></Link>
        <div>
          <h1 className="text-xl font-bold text-white">{course?.title || "Course"} — Lessons</h1>
          <p className="text-xs text-gray-500">Manage lessons and quizzes</p>
        </div>
      </div>

      <button onClick={() => { setEditing(null); setForm({ title: "", description: "", youtubeId: "", pdfUrl: "", content: "", order: lessons.length }); setShowForm(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors mb-4">
        <Plus className="h-3.5 w-3.5" /> Add Lesson
      </button>

      {showForm && (
        <div className="mb-6 bg-black/40 border border-white/[0.06] rounded-lg p-4 space-y-3">
          <h2 className="text-sm font-semibold text-white">{editing ? "Edit Lesson" : "New Lesson"}</h2>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="YouTube Video ID" value={form.youtubeId} onChange={(e) => setForm({ ...form, youtubeId: e.target.value })} className="bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
            <input placeholder="PDF URL (optional)" value={form.pdfUrl} onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })} className="bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
            <input placeholder="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
          </div>
          <textarea placeholder="Lesson content (HTML or markdown text)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 py-2 h-32 focus:outline-none focus:border-btl-red/50" />
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg">{editing ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {lessons.map((l) => (
          <div key={l.id} className="bg-black/40 border border-white/[0.06] rounded-lg p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">#{l.order + 1}</span>
                <h3 className="text-sm font-semibold text-white">{l.title}</h3>
              </div>
              <p className="text-[11px] text-gray-500">{l._count?.questions || 0} questions</p>
            </div>
            <div className="flex items-center gap-1">
              <Link href={`/admin/bible-school/courses/${id}/lessons/${l.id}/questions`} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center" title="Quiz"><FileQuestion className="h-4 w-4 text-gray-400" /></Link>
              <button onClick={() => { setForm({ title: l.title, description: l.description || "", youtubeId: l.youtubeId || "", pdfUrl: l.pdfUrl || "", content: l.content || "", order: l.order }); setEditing(l); setShowForm(true); }} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"><Pencil className="h-4 w-4 text-gray-400" /></button>
              <button onClick={() => del(l.id)} className="h-8 w-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center"><Trash2 className="h-4 w-4 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
