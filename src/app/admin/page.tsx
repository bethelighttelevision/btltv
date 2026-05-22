"use client";

import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Users, HelpCircle, Loader2, Database, ArrowUpRight, TrendingUp, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Stats {
  courses: number;
  lessons: number;
  questions: number;
  users: number;
  enrollments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadStats = () => {
    setLoading(true);
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStats(); }, []);

  const seed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Seed failed");
      toast.success(data.message);
      loadStats();
    } catch {
      toast.error("Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  const cards = [
    { label: "Courses", value: stats?.courses ?? 0, icon: BookOpen, color: "text-btl-red", bg: "bg-btl-red/10", border: "border-btl-red/20", desc: "Total courses", href: "/admin/courses" },
    { label: "Lessons", value: stats?.lessons ?? 0, icon: Layers, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", desc: "Across all courses", href: "/admin/courses" },
    { label: "Questions", value: stats?.questions ?? 0, icon: HelpCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", desc: "Quiz questions", href: "/admin/courses" },
    { label: "Students", value: stats?.users ?? 0, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", desc: "Registered users", href: "#" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your Bible School platform</p>
        </div>
        <div className="flex items-center gap-3">
          {stats && stats.courses === 0 && (
            <Button onClick={seed} disabled={seeding} className="bg-btl-red hover:bg-btl-red/90 text-white shadow-lg shadow-btl-red/20">
              {seeding ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Seeding...</> : <><Database className="h-4 w-4 mr-1.5" /> Restore Default Courses</>}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group relative ${card.bg} border ${card.border} rounded-2xl p-5 hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`h-10 w-10 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <ArrowUpRight className={`h-4 w-4 ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className="text-3xl font-bold text-white mb-0.5">{card.value}</div>
            <div className="text-sm font-medium text-gray-300">{card.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{card.desc}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-btl-red" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/courses" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-btl-red/30 transition-all group">
            <BookOpen className="h-6 w-6 text-gray-400 group-hover:text-btl-red transition-colors" />
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Manage Courses</span>
          </Link>
          <Link href="/bible-school" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-btl-red/30 transition-all group">
            <GraduationCap className="h-6 w-6 text-gray-400 group-hover:text-btl-red transition-colors" />
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">View Bible School</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-btl-red/30 transition-all group">
            <Users className="h-6 w-6 text-gray-400 group-hover:text-btl-red transition-colors" />
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">User Dashboard</span>
          </Link>
          <Link href="/admin/courses" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-btl-red/30 transition-all group">
            <Database className="h-6 w-6 text-gray-400 group-hover:text-btl-red transition-colors" />
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Seed Data</span>
          </Link>
        </div>
      </div>

      {/* Enrollments summary */}
      <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-btl-red" /> Enrollments
          </h2>
          <span className="text-2xl font-bold text-white">{stats?.enrollments ?? 0}</span>
        </div>
        <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-btl-red to-orange-400 transition-all duration-500"
            style={{ width: `${Math.min(100, ((stats?.enrollments ?? 0) / Math.max(1, (stats?.users ?? 1))) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {stats?.enrollments ?? 0} enrollments across {stats?.courses ?? 0} courses
        </p>
      </div>
    </div>
  );
}
