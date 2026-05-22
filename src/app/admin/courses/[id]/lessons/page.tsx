"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Plus, Edit, Trash2, HelpCircle, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  order: number;
  _count: { questions: number };
}

export default function AdminLessons() {
  const { id: courseId } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/courses/${courseId}`).then((r) => r.json()),
      fetch(`/api/courses/${courseId}/lessons`).then((r) => r.json()),
    ]).then(([course, lessons]) => {
      setCourseTitle(course.title);
      setLessons(lessons);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [courseId]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    const res = await fetch(`/api/courses/${courseId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) return toast.error("Failed to create lesson");
    toast.success("Lesson created!");
    setShowForm(false);
    setForm({ title: "", content: "" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this lesson and its questions?")) return;
    const res = await fetch(`/api/lessons/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Failed to delete");
    toast.success("Lesson deleted");
    load();
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => router.push("/admin/courses")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{courseTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">{lessons.length} lesson{lessons.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-btl-red hover:bg-btl-red/90 text-white shadow-lg shadow-btl-red/20">
          <Plus className="h-4 w-4 mr-1.5" /> {showForm ? "Cancel" : "Add Lesson"}
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={create} className="bg-gradient-to-b from-[#111] to-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">New Lesson</h2>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Lesson Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-btl-red/50 transition-colors" placeholder="e.g. Introduction to the Bible" required />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Content (markdown supported)</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-btl-red/50 transition-colors resize-none" placeholder="Lesson content..." />
          </div>
          <Button type="submit" className="bg-btl-red hover:bg-btl-red/90 text-white">
            <Save className="h-4 w-4 mr-1.5" /> Create Lesson
          </Button>
        </form>
      )}

      {/* Lesson list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-20 bg-[#111] border border-white/[0.06] rounded-2xl">
          <div className="h-16 w-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-gray-600" />
          </div>
          <p className="text-gray-400 font-medium">No lessons yet</p>
          <p className="text-sm text-gray-600 mt-1">Click "Add Lesson" to create your first lesson.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, i) => (
            <div key={lesson.id} className="bg-[#111] hover:bg-[#151515] border border-white/[0.06] rounded-xl p-4 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-sm text-gray-500 font-mono shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate">{lesson.title}</h3>
                  <span className="text-xs text-gray-500">{lesson._count.questions} question{lesson._count.questions !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/admin/lessons/${lesson.id}/questions`}>
                    <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-lg text-xs gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5" /> Questions
                    </Button>
                  </Link>
                  <Link href={`/admin/lessons/${lesson.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-lg">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <button onClick={() => remove(lesson.id)} className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
