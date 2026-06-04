"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PAGE_KEY = "stichting";

export default function StichtingPageEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ pageTitle: "", heroBanner: "", introText: "", legalText: "", content: "", metaTitle: "", metaDescription: "", ogImage: "" });

  useEffect(() => {
    fetch(`/api/admin/pages?pageKey=${PAGE_KEY}`).then((r) => r.json()).then((data) => { if (data && typeof data === "object") setForm((f) => ({ ...f, ...data })); }).catch(() => null).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/pages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pageKey: PAGE_KEY, fields: form }) });
    if (res.ok) toast.success("Stichting page saved"); else toast.error("Failed to save");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;

  return (<div><h1 className="text-xl font-bold text-white mb-6">Stichting Page Editor</h1>
    <div className="max-w-lg space-y-4">
      <F label="Page Title" v={form.pageTitle} onChange={(v) => setForm({ ...form, pageTitle: v })} />
      <TA label="Intro Text" v={form.introText} onChange={(v) => setForm({ ...form, introText: v })} />
      <TA label="Legal Text" v={form.legalText} onChange={(v) => setForm({ ...form, legalText: v })} />
      <TA label="Content" v={form.content} onChange={(v) => setForm({ ...form, content: v })} />
      <D />
      <F label="Meta Title" v={form.metaTitle} onChange={(v) => setForm({ ...form, metaTitle: v })} />
      <TA label="Meta Description" v={form.metaDescription} onChange={(v) => setForm({ ...form, metaDescription: v })} />
      <SB onClick={save} saving={saving} />
    </div></div>);
}

function F({ label, v, onChange }: { label: string; v: string; onChange: (v: string) => void }) {
  return (<div><label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{label}</label><input value={v} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" /></div>);
}
function TA({ label, v, onChange }: { label: string; v: string; onChange: (v: string) => void }) {
  return (<div><label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{label}</label><textarea value={v} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-btl-red/50" /></div>);
}

function D() { return <div className="pt-4 border-t border-white/[0.04]"><h3 className="text-xs text-gray-400 font-semibold mb-3">SEO</h3></div>; }
function SB({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return <button onClick={onClick} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg disabled:opacity-60"><Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Page"}</button>;
}
