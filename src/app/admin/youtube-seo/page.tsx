"use client";

import { useEffect, useState, useCallback } from "react";
import { Fragment } from "react";
import {
  Search, Check, Loader2, ExternalLink, ChevronLeft, ChevronRight,
  Globe, Users, Video, Eye, TrendingUp, RefreshCw,
  Sparkles, Upload, AlertCircle, LogOut,
} from "lucide-react";
import { toast } from "sonner";

interface YouTubeVideo {
  videoId: string; title: string; description: string; publishedAt: string;
  views: string; likes: string; comments: string; duration: string;
  seoStatus: string; seoTitle?: string | null; seoDescription?: string | null; seoTags?: string | null; seoErrorMessage?: string | null;
  thumbnails?: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
}

interface ChannelInfo {
  id: string; title: string; customUrl: string;
  statistics: { viewCount: string; subscriberCount: string; videoCount: string };
  keywords: string;
}

export default function YouTubeSEOPage() {
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevToken, setPrevToken] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [applying, setApplying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [applyErrors, setApplyErrors] = useState<{ videoId: string; error: string; status: number; sentTitle?: string; requestBody?: string }[]>([]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/youtube/auth?action=status");
      const data = await res.json();
      setConnected(data.connected);
    } catch {}
  }, []);

  const fetchChannel = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/youtube/channel");
      if (res.ok) { const data = await res.json(); setChannel(data); }
    } catch {}
  }, []);

  const fetchVideos = useCallback(async (token?: string) => {
    try {
      setLoading(true);
      let url = `/api/admin/youtube/videos?order=${sortBy}`;
      if (token) url += `&pageToken=${token}`;
      if (searchQuery) url += `&query=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos || []);
        setNextToken(data.nextPageToken);
        setPrevToken(data.prevPageToken);
        setPageToken(token || null);
      } else if (res.status === 401) {
        setConnected(false);
        toast.error("YouTube connection expired. Reconnect.");
      }
    } catch { toast.error("Failed to fetch videos"); }
    finally { setLoading(false); }
  }, [sortBy, searchQuery]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);
  useEffect(() => { if (connected) { fetchChannel(); fetchVideos(); } }, [connected, fetchChannel, fetchVideos]);

  const connectYouTube = async () => {
    const res = await fetch("/api/admin/youtube/auth?action=connect");
    const data = await res.json();
    if (data.authUrl) {
      const w = window.open(data.authUrl, "_blank", "width=600,height=700");
      const timer = setInterval(() => {
        if (w?.closed) { clearInterval(timer); fetchStatus(); fetchChannel(); fetchVideos(); }
      }, 1000);
    } else toast.error(data.error || "Failed to connect");
  };

  const disconnectYouTube = async () => {
    await fetch("/api/admin/youtube/auth?action=disconnect");
    setConnected(false); setChannel(null); setVideos([]);
    toast.success("Disconnected");
  };

  const toggleSelect = (videoId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) next.delete(videoId); else next.add(videoId);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === videos.length) setSelected(new Set());
    else setSelected(new Set(videos.map((v) => v.videoId)));
  };

  const generateSEO = async () => {
    if (selected.size === 0) { toast.error("Select videos first"); return; }
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/youtube/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoIds: Array.from(selected) }),
      });
      if (res.ok) { toast.success("SEO generated!"); fetchVideos(pageToken || undefined); }
      else { const err = await res.json(); toast.error(err.error || "Failed"); }
    } catch { toast.error("Failed to generate SEO"); }
    finally { setGenerating(false); }
  };

  const applySEO = async () => {
    if (selected.size === 0) { toast.error("Select videos first"); return; }
    setApplying(true);
    setApplyErrors([]);
    try {
      const res = await fetch("/api/admin/youtube/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (data.errors?.length > 0) {
        setApplyErrors(data.errors);
        const first = data.errors[0];
        toast.error(`YouTube says: ${first.error?.substring(0, 120)}`);
      }
      if (data.success > 0) {
        toast.success(`${data.success} videos updated`);
        fetchVideos(pageToken || undefined);
      }
    } catch { toast.error("Failed to apply"); }
    finally { setApplying(false); }
  };

  const formatNumber = (n: string) => {
    const num = parseInt(n);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      generated: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      applied: "bg-green-500/10 text-green-400 border-green-500/20",
      error: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return (
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">YouTube SEO Manager</h1>
        {connected ? (
          <button onClick={disconnectYouTube}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors">
            <LogOut className="h-3.5 w-3.5" /> Disconnect
          </button>
        ) : (
          <button onClick={connectYouTube}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-btl-red hover:bg-btl-red/80 text-white text-xs rounded-lg transition-colors">
            <Globe className="h-3.5 w-3.5" /> Connect YouTube
          </button>
        )}
      </div>

      {!connected && (
        <div className="bg-btl-card/80 border border-white/[0.04] rounded-xl p-10 text-center">
          <Globe className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Connect Your YouTube Channel</h2>
          <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
            Click &quot;Connect YouTube&quot; and authorize with your Google account that owns the BTL TV channel.
            You&apos;ll be able to generate and apply SEO to all your videos.
          </p>
        </div>
      )}

      {connected && channel && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Users, label: "Subscribers", value: formatNumber(channel.statistics.subscriberCount) },
            { icon: Eye, label: "Total Views", value: formatNumber(channel.statistics.viewCount) },
            { icon: Video, label: "Total Videos", value: formatNumber(channel.statistics.videoCount) },
            { icon: TrendingUp, label: "Channel", value: channel.customUrl || "BTL TV" },
          ].map((stat) => (
            <div key={stat.label} className="bg-btl-card/80 border border-white/[0.04] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-4 w-4 text-btl-red" />
                <span className="text-[10px] text-gray-500 uppercase font-semibold">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {connected && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full bg-black/50 border border-white/[0.08] text-white text-xs rounded-lg pl-9 pr-3 h-9 focus:outline-none focus:border-btl-red/50" />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/50 border border-white/[0.08] text-white text-xs rounded-lg px-3 h-9 focus:outline-none focus:border-btl-red/50">
              <option value="date">Newest First</option>
              <option value="viewCount">Most Viewed</option>
              <option value="rating">Best Rated</option>
            </select>
            <button onClick={() => fetchVideos()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 text-xs rounded-lg">
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={selectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 text-xs rounded-lg transition-colors">
              <Check className="h-3 w-3" /> {selected.size === videos.length ? "Deselect All" : `Select All (${videos.length})`}
            </button>
            <span className="text-[10px] text-gray-600">{selected.size} selected</span>
            <div className="flex-1" />
            <button onClick={generateSEO} disabled={selected.size === 0 || generating}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs rounded-lg transition-colors disabled:opacity-50">
              {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              {generating ? "Generating..." : "Generate SEO"}
            </button>
            <button onClick={applySEO} disabled={selected.size === 0 || applying}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs rounded-lg transition-colors disabled:opacity-50">
              {applying ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              {applying ? "Applying..." : "Apply to YouTube"}
            </button>
          </div>

          {applyErrors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-red-400 mb-1">YouTube API Errors ({applyErrors.length})</h3>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {applyErrors.map((e) => (
                      <details key={e.videoId} className="text-[10px]">
                        <summary className="text-red-300/80 cursor-pointer hover:text-red-300">{e.videoId} &mdash; HTTP {e.status}</summary>
                        {e.sentTitle && <p className="text-red-300/80 mb-1">Title sent: <span className="text-red-200/60">{e.sentTitle}</span></p>}
                        <pre className="mt-1 text-red-300/60 whitespace-pre-wrap bg-black/30 p-2 rounded">{e.error?.substring(0, 500)}</pre>
                        {e.requestBody && (
                          <details className="mt-1">
                            <summary className="text-[9px] text-red-400/50 cursor-pointer">Request body</summary>
                            <pre className="mt-1 text-[9px] text-red-400/40 whitespace-pre-wrap bg-black/30 p-2 rounded max-h-32 overflow-auto">{e.requestBody}</pre>
                          </details>
                        )}
                      </details>
                    ))}
                  </div>
                </div>
                <button onClick={() => setApplyErrors([])} className="text-red-400/60 hover:text-red-400 text-xs">&times;</button>
              </div>
            </div>
          )}
          <div className="bg-btl-card/80 border border-white/[0.04] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="text-left p-3 text-gray-500 font-semibold w-8">
                      <input type="checkbox" checked={selected.size === videos.length && videos.length > 0}
                        onChange={selectAll} className="accent-btl-red" />
                    </th>
                    <th className="text-left p-3 text-gray-500 font-semibold">Video</th>
                    <th className="text-left p-3 text-gray-500 font-semibold hidden md:table-cell">Views</th>
                    <th className="text-left p-3 text-gray-500 font-semibold hidden md:table-cell">Likes</th>
                    <th className="text-left p-3 text-gray-500 font-semibold hidden lg:table-cell">Published</th>
                    <th className="text-left p-3 text-gray-500 font-semibold">SEO</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="p-10 text-center text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    </td></tr>
                  ) : videos.length === 0 ? (
                    <tr><td colSpan={6} className="p-10 text-center text-gray-500">No videos found</td></tr>
                  ) : videos.map((video) => (
                    <Fragment key={video.videoId}>
                      <tr
                        className="border-b border-white/[0.02] hover:bg-white/[0.02] cursor-pointer transition-colors"
                        onClick={() => setExpandedVideo(expandedVideo === video.videoId ? null : video.videoId)}>
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={selected.has(video.videoId)}
                            onChange={() => toggleSelect(video.videoId)} className="accent-btl-red" />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            {video.thumbnails?.high?.url && (
                              <img src={video.thumbnails.high.url} alt=""
                                className="w-14 h-10 rounded object-cover shrink-0" />
                            )}
                            <div className="min-w-0">
                              <div className="text-white font-medium truncate max-w-[300px]">{video.title}</div>
                              <div className="text-[10px] text-gray-600 mt-0.5 truncate max-w-[300px]">
                                {video.description?.substring(0, 60)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-400 hidden md:table-cell">{formatNumber(video.views)}</td>
                        <td className="p-3 text-gray-400 hidden md:table-cell">{formatNumber(video.likes)}</td>
                        <td className="p-3 text-gray-400 hidden lg:table-cell">{new Date(video.publishedAt).toLocaleDateString()}</td>
                        <td className="p-3">{getStatusBadge(video.seoStatus)}</td>
                      </tr>
                      {expandedVideo === video.videoId && (
                        <tr key={`${video.videoId}-seo`} className="bg-black/30">
                          <td colSpan={6} className="p-4">
                            <div className="space-y-3 max-w-3xl">
                              <div>
                                <span className="text-[10px] text-gray-500 font-semibold uppercase">Current Title</span>
                                <p className="text-xs text-gray-400 mt-0.5">{video.title}</p>
                              </div>
                              {video.seoTitle && (
                                <div>
                                  <span className="text-[10px] text-green-500 font-semibold uppercase">SEO Title</span>
                                  <p className="text-xs text-green-400 mt-0.5 bg-green-500/5 p-2 rounded">{video.seoTitle}</p>
                                </div>
                              )}
                              {video.seoDescription && (
                                <div>
                                  <span className="text-[10px] text-green-500 font-semibold uppercase">SEO Description</span>
                                  <pre className="text-[10px] text-green-400/80 mt-0.5 bg-green-500/5 p-2 rounded whitespace-pre-wrap max-h-40 overflow-y-auto">{video.seoDescription}</pre>
                                </div>
                              )}
                              {video.seoTags && (
                                <div>
                                  <span className="text-[10px] text-green-500 font-semibold uppercase">SEO Tags</span>
                                  <p className="text-[10px] text-green-400/80 mt-0.5 bg-green-500/5 p-2 rounded">{video.seoTags}</p>
                                </div>
                              )}
                              {video.seoStatus === "pending" && (
                                <p className="text-[10px] text-yellow-400">Select this video and click &quot;Generate SEO&quot; to create optimized content.</p>
                              )}
                              {video.seoStatus === "error" && video.seoErrorMessage && (
                                <div>
                                  <span className="text-[10px] text-red-500 font-semibold uppercase">Error</span>
                                  <pre className="text-[10px] text-red-400/80 mt-0.5 bg-red-500/5 p-2 rounded whitespace-pre-wrap">{video.seoErrorMessage}</pre>
                                </div>
                              )}
                              <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:underline">
                                <ExternalLink className="h-3 w-3" /> Open on YouTube
                              </a>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-600">{videos.length} videos loaded</span>
            <div className="flex items-center gap-2">
              <button onClick={() => fetchVideos(prevToken || undefined)} disabled={!prevToken}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 text-xs rounded-lg disabled:opacity-30">
                <ChevronLeft className="h-3 w-3" /> Previous
              </button>
              <button onClick={() => fetchVideos(nextToken || undefined)} disabled={!nextToken}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 text-xs rounded-lg disabled:opacity-30">
                Next <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
