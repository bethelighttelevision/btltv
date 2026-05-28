"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, Cross, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<any>(null);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const detectPWA = () => {
      const ua = navigator.userAgent;
      const ios = /iPad|iPhone|iPod/.test(ua);
      setIsIos(ios);
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);
      if (ios && !standalone) {
        const dismissed = sessionStorage.getItem('btl-ios-install-dismissed');
        if (!dismissed) setShowIosInstall(true);
      }
    };
    requestAnimationFrame(detectPWA);
    const handler = (e: Event) => {
      e.preventDefault();
      setPwaInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handler = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-btl-dark">
      <Header />
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        {children}
        <Footer />
      </main>

      {showScrollTop && (
        <button
          onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full bg-btl-red text-white shadow-lg flex items-center justify-center hover:bg-btl-red-dark transition-all"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {!isStandalone && (pwaInstallPrompt || (isIos && showIosInstall)) && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden">
          <div className="bg-btl-darker/98 backdrop-blur-md border-t border-btl-red/30 px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-btl-red/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-btl-red" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">Install BTL TV App</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {isIos ? 'Tap Share ⬆ then "Add to Home Screen"' : "Add to home screen for quick access"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {pwaInstallPrompt ? (
                <Button
                  size="sm"
                  className="bg-btl-red hover:bg-btl-red-dark text-white text-xs h-8 px-3"
                  onClick={async () => {
                    await (pwaInstallPrompt as any).prompt();
                    setPwaInstallPrompt(null);
                  }}
                >
                  Install
                </Button>
              ) : isIos ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-btl-red/50 text-btl-red text-xs h-8 px-3"
                  onClick={() => {
                    toast.info('Tap the Share button (⬆) at the bottom of Safari, then select "Add to Home Screen"', { duration: 6000 });
                  }}
                >
                  How?
                </Button>
              ) : null}
              <button
                onClick={() => {
                  if (isIos) {
                    setShowIosInstall(false);
                    sessionStorage.setItem("btl-ios-install-dismissed", "1");
                  }
                  setPwaInstallPrompt(null);
                }}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <Cross className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
