"use client";

import { useState, useEffect } from "react";
import { Bell, Radio, Video, Send, Loader2, Users, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminNotifications() {
  const [type, setType] = useState<"live" | "episodes" | "general">("live");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [deviceCount, setDeviceCount] = useState<number | null>(null);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);

  useEffect(() => {
    fetch("/api/notifications/send")
      .then((r) => r.json())
      .then((d) => setDeviceCount(d.count))
      .catch(() => setDeviceCount(0));
  }, []);

  const preset = (t: "live" | "episodes") => {
    setType(t);
    if (t === "live") {
      setTitle("🔴 Live TV Starting Now!");
      setBody("BTL TV is live! Tune in to watch the broadcast.");
    } else {
      setTitle("📺 New Episode Available");
      setBody("A new episode has been added. Watch it now on BTL TV!");
    }
  };

  const send = async () => {
    if (!title.trim() || !body.trim()) return toast.error("Title and body required");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, type }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Failed to send");
      setResult(data);
      toast.success(`Sent! ${data.sent} delivered, ${data.failed} failed`);
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-btl-red" />
            Push Notifications
          </h2>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
            <Users className="h-3.5 w-3.5" />
            Registered devices: <span className="text-white font-semibold">{deviceCount ?? "..."}</span>
          </div>

          <div className="flex gap-2 mb-5">
            <button onClick={() => preset("live")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${type === "live" ? "bg-btl-red text-white" : "bg-white/[0.06] text-gray-400 hover:bg-white/[0.1]"}`}>
              <Radio className="h-3.5 w-3.5" /> Live TV
            </button>
            <button onClick={() => preset("episodes")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${type === "episodes" ? "bg-btl-red text-white" : "bg-white/[0.06] text-gray-400 hover:bg-white/[0.1]"}`}>
              <Video className="h-3.5 w-3.5" /> New Episodes
            </button>
            <button onClick={() => { setType("general"); setTitle(""); setBody(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${type === "general" ? "bg-btl-red text-white" : "bg-white/[0.06] text-gray-400 hover:bg-white/[0.1]"}`}>
              Custom
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-btl-red/40 transition-colors"
                placeholder="Notification title" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Message</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-btl-red/40 transition-colors resize-none"
                placeholder="Notification message" />
            </div>
            <button onClick={send} disabled={loading || !deviceCount}
              className="flex items-center gap-2 px-5 py-2.5 bg-btl-red hover:bg-btl-red/80 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? "Sending..." : `Send to ${deviceCount || 0} device(s)`}
            </button>
          </div>

          {result && (
            <div className="mt-4 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" /> {result.sent} sent
              </span>
              {result.failed > 0 && (
                <span className="flex items-center gap-1.5 text-red-400">
                  <XCircle className="h-3.5 w-3.5" /> {result.failed} failed
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
