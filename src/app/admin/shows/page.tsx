"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Show { id: string; title: string; slug: string; category: string; thumbnail: string | null; isActive: boolean; isFeatured: boolean; order: number; _count: { videos: number }; }

const CATEGORIES = ["Talk Show", "Devotional", "Documentary", "Drama", "Social Issues", "Health", "Education", "Bible School", "Kids"];

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");

  const fetchShows = () => {
    setLoading(true);
    fetch("/api/admin/shows")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { if (Array.isArray(data)) setShows(data); })
      .catch(() => toast.error("Failed to load shows"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchShows(); }, []);

  const deleteShow = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This will also delete all its videos.`)) return;
    const res = await fetch(`/api/admin/shows/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Show deleted"); fetchShows(); } else toast.error("Failed to delete");
  };

  const filtered = shows.filter((s) => {
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat && s.category !== filterCat) return false;
    return true;
  });

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-btl-red border-t-transparent" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Shows & Programs</h1>
        <Link href="/admin/shows/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add New Show
        </Link>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search shows..."
            className="w-full bg-black/50 border border-white/[0.08] text-white text-xs rounded-lg pl-9 pr-3 h-9 focus:outline-none focus:border-btl-red/50" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="bg-black/50 border border-white/[0.08] text-white text-xs rounded-lg px-3 h-9 focus:outline-none focus:border-btl-red/50">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-gray-500">
              <th className="text-left p-3 font-medium w-12">Img</th>
              <th className="text-left p-3 font-medium">Title</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Category</th>
              <th className="text-center p-3 font-medium hidden md:table-cell w-20">Videos</th>
              <th className="text-center p-3 font-medium w-20">Status</th>
              <th className="text-right p-3 font-medium w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <td className="p-2">
                  <div className="h-10 w-14 rounded bg-black/40 overflow-hidden">
                    {s.thumbnail ? <img src={s.thumbnail} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-600">-</div>}
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-white font-medium">{s.title}</div>
                  <div className="text-[10px] text-gray-500">{s.slug}</div>
                </td>
                <td className="p-3 hidden md:table-cell"><span className="bg-white/[0.04] px-2 py-0.5 rounded text-[10px]">{s.category}</span></td>
                <td className="p-3 text-center hidden md:table-cell text-gray-400">{s._count.videos}</td>
                <td className="p-3 text-center">
                  {s.isActive ? <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                    : <span className="text-gray-500 text-[10px] bg-white/5 px-2 py-0.5 rounded-full">Draft</span>}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/shows/${s.id}/edit`} className="p-1.5 text-gray-400 hover:text-btl-red hover:bg-btl-red/10 rounded-lg"><Edit3 className="h-3.5 w-3.5" /></Link>
                    <button onClick={() => deleteShow(s.id, s.title)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-gray-500">No shows found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
