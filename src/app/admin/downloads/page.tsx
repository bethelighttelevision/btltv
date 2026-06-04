"use client";

import { useEffect, useState } from "react";
import {
  Download, Globe, Smartphone, Loader2, Calendar, TrendingUp,
  Monitor,
} from "lucide-react";

interface DownloadStats {
  total: number;
  today: number;
  yesterday: number;
  byCountry: { country: string; _count: number }[];
  byPlatform: { platform: string; _count: number }[];
  recent: { id: string; country: string; city: string; platform: string; createdAt: string }[];
}

interface DailyPoint {
  date: string;
  count: number;
}

export default function AdminDownloads() {
  const [stats, setStats] = useState<DownloadStats | null>(null);
  const [daily, setDaily] = useState<DailyPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats/downloads").then((r) => r.json()),
      fetch("/api/stats/downloads/daily").then((r) => r.json()),
    ])
      .then(([s, d]) => {
        setStats(s);
        setDaily(Array.isArray(d) ? d : []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
          <p className="text-sm text-gray-500">Loading download analytics...</p>
        </div>
      </div>
    );
  }

  const maxDaily = Math.max(...daily.map((d) => d.count), 1);
  const totalDays = daily.filter((d) => d.count > 0).length;
  const avgPerDay = totalDays > 0 ? (stats?.total ?? 0) / totalDays : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#111] border border-white/[0.06] rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Download className="h-3.5 w-3.5 text-btl-red" />
            Total Downloads
          </div>
          <div className="text-2xl font-bold text-white">{stats?.total ?? 0}</div>
        </div>
        <div className="bg-[#111] border border-white/[0.06] rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            Today
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats?.today ?? 0}</div>
        </div>
        <div className="bg-[#111] border border-white/[0.06] rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Calendar className="h-3.5 w-3.5 text-blue-400" />
            Yesterday
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats?.yesterday ?? 0}</div>
        </div>
        <div className="bg-[#111] border border-white/[0.06] rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Globe className="h-3.5 w-3.5 text-purple-400" />
            Countries
          </div>
          <div className="text-2xl font-bold text-white">{stats?.byCountry.length ?? 0}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-btl-red" />
              Last 30 Days
            </h2>
            <span className="text-xs text-gray-500">Avg {avgPerDay.toFixed(1)}/day</span>
          </div>
          <div className="p-5">
            <div className="flex items-end gap-1 h-40">
              {daily.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-white/[0.08] text-[10px] text-white px-2 py-1 rounded whitespace-nowrap">
                    {d.date.slice(5)}: {d.count}
                  </div>
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-btl-red/60 to-btl-red hover:from-btl-red hover:to-red-400 transition-all cursor-pointer"
                    style={{ height: `${(d.count / maxDaily) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-gray-500">
              <span>{daily[0]?.date.slice(5) || ""}</span>
              <span>{daily[daily.length - 1]?.date.slice(5) || ""}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-btl-red" />
              Platforms
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {stats && stats.byPlatform.length > 0 ? (
              stats.byPlatform.map((p) => {
                const pct = ((p._count / stats.total) * 100).toFixed(1);
                return (
                  <div key={p.platform}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {p.platform === "android" ? (
                          <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Monitor className="h-3.5 w-3.5 text-blue-400" />
                        )}
                        <span className="text-xs text-white capitalize">{p.platform}</span>
                      </div>
                      <span className="text-xs text-gray-400 tabular-nums">{p._count} ({pct}%)</span>
                    </div>
                    <div className="bg-white/[0.06] rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-btl-red to-red-400" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-btl-red" />
              Downloads by Country
            </h2>
          </div>
          <div className="p-5 space-y-2">
            {stats && stats.byCountry.length > 0 ? (
              stats.byCountry.map((c) => {
                const maxCount = Math.max(...stats.byCountry.map((x) => x._count));
                return (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-28 md:w-36 truncate">{c.country || "Unknown"}</span>
                    <div className="flex-1 bg-white/[0.06] rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-btl-red to-red-400 transition-all duration-500"
                        style={{ width: `${(c._count / maxCount) * 100}%` }} />
                    </div>
                    <span className="text-xs text-white font-semibold w-8 text-right tabular-nums">{c._count}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
            )}
          </div>
        </div>

        <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Download className="h-4 w-4 text-btl-red" />
              Recent Downloads
            </h2>
          </div>
          <div className="divide-y divide-white/[0.04] max-h-[400px] overflow-y-auto">
            {stats && stats.recent.length > 0 ? (
              stats.recent.map((d) => (
                <div key={d.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white font-medium">
                      {d.country || "Unknown"}{d.city ? `, ${d.city}` : ""}
                    </span>
                    <span className="text-[10px] text-gray-500 tabular-nums">
                      {new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-3 w-3 text-gray-500" />
                    <span className="text-[10px] text-gray-500 capitalize">{d.platform}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No recent downloads</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
