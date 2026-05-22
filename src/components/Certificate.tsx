"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Certificate({ courseName }: { courseName: string }) {
  const { data: session } = useSession();
  const certRef = useRef<HTMLDivElement>(null);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const certId = `BTL-${Date.now().toString(36).toUpperCase()}`;

  const handlePrint = () => {
    const origin = window.location.origin;
    const name = session?.user?.name || "Student";
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
<!DOCTYPE html>
<html>
<head><title>Certificate of Completion — BTL TV</title>
<style>
  @page { margin: 0; size: landscape; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f0; font-family: 'Georgia', 'Times New Roman', serif; }
  .cert { width: 1000px; min-height: 700px; background: #fff; position: relative; overflow: hidden; }
  .bg-top { position: absolute; top: 0; left: 0; right: 0; height: 8px; background: linear-gradient(90deg, #e50914, #d4af37, #e50914); }
  .bg-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 8px; background: linear-gradient(90deg, #e50914, #d4af37, #e50914); }
  .border-deco { position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 1px solid #e0d5c0; pointer-events: none; }
  .border-deco2 { position: absolute; top: 26px; left: 26px; right: 26px; bottom: 26px; border: 2px solid #d4af37; pointer-events: none; }
  .corner { position: absolute; width: 40px; height: 40px; border-color: #d4af37; border-style: solid; }
  .corner-tl { top: 32px; left: 32px; border-width: 2px 0 0 2px; }
  .corner-tr { top: 32px; right: 32px; border-width: 2px 2px 0 0; }
  .corner-bl { bottom: 32px; left: 32px; border-width: 0 0 2px 2px; }
  .corner-br { bottom: 32px; right: 32px; border-width: 0 2px 2px 0; }
  .content { padding: 60px 80px; text-align: center; position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 700px; }
  .logo-img { width: 80px; height: 80px; object-fit: contain; margin-bottom: 16px; }
  .org-name { font-size: 16px; letter-spacing: 4px; color: #999; text-transform: uppercase; margin-bottom: 4px; font-family: 'Arial', sans-serif; }
  .org-tagline { font-size: 11px; letter-spacing: 3px; color: #bbb; text-transform: uppercase; margin-bottom: 30px; font-family: 'Arial', sans-serif; }
  .ribbon { width: 60px; height: 2px; background: linear-gradient(90deg, #e50914, #d4af37); margin-bottom: 30px; }
  .cert-title { font-size: 28px; letter-spacing: 3px; color: #1a1a2e; text-transform: uppercase; font-weight: 700; margin-bottom: 8px; font-family: 'Georgia', serif; }
  .cert-subtitle { font-size: 13px; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px; font-family: 'Arial', sans-serif; }
  .recipient-name { font-size: 48px; font-weight: 900; color: #1a1a2e; margin-bottom: 6px; font-family: 'Georgia', serif; letter-spacing: 1px; }
  .recipient-line { width: 200px; height: 2px; background: #eee; margin-bottom: 20px; }
  .desc { font-size: 14px; color: #666; line-height: 1.8; margin-bottom: 8px; font-family: 'Arial', sans-serif; }
  .course-name { font-size: 22px; color: #e50914; font-weight: 700; margin-bottom: 24px; font-family: 'Georgia', serif; }
  .details { display: flex; gap: 40px; justify-content: center; margin-bottom: 24px; }
  .detail-item { text-align: center; }
  .detail-label { font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; font-family: 'Arial', sans-serif; }
  .detail-value { font-size: 14px; color: #333; font-weight: 600; margin-top: 4px; font-family: 'Georgia', serif; }
  .seal { width: 70px; height: 70px; border-radius: 50%; border: 3px solid #e50914; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
  .seal-inner { font-family: 'Georgia', serif; font-weight: 900; font-size: 22px; color: #e50914; }
  .verify { font-size: 10px; color: #ccc; font-family: 'Arial', sans-serif; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head>
<body>
  <div class="cert">
    <div class="bg-top"></div>
    <div class="bg-bottom"></div>
    <div class="border-deco"></div>
    <div class="border-deco2"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    <div class="content">
      <img class="logo-img" src="${origin}/images/btl-logo.webp" alt="BTL TV" crossorigin="anonymous" />
      <div class="org-name"><strong style="color:#e50914">BTL</strong> TV</div>
      <div class="org-tagline">Be The Light Television</div>
      <div class="ribbon"></div>
      <div class="cert-title">Certificate of Completion</div>
      <div class="cert-subtitle">This certifies that</div>
      <div class="recipient-name">${name}</div>
      <div class="recipient-line"></div>
      <div class="desc">has successfully completed the course</div>
      <div class="course-name">${courseName}</div>
      <div class="details">
        <div class="detail-item"><div class="detail-label">Date</div><div class="detail-value">${date}</div></div>
        <div class="detail-item"><div class="detail-label">Certificate ID</div><div class="detail-value">${certId}</div></div>
      </div>
      <div class="seal"><div class="seal-inner">BTL</div></div>
      <div class="verify">BTL TV — btl-tv.com</div>
    </div>
  </div>
  <script>window.onload=function(){window.print();window.close()}</script>
</body></html>
    `);
    win.document.close();
  };

  const userName = session?.user?.name || "Student";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Screen preview — Coursera-style */}
      <div ref={certRef} className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Top/bottom accent bars */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-btl-red via-yellow-600 to-btl-red" />
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-btl-red via-yellow-600 to-btl-red" />

        {/* Decorative borders */}
        <div className="absolute inset-4 border border-amber-200/60 rounded-xl pointer-events-none" />
        <div className="absolute inset-6 border-2 border-btl-red/20 rounded-lg pointer-events-none" />

        {/* Corner ornaments */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-amber-500/40 pointer-events-none" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-amber-500/40 pointer-events-none" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-amber-500/40 pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-amber-500/40 pointer-events-none" />

        <div className="relative py-12 px-8 md:px-16 text-center flex flex-col items-center">
          {/* BTL Logo */}
          <img
            src="/images/btl-logo.webp"
            alt="BTL TV"
            className="w-20 h-20 object-contain mb-4"
          />

          {/* Organization name */}
          <div className="text-sm tracking-[4px] text-gray-400 uppercase mb-1 font-sans">
            <span className="font-bold text-btl-red text-base">BTL</span> TV
          </div>
          <p className="text-[10px] tracking-[3px] text-gray-300 uppercase mb-6 font-sans">
            Be The Light Television
          </p>

          {/* Gold divider */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-btl-red via-amber-500 to-btl-red mb-6" />

          {/* Title */}
          <h2 className="text-2xl md:text-3xl tracking-[3px] text-gray-900 uppercase font-bold mb-2 font-serif">
            Certificate of Completion
          </h2>
          <p className="text-xs tracking-[2px] text-gray-400 uppercase mb-6 font-sans">
            This certifies that
          </p>

          {/* Recipient name */}
          <p className="text-3xl md:text-5xl font-black text-gray-900 mb-2 font-serif tracking-wide">
            {userName}
          </p>
          <div className="w-40 h-0.5 bg-gray-100 mb-4" />

          {/* Description */}
          <p className="text-sm text-gray-500 font-sans mb-2">
            has successfully completed the course
          </p>

          {/* Course name */}
          <p className="text-xl md:text-2xl text-btl-red font-bold mb-6 font-serif">
            {courseName}
          </p>

          {/* Details row */}
          <div className="flex gap-8 md:gap-16 justify-center mb-6">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-sans">Date</p>
              <p className="text-sm text-gray-700 font-semibold font-serif mt-1">{date}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-sans">Certificate ID</p>
              <p className="text-sm text-gray-700 font-semibold font-serif mt-1">{certId}</p>
            </div>
          </div>

          {/* Seal */}
          <div className="w-16 h-16 rounded-full border-[3px] border-btl-red flex items-center justify-center mb-4">
            <span className="font-serif font-black text-btl-red text-xl">BTL</span>
          </div>

          {/* Footer */}
          <p className="text-[10px] text-gray-300 font-sans">BTL TV — btl-tv.com</p>
        </div>
      </div>

      {/* Download button */}
      <Button onClick={handlePrint} className="mt-6 w-full bg-btl-red hover:bg-btl-red/90 text-white h-12 rounded-xl font-sans">
        <Download className="h-5 w-5 mr-2" /> Download Certificate (PDF)
      </Button>
    </div>
  );
}
