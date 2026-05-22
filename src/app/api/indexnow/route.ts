import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const SITE_URL = "https://btl-tv.com";

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "Provide an array of URLs" }, { status: 400 });
    }

    const validUrls = urls.filter((u: string) => u.startsWith(SITE_URL));
    if (validUrls.length === 0) {
      return NextResponse.json({ error: "No valid BTL TV URLs provided" }, { status: 400 });
    }

    const results = await Promise.allSettled(
      ["bing.com", "indexnow.yandex.com", "search.naver.com", "www.seznam.cz"].map((host) =>
        fetch(`https://${host}/indexnow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            host: "btl-tv.com",
            key: INDEXNOW_KEY,
            urlList: validUrls,
          }),
        }).then((r) => ({ host, status: r.status, ok: r.ok }))
      )
    );

    const submissions = results.map((r) =>
      r.status === "fulfilled" ? r.value : { host: "unknown", error: r.reason?.message }
    );

    return NextResponse.json({ submitted: validUrls.length, results: submissions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
