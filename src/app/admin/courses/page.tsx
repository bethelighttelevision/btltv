"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  published: boolean;
  _count: { lessons: number; enrollments: number };
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", image: "", category: "general" });

  const load = () => {
    setLoading(true);
    fetch("/api/courses").then((r) => r.json()).then(setCourses).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) return toast.error("Failed to create course");
    toast.success("Course created");
    setShowForm(false);
    setForm({ title: "", description: "", image: "", category: "general" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this course and all its lessons?")) return;
    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Failed to delete");
    toast.success("Course deleted");
    load();
  };

  const togglePublish = async (course: Course) => {
    await fetch(`/api/courses/${course.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...course, published: !course.published }),
    });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Courses</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-btl-red hover:bg-btl-red/90 text-white">
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "Add Course"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-[#111] border border-white/5 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-btl-red" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-btl-red" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-btl-red resize-none" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Image URL</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-btl-red" />
          </div>
          <Button type="submit" className="bg-btl-red hover:bg-btl-red/90 text-white">Create Course</Button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No courses yet. Click "Add Course" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="bg-[#111] border border-white/5 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => togglePublish(course)} className={`h-2.5 w-2.5 rounded-full ${course.published ? "bg-green-500" : "bg-gray-600"}`} title={course.published ? "Published" : "Draft"} />
                <div>
                  <h3 className="text-white font-semibold">{course.title}</h3>
                  <p className="text-xs text-gray-500">{course._count.lessons} lessons · {course._count.enrollments} enrollments</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/courses/${course.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white"><Edit className="h-4 w-4" /></Button>
                </Link>
                <Link href={`/admin/courses/${course.id}/lessons`}>
                  <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-white text-xs">
                    <BookOpen className="h-3.5 w-3.5 mr-1" /> Lessons
                  </Button>
                </Link>
                <button onClick={() => remove(course.id)} className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
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
