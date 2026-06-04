"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/team")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const member = data.find((m: any) => m.id === params.id);
          if (member) setForm(member);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const save = async () => {
    if (!form?.name) { toast.error("Name is required"); return; }
    setSaving(true);
    const res = await fetch(`/api/admin/team/${params.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { toast.success("Updated"); router.push("/admin/team"); } else toast.error("Failed to update");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;
  if (!form) return <div className="text-center py-20 text-gray-500 text-sm">Member not found</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/team" className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.04]"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="text-xl font-bold text-white">Edit Team Member</h1>
      </div>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Full Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Designation</label>
          <input value={form.designation || ""} onChange={(e) => setForm({ ...form, designation: e.target.value })}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Bio</label>
          <textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Display Order</label>
          <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
            className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60">
            <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Update Member"}
          </button>
          <Link href="/admin/team" className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 text-xs font-semibold rounded-lg transition-colors">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
