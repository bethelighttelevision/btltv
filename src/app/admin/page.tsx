"use client";

import { useEffect, useState } from "react";
import { Loader2, Tv, Users, Video, Radio, TrendingUp, Download } from "lucide-react";
import Link from "next/link";

interface Stats { shows: number; videos: number; team: number; isLive: boolean; }
interface DownloadStats { total: number; today: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [dlStats, setDlStats] = useState<DownloadStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => null);
    fetch("/api/stats/downloads")
      .then((r) => r.json())
      .then((d) => setDlStats({ total: d.total, today: d.today }))
      .catch(() => null);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16162a] to-[#111] border border-white/[0.06] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-btl-red/15 border border-btl-red/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-btl-red" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome to BTL TV Admin Panel</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-3">
            <Tv className="h-4 w-4 text-btl-red mb-1" />
            <div className="text-2xl font-bold text-white">{stats?.shows ?? "-"}</div>
            <div className="text-[10px] text-gray-500">Shows</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-3">
            <Video className="h-4 w-4 text-blue-400 mb-1" />
            <div className="text-2xl font-bold text-white">{stats?.videos ?? "-"}</div>
            <div className="text-[10px] text-gray-500">Videos</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-3">
            <Users className="h-4 w-4 text-emerald-400 mb-1" />
            <div className="text-2xl font-bold text-white">{stats?.team ?? "-"}</div>
            <div className="text-[10px] text-gray-500">Team</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-3">
            <Radio className="h-4 w-4 text-purple-400 mb-1" />
            <div className="text-2xl font-bold text-white">{stats?.isLive ? "Live" : "Offline"}</div>
            <div className="text-[10px] text-gray-500">Live TV</div>
          </div>
          <Link href="/admin/downloads" className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-3 hover:border-btl-red/30 transition-colors">
            <Download className="h-4 w-4 text-amber-400 mb-1" />
            <div className="text-2xl font-bold text-white">{dlStats?.today ?? "-"}</div>
            <div className="text-[10px] text-gray-500">Downloads Today</div>
          </Link>
        </div>
      </div>
      <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/shows" className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-btl-red/30 transition-all text-center">
            <Tv className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <span className="text-xs text-gray-400">Manage Shows</span>
          </Link>
          <Link href="/admin/team" className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-btl-red/30 transition-all text-center">
            <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <span className="text-xs text-gray-400">Manage Team</span>
          </Link>
          <Link href="/admin/live-tv" className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-btl-red/30 transition-all text-center">
            <Radio className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <span className="text-xs text-gray-400">Live TV</span>
          </Link>
          <Link href="/admin/downloads" className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-btl-red/30 transition-all text-center">
            <Download className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <span className="text-xs text-gray-400">Download Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
