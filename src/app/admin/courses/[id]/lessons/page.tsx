"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash2, HelpCircle, Loader2 } from "lucide-react";
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
    toast.success("Lesson created");
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
    <div>
      <button onClick={() => router.push("/admin/courses")} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Lessons: {courseTitle}</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-btl-red hover:bg-btl-red/90 text-white">
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "Add Lesson"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-[#111] border border-white/5 rounded-xl p-6 mb-6 space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Lesson Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-btl-red" required />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Content (markdown supported)</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-btl-red resize-none" />
          </div>
          <Button type="submit" className="bg-btl-red hover:bg-btl-red/90 text-white">Create Lesson</Button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No lessons yet. Click "Add Lesson" to create one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, i) => (
            <div key={lesson.id} className="bg-[#111] border border-white/5 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-sm w-6">{i + 1}.</span>
                <div>
                  <h3 className="text-white font-medium">{lesson.title}</h3>
                  <span className="text-xs text-gray-500">{lesson._count.questions} questions</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/lessons/${lesson.id}/questions`}>
                  <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-white text-xs">
                    <HelpCircle className="h-3.5 w-3.5 mr-1" /> Questions
                  </Button>
                </Link>
                <Link href={`/admin/lessons/${lesson.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white"><Edit className="h-4 w-4" /></Button>
                </Link>
                <button onClick={() => remove(lesson.id)} className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
