const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE = "https://youtube.googleapis.com/youtube/v3";

export interface YouTubeEpisode {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  position: number;
}

export async function fetchPlaylistEpisodes(playlistId: string): Promise<YouTubeEpisode[]> {
  const episodes: YouTubeEpisode[] = [];
  let nextPageToken = "";

  try {
    do {
      const url = `${BASE}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (!res.ok) break;
      const data = await res.json();
      const items = data.items || [];
      for (const item of items) {
        const s = item.snippet;
        if (!s || !s.resourceId?.videoId || !s.title || s.title === "Deleted video" || s.title === "Private video") continue;
        episodes.push({
          videoId: s.resourceId.videoId,
          title: s.title,
          thumbnail: s.thumbnails?.maxres?.url || s.thumbnails?.high?.url || s.thumbnails?.medium?.url || s.thumbnails?.default?.url || "",
          channel: s.videoOwnerChannelTitle || s.channelTitle || "BTL TV",
          position: s.position ?? episodes.length,
        });
      }
      nextPageToken = data.nextPageToken || "";
    } while (nextPageToken);
  } catch { return []; }

  return episodes;
}
