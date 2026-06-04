"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, BookOpen, Loader2, Search, Eye, EyeOff, X, Check } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", description: "", image: "", category: "general" });

  const load = () => {
    setLoading(true);
    fetch("/api/courses").then((r) => r.json()).then((data) => setCourses(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
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
    toast.success("Course created!");
    setShowForm(false);
    setForm({ title: "", description: "", image: "", category: "general" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this course and all its lessons & questions?")) return;
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

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Courses</h1>
          <p className="text-sm text-gray-500 mt-1">{courses.length} course{courses.length !== 1 ? "s" : ""} total</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-btl-red hover:bg-btl-red/90 text-white shadow-lg shadow-btl-red/20">
          {showForm ? <X className="h-4 w-4 mr-1.5" /> : <Plus className="h-4 w-4 mr-1.5" />}
          {showForm ? "Cancel" : "New Course"}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full bg-[#111] border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-btl-red/50 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={create} className="bg-gradient-to-b from-[#111] to-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-2">Create New Course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Course Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-btl-red/50 transition-colors placeholder-gray-600" placeholder="e.g. Bible Basics" required />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-btl-red/50 transition-colors placeholder-gray-600" placeholder="e.g. general" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-btl-red/50 transition-colors placeholder-gray-600 resize-none" placeholder="Brief description of the course..." />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Image URL (optional)</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-btl-red/50 transition-colors placeholder-gray-600" placeholder="https://example.com/image.jpg" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-btl-red hover:bg-btl-red/90 text-white shadow-lg shadow-btl-red/20">
              <Check className="h-4 w-4 mr-1.5" /> Create Course
            </Button>
            <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="border-white/[0.08] text-gray-400 hover:text-white">
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Course list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
            <p className="text-sm text-gray-500">Loading courses...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#111] border border-white/[0.06] rounded-2xl">
          <div className="h-16 w-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-gray-600" />
          </div>
          <p className="text-gray-400 font-medium mb-1">
            {search ? "No courses match your search" : "No courses yet"}
          </p>
          <p className="text-sm text-gray-600 mb-6">
            {search ? "Try a different search term" : 'Click "New Course" to create your first course.'}
          </p>
          {!search && (
            <Button onClick={() => setShowForm(true)} className="bg-btl-red hover:bg-btl-red/90 text-white">
              <Plus className="h-4 w-4 mr-1.5" /> Create Your First Course
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((course) => (
            <div key={course.id} className="group bg-[#111] hover:bg-[#151515] border border-white/[0.06] hover:border-white/[0.1] rounded-2xl p-5 transition-all duration-200">
              <div className="flex items-center gap-4">
                {/* Status dot */}
                <button
                  onClick={() => togglePublish(course)}
                  className={`h-3 w-3 rounded-full shrink-0 transition-colors ${
                    course.published ? "bg-green-500 shadow-sm shadow-green-500/30" : "bg-gray-600"
                  }`}
                  title={course.published ? "Published" : "Draft"}
                />

                {/* Thumbnail */}
                {course.image ? (
                  <div className="h-12 w-20 rounded-lg overflow-hidden shrink-0 bg-black/50 border border-white/[0.06]">
                    <img src={course.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-12 w-20 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-gray-600" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-white font-semibold truncate">{course.title}</h3>
                    {!course.published && (
                      <span className="text-[10px] font-medium text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">Draft</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{course.description || "No description"}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] text-gray-600 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {course._count.lessons} lesson{course._count.lessons !== 1 ? "s" : ""}
                    </span>
                    <span className="text-[11px] text-gray-600">{course._count.enrollments} enrollment{course._count.enrollments !== 1 ? "s" : ""}</span>
                    {course.category !== "general" && (
                      <span className="text-[11px] text-gray-600">· {course.category}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link href={`/admin/courses/${course.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-xl">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/courses/${course.id}/lessons`}>
                    <Button variant="ghost" size="sm" className="h-9 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-xl text-xs gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" /> Lessons
                    </Button>
                  </Link>
                  <button
                    onClick={() => togglePublish(course)}
                    className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all"
                    title={course.published ? "Unpublish" : "Publish"}
                  >
                    {course.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => remove(course.id)}
                    className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
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
