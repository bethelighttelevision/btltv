"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PAGE_KEY = "home";

export default function HomePageEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    pageTitle: "", heroBanner: "", heroVideoUrl: "", tagline: "",
    introText: "", featuredShowIds: "", ctaText: "", ctaLink: "",
    metaTitle: "", metaDescription: "", ogImage: "",
  });

  useEffect(() => {
    fetch(`/api/admin/pages?pageKey=${PAGE_KEY}`)
      .then((r) => r.json())
      .then((data) => { if (data && typeof data === "object") setForm((f) => ({ ...f, ...data })); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/pages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pageKey: PAGE_KEY, fields: form }) });
    if (res.ok) toast.success("Home page saved"); else toast.error("Failed to save");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;

  return (<div><h1 className="text-xl font-bold text-white mb-6">Home Page Editor</h1>
    <div className="max-w-lg space-y-4">
      <Field label="Page Title" value={form.pageTitle} onChange={(v) => setForm({ ...form, pageTitle: v })} />
      <Field label="Hero Video URL" value={form.heroVideoUrl} onChange={(v) => setForm({ ...form, heroVideoUrl: v })} />
      <Field label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
      <TextareaField label="Intro Text" value={form.introText} onChange={(v) => setForm({ ...form, introText: v })} />
      <Field label="Featured Show IDs (comma-separated slugs)" value={form.featuredShowIds} onChange={(v) => setForm({ ...form, featuredShowIds: v })} />
      <Field label="CTA Button Text" value={form.ctaText} onChange={(v) => setForm({ ...form, ctaText: v })} />
      <Field label="CTA Button Link" value={form.ctaLink} onChange={(v) => setForm({ ...form, ctaLink: v })} />
      <div className="pt-4 border-t border-white/[0.04]"><h3 className="text-xs text-gray-400 font-semibold mb-3">SEO</h3></div>
      <Field label="Meta Title" value={form.metaTitle} onChange={(v) => setForm({ ...form, metaTitle: v })} />
      <TextareaField label="Meta Description" value={form.metaDescription} onChange={(v) => setForm({ ...form, metaDescription: v })} />
      <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg disabled:opacity-60"><Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Page"}</button>
    </div></div>);
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (<div><label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 mt-1 focus:outline-none focus:border-btl-red/50" /></div>);
}
function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (<div><label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-btl-red/50" /></div>);
}

