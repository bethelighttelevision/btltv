"use client";

import { useEffect, useState } from "react";
import { Loader2, Download, Globe, Smartphone, Calendar, ArrowUp, ArrowDown } from "lucide-react";

interface Stats {
  total: number; today: number; yesterday: number;
  byCountry: { country: string; _count: number }[];
  byPlatform: { platform: string; _count: number }[];
  recent: { id: string; country: string; city: string; platform: string; createdAt: string }[];
}

interface DailyData { date: string; count: number }

export default function DownloadsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [daily, setDaily] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats/downloads").then(r => r.json()),
      fetch("/api/stats/downloads/daily").then(r => r.json()),
    ]).then(([s, d]) => { setStats(s); setDaily(d); }).catch(() => null).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;
  if (!stats) return <div className="text-center py-20 text-gray-500 text-sm">Failed to load download stats</div>;

  const maxDaily = Math.max(...daily.map(d => d.count), 1);
  const trend = stats.today - stats.yesterday;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Download Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
          <Download className="h-4 w-4 text-blue-400 mb-1" />
          <div className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500">Total Downloads</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
          <Calendar className="h-4 w-4 text-emerald-400 mb-1" />
          <div className="text-2xl font-bold text-white">{stats.today}</div>
          <div className="text-[10px] text-gray-500">Today</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
          <Calendar className="h-4 w-4 text-amber-400 mb-1" />
          <div className="text-2xl font-bold text-white">{stats.yesterday}</div>
          <div className="text-[10px] text-gray-500">Yesterday</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
          {trend >= 0 ? <ArrowUp className="h-4 w-4 text-emerald-400 mb-1" /> : <ArrowDown className="h-4 w-4 text-red-400 mb-1" />}
          <div className={`text-2xl font-bold ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>{trend >= 0 ? "+" : ""}{trend}</div>
          <div className="text-[10px] text-gray-500">vs Yesterday</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Globe className="h-4 w-4 text-gray-400" /> By Country</h2>
          {stats.byCountry.length === 0 ? (
            <p className="text-xs text-gray-500">No data yet</p>
          ) : (
            <div className="space-y-2">
              {stats.byCountry.map((c) => (
                <div key={c.country} className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">{c.country || "Unknown"}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-white/[0.04] rounded-full h-1.5">
                      <div className="bg-btl-red h-1.5 rounded-full" style={{ width: `${(c._count / stats.total) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{c._count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Smartphone className="h-4 w-4 text-gray-400" /> By Platform</h2>
          {stats.byPlatform.length === 0 ? (
            <p className="text-xs text-gray-500">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.byPlatform.map((p) => (
                <div key={p.platform} className="flex items-center justify-between">
                  <span className="text-xs text-gray-300 capitalize">{p.platform}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-white/[0.04] rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(p._count / stats.total) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{p._count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Last 30 Days</h2>
        {daily.length === 0 ? (
          <p className="text-xs text-gray-500">No data yet</p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {daily.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-btl-red/20 rounded-t relative group" style={{ height: `${(d.count / maxDaily) * 100}%` }}>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{d.count}</div>
                </div>
                {daily.length <= 15 && <span className="text-[8px] text-gray-600">{d.date.slice(5)}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Recent Downloads</h2>
        {stats.recent.length === 0 ? (
          <p className="text-xs text-gray-500">No downloads yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="text-gray-500 border-b border-white/[0.04]">
                <th className="text-left py-2 font-medium">Date</th>
                <th className="text-left py-2 font-medium">Country</th>
                <th className="text-left py-2 font-medium">City</th>
                <th className="text-left py-2 font-medium">Platform</th>
              </tr></thead>
              <tbody>
                {stats.recent.map((d) => (
                  <tr key={d.id} className="border-b border-white/[0.02] text-gray-300">
                    <td className="py-2">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="py-2">{d.country || "-"}</td>
                    <td className="py-2">{d.city || "-"}</td>
                    <td className="py-2 capitalize">{d.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
