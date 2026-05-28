import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load API key ──
const ENV_PATH = join(__dirname, "..", ".env");
let YOUTUBE_API_KEY = "";
try {
  const env = readFileSync(ENV_PATH, "utf-8");
  const match = env.match(/^YOUTUBE_API_KEY=(.+)$/m);
  if (match) YOUTUBE_API_KEY = match[1].trim();
} catch {}

if (!YOUTUBE_API_KEY) {
  console.error("Missing YOUTUBE_API_KEY in .env");
  process.exit(1);
}

// ── All playlist IDs ──
const PLAYLIST_IDS = [
  "PLC0Rch0KTiEL1XcXiXO76FeMysmOQda-v",
  "PLC0Rch0KTiEL-7g_5Zt4nmcj1tKUMVlDJ",
  "PLC0Rch0KTiEJty_pIPyX862w551dRhSPC",
  "PLC0Rch0KTiEL3jSy9_haZ0IwwVnEOM502",
  "PLC0Rch0KTiEJJU9cHbZ_aZHkQuQKtG353",
  "PLC0Rch0KTiEK78XGqgSzTgYovHc6M6l3M",
  "PLC0Rch0KTiEJHTsKT-ccjvRsQ7wq0zhNA",
  "PLC0Rch0KTiEK2HGhHh6ju0UAbR4GPpv_h",
  "PLC0Rch0KTiEJ5atmrt0aNyTJTbBRk8Dtd",
  "PLC0Rch0KTiEK59AdKYUxvjD4FYGGAk-3W",
  "PLC0Rch0KTiEJjSOc-b5azFbgnCgy27PFx",
  "PLC0Rch0KTiEJIkPavJjvPDX1eslj5q2Mt",
  "PLC0Rch0KTiEIR35NdZTLISgKRMlc3BVw3",
  "PLC0Rch0KTiEKa9nRM45q3IjtjnEcxx8Oq",
  "PLC0Rch0KTiEI_mnwHqbtFVWkoBepRVJYz",
  "PLC0Rch0KTiEIM81Nxga6kBzrWTI4zKW6B",
  "PLC0Rch0KTiEJmdYO0rgoAyxHvufDMRqey",
  "PLC0Rch0KTiEJf5LpXqJUB7BOPTIxxYE4Y",
  "PLC0Rch0KTiEJTLA68BSOZiawjHha_STu6",
  "PLC0Rch0KTiEKieg3BaUFw9Awo951JERSq",
  "PLC0Rch0KTiELEXZy_VRdLOII3zDpXYh-m",
  "PLC0Rch0KTiEJD0sPwhLDZKTexs0RhHtTk",
  "PLC0Rch0KTiEKswX3Uhy-Rbc_v8oZGWoaN",
  "PLC0Rch0KTiEJzzhjty0HYs02WBzM4Y7G1",
  "PLC0Rch0KTiEJzd_BEgTrtW25He9bc5ykP",
  "PLC0Rch0KTiEJviSmXh9ffFJ57rLQcS84A",
  "PLC0Rch0KTiEKhqfRdSq7N9syvs31FNUQU",
  "PLC0Rch0KTiEIub8WrDOvvwOfy2VMA8wV2",
  "PLC0Rch0KTiEIez3wRZiuJ3uIAVeqO8UAk",
  "PLC0Rch0KTiEJappsAzGuHckX-6Tnv3e0C",
  "PLC0Rch0KTiEIXhIrONRD0BUJOfT02hwOZ",
  "PLC0Rch0KTiEJJUdDkkF1ErTjG92L6u4bq",
  "PLC0Rch0KTiELmNtPpNsAFdD5R0DuHsc57",
  "PLC0Rch0KTiEKFnSQS_7_yzCXlBVE14c9K",
  "PLC0Rch0KTiELF-r1NYnvutDhWwFA_PuWb",
  "PLC0Rch0KTiEL62fRR7QFYnybfId__kUGp",
  "PLC0Rch0KTiEJ5r54n700_prgbhdZExCJG",
  "PLC0Rch0KTiEJU6V0fg9XydpOjM8Yp0eAY",
  "PLC0Rch0KTiEIXuKgpvm7mq4YlLQ__HssQ",
  "PLC0Rch0KTiEINBNsxKVWV5gXlu8EmlWV0",
  "PLC0Rch0KTiEJ4Ys17Q2GyDerDxuUkhe2z",
  "PLC0Rch0KTiELwlkkreDtcIdxhPmASJbpJ",
];

const API = "https://youtube.googleapis.com/youtube/v3/playlistItems";

async function fetchAllEpisodes(playlistId) {
  const episodes = [];
  let pageToken = "";
  let page = 0;

  do {
    const params = new URLSearchParams({
      part: "snippet",
      maxResults: "50",
      playlistId,
      key: YOUTUBE_API_KEY,
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`${API}?${params}`);
    if (!res.ok) {
      const text = await res.text();
      console.error(`  ✗ ${playlistId.slice(0, 20)}... — HTTP ${res.status}: ${text.slice(0, 80)}`);
      return null;
    }
    const data = await res.json();

    for (const item of data.items || []) {
      const s = item.snippet;
      if (!s) continue;
      // Skip deleted/private videos
      if (s.title === "Deleted video" || s.title === "Private video") continue;
      episodes.push({
        videoId: s.resourceId?.videoId ?? "",
        title: (s.title ?? "").trim(),
        thumbnail: s.thumbnails?.medium?.url ?? s.thumbnails?.default?.url ?? "",
        duration: "",
        channel: s.videoOwnerChannelTitle ?? "BTL TV",
        position: s.position != null ? s.position + 1 : episodes.length + 1,
      });
    }

    pageToken = data.nextPageToken || "";
    page++;
  } while (pageToken);

  return episodes;
}

async function main() {
  console.log(`Fetching ${PLAYLIST_IDS.length} playlists from YouTube Data API v3...\n`);

  const episodes = {};
  let success = 0;
  let fail = 0;

  const CONCURRENCY = 3;
  for (let i = 0; i < PLAYLIST_IDS.length; i += CONCURRENCY) {
    const batch = PLAYLIST_IDS.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (id) => {
        const name = id.length > 20 ? id.slice(0, 20) + "..." : id;
        process.stdout.write(`  [${i / CONCURRENCY + 1}/${Math.ceil(PLAYLIST_IDS.length / CONCURRENCY)}] ${name} `);
        const data = await fetchAllEpisodes(id);
        if (data === null) {
          process.stdout.write("FAILED\n");
          return { id, ok: false };
        }
        process.stdout.write(`${data.length} episodes\n`);
        return { id, ok: true, data };
      })
    );
    for (const r of results) {
      if (r.ok) {
        episodes[r.id] = r.data;
        success++;
      } else {
        episodes[r.id] = [];
        fail++;
      }
    }
  }

  const output = {
    generatedAt: new Date().toISOString(),
    totalPlaylists: PLAYLIST_IDS.length,
    success,
    fail,
    episodes,
  };

  const outPath = join(__dirname, "..", "src", "lib", "episodes-data.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

  const totalEps = Object.values(episodes).reduce((s, e) => s + e.length, 0);
  console.log(`\n✓ Done — ${success} playlists OK, ${fail} failed, ${totalEps} total episodes`);
  console.log(`  Saved to src/lib/episodes-data.json`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
