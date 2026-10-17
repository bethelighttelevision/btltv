"use client";

import { useEffect } from "react";
import "./home-demo.css";
import { HOME_DEMO_HTML } from "./home-demo-html";

const HLS_CDN = "https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js";

/**
 * BTL TV scroll-experience homepage (ported from the approved demo).
 * The real site Header/Footer render around this component; only the
 * demo's own topbar/footer were stripped. Demo JS runs unmodified
 * against window scrolling.
 */
export default function HomeDemo() {
  useEffect(() => {
    if ((window as unknown as { __btlDemoBooted?: boolean }).__btlDemoBooted) return;
    (window as unknown as { __btlDemoBooted?: boolean }).__btlDemoBooted = true;

    let demoScript: HTMLScriptElement | null = null;
    let hlsScript: HTMLScriptElement | null = null;

    const bootDemo = () => {
      if (document.querySelector('script[data-btl-demo="1"]')) return;
      demoScript = document.createElement("script");
      demoScript.src = "/demo/home-demo.js";
      demoScript.async = true;
      demoScript.setAttribute("data-btl-demo", "1");
      document.body.appendChild(demoScript);
    };

    if ((window as unknown as { Hls?: unknown }).Hls) {
      bootDemo();
    } else {
      hlsScript = document.createElement("script");
      hlsScript.src = HLS_CDN;
      hlsScript.async = true;
      hlsScript.onload = bootDemo;
      hlsScript.onerror = bootDemo; // demo guards a missing Hls
      document.body.appendChild(hlsScript);
    }

    return () => {
      demoScript?.remove();
      hlsScript?.remove();
      (window as unknown as { __btlDemoBooted?: boolean }).__btlDemoBooted = false;
    };
  }, []);

  return (
    <>
      <div className="btl-demo-scope" dangerouslySetInnerHTML={{ __html: HOME_DEMO_HTML }} />
    </>
  );
}
