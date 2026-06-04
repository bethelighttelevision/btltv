"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Calendar, BookOpen, Loader2, Search, Trash2, CheckCircle, XCircle, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
  createdAt: string;
  _count: { enrollments: number };
  enrollments: { completed: boolean }[];
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/students")
      .then((r) => r.json())
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name || "Unknown"}"? This cannot be undone.`)) return;
    const res = await fetch("/api/admin/students", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });
    if (!res.ok) return toast.error("Failed to delete user");
    toast.success("User deleted");
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const filtered = students.filter(
    (s) =>
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalEnrollments = students.reduce((sum, s) => sum + s._count.enrollments, 0);
  const completedCount = students.reduce(
    (sum, s) => sum + s.enrollments.filter((e) => e.completed).length,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
          <p className="text-sm text-gray-500">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#111] border border-white/[0.06] rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Users className="h-3.5 w-3.5 text-purple-400" />
            Total Students
          </div>
          <div className="text-2xl font-bold text-white">{students.length}</div>
        </div>
        <div className="bg-[#111] border border-white/[0.06] rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
            Total Enrollments
          </div>
          <div className="text-2xl font-bold text-white">{totalEnrollments}</div>
        </div>
        <div className="bg-[#111] border border-white/[0.06] rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            Course Completions
          </div>
          <div className="text-2xl font-bold text-white">{completedCount}</div>
        </div>
        <div className="bg-[#111] border border-white/[0.06] rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            Enrolled Students
          </div>
          <div className="text-2xl font-bold text-white">
            {students.filter((s) => s._count.enrollments > 0).length}
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-btl-red" />
            Registered Students
          </h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-btl-red/40 transition-colors"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-5 py-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">Email</th>
                <th className="text-center px-5 py-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">Role</th>
                <th className="text-center px-5 py-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">Enrollments</th>
                <th className="text-center px-5 py-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">Completed</th>
                <th className="text-left px-5 py-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">Joined</th>
                <th className="text-center px-5 py-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-gray-500">
                    {search ? "No students match your search." : "No students registered yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-btl-red/15 border border-btl-red/20 flex items-center justify-center text-xs text-btl-red font-bold uppercase">
                          {(s.name || s.email)[0]}
                        </div>
                        <span className="text-sm text-white font-medium truncate max-w-[150px]">
                          {s.name || "Unnamed"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Mail className="h-3 w-3" />
                        {s.email}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        s.role === "admin" ? "bg-btl-red/10 text-btl-red" : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {s.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-sm text-white font-semibold tabular-nums">{s._count.enrollments}</td>
                    <td className="px-5 py-3 text-center">
                      {s.enrollments.filter((e) => e.completed).length > 0 ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400 inline" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-600 inline" />
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {s.role !== "admin" && (
                        <button
                          onClick={() => remove(s.id, s.name || s.email)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1"
                          title="Delete user"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
