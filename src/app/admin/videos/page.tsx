"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface Video { id: string; title: string; youtubeId: string; thumbnail: string | null; publishedAt: string; isActive: boolean; show: { title: string }; }

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/videos")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { if (Array.isArray(data)) setVideos(data); })
      .catch(() => toast.error("Failed to load videos"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = videos.filter((v) => !search || v.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-btl-red border-t-transparent" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">All Videos</h1>
      </div>
      <div className="relative max-w-xs mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search videos..."
          className="w-full bg-black/50 border border-white/[0.08] text-white text-xs rounded-lg pl-9 pr-3 h-9 focus:outline-none focus:border-btl-red/50" />
      </div>
      <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-gray-500">
              <th className="text-left p-3 font-medium w-14">Thumb</th>
              <th className="text-left p-3 font-medium">Title</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Show</th>
              <th className="text-center p-3 font-medium w-24 hidden md:table-cell">Date</th>
              <th className="text-center p-3 font-medium w-20">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-white/[0.02]">
                <td className="p-2">
                  <div className="h-9 w-14 rounded bg-black/40 overflow-hidden">
                    {v.thumbnail ? <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-600">-</div>}
                  </div>
                </td>
                <td className="p-3 text-white font-medium">{v.title}</td>
                <td className="p-3 hidden md:table-cell text-gray-400">{v.show?.title || "-"}</td>
                <td className="p-3 text-center hidden md:table-cell text-gray-500">{new Date(v.publishedAt).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                  {v.isActive ? <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                    : <span className="text-gray-500 text-[10px] bg-white/5 px-2 py-0.5 rounded-full">Draft</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-gray-500">No videos found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
