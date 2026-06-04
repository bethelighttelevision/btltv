"use client";

import { useEffect, useState } from "react";
import { Settings, Save, Loader2, Globe, Smartphone, Mail, ToggleLeft, Facebook, Youtube, Instagram } from "lucide-react";
import { toast } from "sonner";

interface SettingsMap {
  [key: string]: string;
}

const settingFields = [
  { key: "siteName", label: "Site Name", icon: Globe, desc: "The name of your website" },
  { key: "siteDescription", label: "Site Description", icon: Globe, desc: "Short description for SEO", textarea: true },
  { key: "adminEmail", label: "Admin Email", icon: Mail, desc: "Notifications will be sent to this email" },
  { key: "apkUrl", label: "APK Download URL", icon: Smartphone, desc: "Direct link to the Android APK file" },
  { key: "appVersion", label: "App Version", icon: Smartphone, desc: "Current app version number" },
  { key: "socialFacebook", label: "Facebook URL", icon: Facebook, desc: "Facebook page link" },
  { key: "socialYouTube", label: "YouTube URL", icon: Youtube, desc: "YouTube channel link" },
  { key: "socialInstagram", label: "Instagram URL", icon: Instagram, desc: "Instagram profile link" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [local, setLocal] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { setSettings(data); setLocal({ ...data }); })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => setLocal((prev) => ({ ...prev, [key]: value }));
  const toggleBool = (key: string) => setLocal((prev) => ({ ...prev, [key]: prev[key] === "true" ? "false" : "true" }));

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local),
    });
    if (!res.ok) return toast.error("Failed to save settings");
    toast.success("Settings saved!");
    setSettings({ ...local });
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
          <p className="text-sm text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <ToggleLeft className="h-4 w-4 text-btl-red" />
            Toggle Options
          </h2>
        </div>
        <div className="p-5 space-y-4">
          {["maintenanceMode", "allowRegistration"].map((key) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                <p className="text-[11px] text-gray-500">
                  {key === "maintenanceMode" ? "Enable maintenance mode" : "Allow new user registrations"}
                </p>
              </div>
              <button onClick={() => toggleBool(key)}
                className={`relative h-6 w-11 rounded-full transition-colors ${local[key] === "true" ? "bg-btl-red" : "bg-white/[0.12]"}`}>
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${local[key] === "true" ? "translate-x-[22px]" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Settings className="h-4 w-4 text-btl-red" />
            Site Configuration
          </h2>
        </div>
        <div className="p-5 space-y-5">
          {settingFields.map((field) => (
            <div key={field.key}>
              <label className="flex items-center gap-2 text-xs text-gray-300 mb-1.5">
                <field.icon className="h-3.5 w-3.5 text-btl-red" />
                {field.label}
              </label>
              {field.textarea ? (
                <textarea value={local[field.key] || ""} onChange={(e) => handleChange(field.key, e.target.value)} rows={3}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-btl-red/40 transition-colors resize-none" />
              ) : (
                <input type="text" value={local[field.key] || ""} onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-btl-red/40 transition-colors" />
              )}
              <p className="text-[10px] text-gray-600 mt-1">{field.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-btl-red hover:bg-btl-red/80 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All Settings
        </button>
      </div>
    </div>
  );
}
