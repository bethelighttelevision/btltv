"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Member { id: string; name: string; designation: string | null; photo: string | null; displayOrder: number; }

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = () => {
    setLoading(true);
    fetch("/api/admin/team")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { if (Array.isArray(data)) setMembers(data); })
      .catch(() => toast.error("Failed to load team"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMembers(); }, []);

  const deleteMember = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); fetchMembers(); } else toast.error("Failed to delete");
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-btl-red border-t-transparent" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Team Members</h1>
        <Link href="/admin/team/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add Member
        </Link>
      </div>
      <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-gray-500">
              <th className="text-left p-3 font-medium w-12">Photo</th>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Designation</th>
              <th className="text-center p-3 font-medium w-20">Order</th>
              <th className="text-right p-3 font-medium w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-white/[0.02]">
                <td className="p-2">
                  <div className="h-9 w-9 rounded-full bg-black/40 overflow-hidden">
                    {m.photo ? <img src={m.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px]">-</div>}
                  </div>
                </td>
                <td className="p-3 text-white font-medium">{m.name}</td>
                <td className="p-3 hidden md:table-cell text-gray-400">{m.designation || "-"}</td>
                <td className="p-3 text-center text-gray-400">{m.displayOrder}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/team/${m.id}/edit`} className="p-1.5 text-gray-400 hover:text-btl-red hover:bg-btl-red/10 rounded-lg"><Edit3 className="h-3.5 w-3.5" /></Link>
                    <button onClick={() => deleteMember(m.id, m.name)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-gray-500">No team members.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
