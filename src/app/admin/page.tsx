"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  HelpCircle,
  Loader2,
  ArrowUpRight,
  TrendingUp,
  Layers,
  Smartphone,
  Globe,
  Download,
  Activity,
  Calendar,
  Clock,
  ChevronRight,
  BookMarked,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  courses: number;
  lessons: number;
  questions: number;
  users: number;
  enrollments: number;
}

interface DownloadStats {
  total: number;
  today: number;
  yesterday: number;
  byCountry: { country: string; _count: number }[];
  byPlatform: { platform: string; _count: number }[];
  recent: { id: string; country: string; city: string; platform: string; createdAt: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [downloadStats, setDownloadStats] = useState<DownloadStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/stats/downloads").then((r) => r.json()).catch(() => null),
    ])
      .then(([s, d]) => {
        setStats(s);
        setDownloadStats(d);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const glanceCards = [
    {
      label: "Courses",
      value: stats?.courses ?? 0,
      icon: BookOpen,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      change: "+0",
      href: "/admin/courses",
    },
    {
      label: "Lessons",
      value: stats?.lessons ?? 0,
      icon: Layers,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      change: "+0",
      href: "/admin/courses",
    },
    {
      label: "Students",
      value: stats?.users ?? 0,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      change: "+0",
      href: "#",
    },
    {
      label: "Enrollments",
      value: stats?.enrollments ?? 0,
      icon: BookMarked,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      change: "+0",
      href: "#",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Panel */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1a2e] via-[#16162a] to-[#111] border border-white/[0.06] p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-btl-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-btl-red/15 border border-btl-red/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-btl-red" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Welcome back<span className="text-btl-red">.</span>
              </h1>
              <p className="text-sm text-gray-500">
                Here&apos;s what&apos;s happening with your platform today.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-3">
              <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                <Calendar className="h-3 w-3" /> Total Courses
              </div>
              <div className="text-xl font-bold text-white">{stats?.courses ?? 0}</div>
            </div>
            <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-3">
              <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                <Users className="h-3 w-3" /> Registered Users
              </div>
              <div className="text-xl font-bold text-white">{stats?.users ?? 0}</div>
            </div>
            <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-3">
              <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                <Download className="h-3 w-3" /> App Downloads
              </div>
              <div className="text-xl font-bold text-white">{downloadStats?.total ?? 0}</div>
            </div>
            <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-3">
              <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                <Clock className="h-3 w-3" /> Today
              </div>
              <div className="text-xl font-bold text-btl-red">{downloadStats?.today ?? 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* At a Glance */}
          <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-btl-red" />
                At a Glance
              </h2>
              <Link href="/admin/courses" className="text-xs text-btl-red hover:text-btl-red/80 transition-colors">
                Manage Courses
              </Link>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {glanceCards.map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1] rounded-lg p-4 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-9 w-9 rounded-lg ${card.bg} border ${card.border} flex items-center justify-center`}>
                      <card.icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                    <ArrowUpRight
                      className={`h-3.5 w-3.5 ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                  </div>
                  <div className="text-2xl font-bold text-white mb-0.5">{card.value}</div>
                  <div className="text-xs text-gray-400">{card.label}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* App Download Stats (if available) */}
          {downloadStats && downloadStats.byCountry.length > 0 && (
            <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Globe className="h-4 w-4 text-btl-red" />
                  Downloads by Country
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    Total: <span className="text-white font-semibold">{downloadStats.total}</span>
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                {downloadStats.byCountry.slice(0, 8).map((c) => {
                  const maxCount = Math.max(...downloadStats.byCountry.map((x) => x._count));
                  return (
                    <div key={c.country} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-28 md:w-36 truncate">
                        {c.country || "Unknown"}
                      </span>
                      <div className="flex-1 bg-white/[0.06] rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-btl-red to-red-400 transition-all duration-500"
                          style={{ width: `${(c._count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-white font-semibold w-8 text-right tabular-nums">
                        {c._count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-btl-red" />
                Quick Actions
              </h2>
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link
                href="/admin/courses"
                className="flex flex-col items-center gap-2.5 p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-btl-red/30 transition-all group"
              >
                <BookOpen className="h-6 w-6 text-gray-500 group-hover:text-btl-red transition-colors" />
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors font-medium">
                  Courses
                </span>
              </Link>
              <Link
                href="/"
                className="flex flex-col items-center gap-2.5 p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-btl-red/30 transition-all group"
              >
                <Smartphone className="h-6 w-6 text-gray-500 group-hover:text-btl-red transition-colors" />
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors font-medium">
                  Download App
                </span>
              </Link>
              <Link
                href="/bible-school"
                className="flex flex-col items-center gap-2.5 p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-btl-red/30 transition-all group"
              >
                <BookMarked className="h-6 w-6 text-gray-500 group-hover:text-btl-red transition-colors" />
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors font-medium">
                  Bible School
                </span>
              </Link>
              <Link
                href="/shows"
                className="flex flex-col items-center gap-2.5 p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-btl-red/30 transition-all group"
              >
                <FileText className="h-6 w-6 text-gray-500 group-hover:text-btl-red transition-colors" />
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors font-medium">
                  All Shows
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Sidebar Widgets */}
        <div className="space-y-6">
          {/* Recent Downloads */}
          {downloadStats && downloadStats.recent.length > 0 && (
            <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Download className="h-4 w-4 text-btl-red" />
                  Recent Downloads
                </h2>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {downloadStats.recent.slice(0, 5).map((d) => (
                  <div key={d.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white font-medium">
                        {d.country || "Unknown"}
                        {d.city ? `, ${d.city}` : ""}
                      </span>
                      <span className="text-[10px] text-gray-500 tabular-nums">
                        {new Date(d.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-3 w-3 text-gray-500" />
                      <span className="text-[10px] text-gray-500 capitalize">{d.platform}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Stats */}
          {downloadStats && (
            <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-btl-red" />
                  Today Overview
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Today</span>
                  <span className="text-lg font-bold text-btl-red">{downloadStats.today}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Yesterday</span>
                  <span className="text-lg font-bold text-white">{downloadStats.yesterday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Total Downloads</span>
                  <span className="text-lg font-bold text-white">{downloadStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Countries</span>
                  <span className="text-lg font-bold text-white flex items-center gap-1">
                    <Globe className="h-4 w-4 text-btl-red" />
                    {downloadStats.byCountry.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Enrollments Widget */}
          <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <BookMarked className="h-4 w-4 text-btl-red" />
                Enrollments
              </h2>
            </div>
            <div className="p-5">
              <div className="text-3xl font-bold text-white mb-1">{stats?.enrollments ?? 0}</div>
              <div className="text-xs text-gray-500 mb-3">
                across {stats?.courses ?? 0} courses
              </div>
              <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-btl-red to-orange-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, ((stats?.enrollments ?? 0) / Math.max(1, (stats?.users ?? 1))) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-1.5">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
