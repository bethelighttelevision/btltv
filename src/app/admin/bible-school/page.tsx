"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Pencil, Trash2, BookOpen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminBibleSchoolPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", slug: "", description: "", thumbnail: "", level: "intro", creditText: "", order: 0, isPublished: false });

  const fetchCourses = async () => {
    const res = await fetch("/api/admin/bible-school/courses");
    if (res.ok) setCourses(await res.json());
    setLoading(false);
  };
  useEffect(() => { fetchCourses(); }, []);

  const save = async () => {
    if (!form.title || !form.slug) { toast.error("Title and slug required"); return; }
    const url = editing ? `/api/admin/bible-school/courses/${editing.id}` : "/api/admin/bible-school/courses";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { toast.success(editing ? "Updated" : "Created"); setShowForm(false); setEditing(null); setForm({ title: "", slug: "", description: "", thumbnail: "", level: "intro", creditText: "", order: 0, isPublished: false }); fetchCourses(); }
    else toast.error("Failed");
  };

  const del = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    const res = await fetch(`/api/admin/bible-school/courses/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); fetchCourses(); } else toast.error("Failed");
  };

  const edit = (c: any) => {
    setForm({ title: c.title, slug: c.slug, description: c.description || "", thumbnail: c.thumbnail || "", level: c.level, creditText: c.creditText || "", order: c.order, isPublished: c.isPublished });
    setEditing(c); setShowForm(true);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Bible School</h1>
        <button onClick={() => { setEditing(null); setForm({ title: "", slug: "", description: "", thumbnail: "", level: "intro", creditText: "", order: 0, isPublished: false }); setShowForm(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors">
          <Plus className="h-3.5 w-3.5" /> New Course
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-black/40 border border-white/[0.06] rounded-lg p-4 space-y-3">
          <h2 className="text-sm font-semibold text-white">{editing ? "Edit Course" : "New Course"}</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="col-span-2 bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
            <input placeholder="Slug (e.g. old-testament)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
            <input placeholder="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50">
              <option value="intro">Introductory</option>
              <option value="advanced">Advanced</option>
            </select>
            <input placeholder="Credit text (e.g. Adapted from...)" value={form.creditText} onChange={(e) => setForm({ ...form, creditText: e.target.value })} className="bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
            <label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Published</label>
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 py-2 h-20 focus:outline-none focus:border-btl-red/50" />
          <input placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg">{editing ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {courses.map((c) => (
          <div key={c.id} className="bg-black/40 border border-white/[0.06] rounded-lg p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.level === "intro" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>{c.level}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.isPublished ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{c.isPublished ? "Published" : "Draft"}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-1">{c.title}</h3>
              <p className="text-[11px] text-gray-500">{c._count?.lessons || 0} lessons · {c._count?.enrollments || 0} enrollments</p>
            </div>
            <div className="flex items-center gap-1">
              <Link href={`/admin/bible-school/courses/${c.id}/lessons`} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center" title="Lessons"><BookOpen className="h-4 w-4 text-gray-400" /></Link>
              <button onClick={() => edit(c)} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"><Pencil className="h-4 w-4 text-gray-400" /></button>
              <button onClick={() => del(c.id)} className="h-8 w-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center"><Trash2 className="h-4 w-4 text-red-400" /></button>
            </div>
          </div>
        ))}
        {courses.length === 0 && <p className="text-sm text-gray-500 text-center py-10">No courses yet.</p>}
      </div>
    </div>
  );
}
